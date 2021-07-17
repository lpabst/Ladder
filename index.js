require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const massive = require("massive");

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
  app.set("db", db);

  app.post("/game/start", (req, res) => {
    try {
      // this doesn't really matter but will slow down hacking attempts
      if (!req.body || !req.body.startToken) {
        return res
          .status(400)
          .send({ error: true, message: "Invalid start token" });
      }

      // generate game token cookie
      const gameToken = {
        token: randomString(64),
        startTime: new Date().getTime(),
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
      if (!req.body || !req.body.name || !req.body.score) {
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
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      // clear gameToken
      res.clearCookie("gameToken");

      const now = new Date().getTime();
      const timeElapsed = now - gameToken.startTime;
      potentialNewHighScoreData.time_elapsed = timeElapsed;

      // if less than 10 seconds has elapsed, end here. This also slows down hacking attempts, and games that short won't get high scores anyways
      if (timeElapsed < 10000) {
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      const pointsPerSecondThreshold = 50;
      const pointsPerSecond = (req.body.score / timeElapsed) * 1000;
      potentialNewHighScoreData.points_per_second = pointsPerSecond;

      // it takes time to score points, so if the score is too high for how much time has elapsed, end here
      if (pointsPerSecond > pointsPerSecondThreshold) {
        if (cheatersRowCount < 500) {
          await db.cheaters.insert(potentialNewHighScoreData);
        }
        return res.status(204).end();
      }

      /***************** END CHEATING CHECKS *****************/
      // check current high scores
      const highScores = await db.query(
        "SELECT * from scores ORDER BY score DESC LIMIT 10"
      );

      // if we have less than 10 high scores, add this one
      if (highScores.length < 10) {
        await db.scores.insert({
          ip: ipAddress,
          name: req.body.name,
          score: req.body.score,
          time_elapsed: timeElapsed,
          points_per_second: pointsPerSecond,
        });
      }

      // if this is higher than the lowest of our top 10 scores, delete the lowest and add this one
      const lowestHighScore = highScores[highScores.length - 1];
      if (req.body.score > lowestHighScore.score) {
        await db.scores.destroy({ id: lowestHighScore.id });
        await db.scores.insert({
          ip: ipAddress,
          name: req.body.name,
          score: req.body.score,
          time_elapsed: timeElapsed,
          points_per_second: pointsPerSecond,
        });
      }

      res.status(204).end();
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  app.get("/scores", async (req, res) => {
    try {
      const highScores = await db.query(
        "SELECT * from scores ORDER BY score DESC LIMIT 10"
      );
      console.log(highScores);
      return res.status(200).send({
        highScores: highScores.map((row) => ({
          name: row.name,
          score: row.score,
          timeElapsed: req.time_elapsed,
        })),
      });
    } catch (e) {
      console.error(e);
      res.status(500).end();
    }
  });

  const port = 8080;
  app.listen(port, () => console.log(`App is running on ${port}`));
}

startNodeService();
