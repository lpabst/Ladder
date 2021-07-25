require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const massive = require("massive");
const path = require('path');

// helper function
function randomString(length) {
  var characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let str = "";
  while (str.length < length) {
    var randomCharacterIndex = Math.floor(Math.random() * characters.length);
    var randomCharacter = characters.charAt(randomCharacterIndex);
    str += randomCharacter;
  }
  return str;
}

async function startNodeService() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const connectionOptions = {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true,
  };
  const db = await massive(connectionOptions).catch((e) => {
    console.error("error connecting to db");
    throw e;
  });
  console.log('db connected');
  app.set("db", db);

  // host front end 
  app.use(express.static(path.join(__dirname, '../public')));

  // health
  app.get('/health', (req, res) => {
    return res.status(200).send('ok')
  })

  app.post("/game/start", (req, res) => {
    try {
      if (!req.body || !req.body.startToken) {
        return res
          .status(400)
          .send({ error: true, message: "Invalid start token" });
      }
      const difficulty = req.body.difficulty;
      const challengeMode = req.body.challengeMode;

      // generate game token cookie
      const gameToken = {
        token: randomString(64),
        startTime: new Date().getTime(),
        difficulty,
        challengeMode,
      };
      res.cookie("gameToken", gameToken, {
        httpOnly: true,
        signed: true,
      });
      res.status(204).end();
    } catch (e) {
      res.status(500).end();
    }
  });

  app.post("/game/end", async (req, res) => {
    try {
      if (!req.body || req.body.score === undefined) {
        return res
          .status(400)
          .send({ error: true, message: "Name and score are required" });
      }

      const ipAddress = req.ip || "";
      const potentialNewHighScoreData = {
        ip: ipAddress,
        name: req.body.name,
        score: req.body.score,
        time_elapsed: -1,
        points_per_second: -1,
        game_token: "missing",
      };

      const db = req.app.get("db");

      // see how many cheater rows we've tracked
      const cheatersRowCountResult = await db.query(
        "select count(id) from cheaters"
      );
      const cheatersRowCount = cheatersRowCountResult[0].count;

      // if game token isn't present, end here
      const gameToken = req.signedCookies.gameToken;
      if (!gameToken) {
        console.log("caught someone with no game token");
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      // clear gameToken cookie and track token for db to guarantee unique entries per game
      res.clearCookie("gameToken");
      potentialNewHighScoreData.game_token = gameToken.token;

      const now = new Date().getTime();
      const timeElapsed = now - gameToken.startTime;
      potentialNewHighScoreData.time_elapsed = timeElapsed;

      // if less than 20 seconds has elapsed, end here. You can't really die and end the game faster than that
      // This also slows down hacking attempts, and games that short won't get high scores anyways
      if (timeElapsed < 20000) {
        console.log("caught someone with time less than 20 seconds");
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      // It is quite literally impossible to score more than 17 points per second with the current setup in infinite mode. I played with dying turned off and constant points per second tracking, and played near perfectly, and was only able to get up to 16.9999 at any given point
      let pointsPerSecondThreshold = 17;
      if (gameToken.challengeMode) {
        // I haven't tested challenge mode yet, but 22 should be a safe buffer for now
        const pointsMultiplier = 1 + Math.floor(gameToken / 10);
        pointsPerSecondThreshold = 22 * pointsMultiplier;
      }

      const pointsPerSecond = (req.body.score / timeElapsed) * 1000;
      potentialNewHighScoreData.points_per_second = pointsPerSecond;

      // it takes time to score points, so if the score is too high for how much time has elapsed, end here
      if (pointsPerSecond > pointsPerSecondThreshold) {
        console.log("caught someone with too many points per second");
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      /***************** END CHEATING CHECKS *****************/
      if (gameToken.challengeMode) {
        // include difficulty in potential db record
        potentialNewHighScoreData.difficulty = gameToken.difficulty;

        // check current high scores
        const highScores = await db.query(
          "SELECT * from challenge_scores ORDER BY score DESC LIMIT 20"
        );

        // if we have less than 20 high scores, add this one
        if (highScores.length < 20) {
          await db.challenge_scores.insert(potentialNewHighScoreData);
        }

        // if this is higher than the lowest of our top 20 scores, delete the lowest and add this one
        const lowestHighScore = highScores[highScores.length - 1];
        if (req.body.score > lowestHighScore.score) {
          await db.challenge_scores.destroy({ id: lowestHighScore.id });
          await db.challenge_scores.insert(potentialNewHighScoreData);
        }
      } else {
        // check current high scores
        const highScores = await db.query(
          "SELECT * from scores ORDER BY score DESC LIMIT 20"
        );

        // if we have less than 20 high scores, add this one
        if (highScores.length < 20) {
          await db.scores.insert(potentialNewHighScoreData);
        }

        // if this is higher than the lowest of our top 20 scores, delete the lowest and add this one
        const lowestHighScore = highScores[highScores.length - 1];
        if (req.body.score > lowestHighScore.score) {
          await db.scores.destroy({ id: lowestHighScore.id });
          await db.scores.insert(potentialNewHighScoreData);
        }
      }

      res.status(204).end();
    } catch (e) {
      res.status(500).end();
    }
  });

  app.get("/scores", async (req, res) => {
    try {
      const highScores = await db.query(
        "SELECT * from scores ORDER BY score DESC LIMIT 10"
      );
      const challengeHighScores = await db.query(
        "SELECT * from challenge_scores ORDER BY score DESC LIMIT 10"
      );
      return res.status(200).send({
        highScores: highScores.map((row) => ({
          name: row.name,
          score: row.score,
          timeElapsed: row.time_elapsed,
        })),
        challengeHighScores: challengeHighScores.map((row) => ({
          name: row.name,
          score: row.score,
          timeElapsed: row.time_elapsed,
          difficulty: row.difficulty,
        })),
      });
    } catch (e) {
      res.status(500).end();
    }
  });

  app.listen(process.env.PORT, () => console.log(`App is running on ${process.env.PORT}`));
}

startNodeService();
