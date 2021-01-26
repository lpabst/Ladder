const game = {
  /*********** INITIALIZATION ******************/

  init: function () {
    // hide editor button
    document.getElementById("editButton").classList.add("hidden");

    // create data object to be passed around
    const data = {
      canvas: null,
      gameOver: false,
      gameRunning: true,
      animationFrame: 0,
      player: null,
      playerJustDied: false,
      enemyPortals: [],
      levelCompletePortal: null,
      enemies: [],
      walls: [],
      ladders: [],
      food: [],
      pointsFood: [],
      spikes: [],
      eventListeners: [],
      keys: { down: {} },
      gameLevel: 1,
      levelStartTime: null,
      levelTimeAllowed: null,
      levelTimeRemaining: null,
      points: 0,
      lives: 2,
    };

    game.initCanvas(data);
    game.initEventListeners(data);
    game.initLevel(data);

    game.run(data);
  },

  initCanvas: function (data) {
    const canvas = new Canvas("canvas");
    canvas.clear();
    data.canvas = canvas;
  },

  initEventListeners: function (data) {
    // helper function creates the event listener and adds it to the data.eventListeners array so we can unbind it later
    function createEventListener(target, eventType, handler) {
      target.addEventListener(eventType, handler);
      data.eventListeners.push({
        target: target,
        eventType: eventType,
        handler: handler,
      });
    }

    createEventListener(window, "keydown", (e) => game.handleKeydown(e, data));
    createEventListener(window, "keyup", (e) => game.handleKeyup(e, data));
  },

  initLevel(data, retry = false) {
    var level = levelData[data.gameLevel];

    // if we complete all of the levels, start back at level 1
    if (!level) {
      // if retry is true, then we tried to start back at level one, but something still went wrong
      if (retry) {
        console.error("Something went wrong, please try again later: ");
        data.gameOver(data);
        return;
      }

      // otherwise, set game level back to 1 and try to init the level again
      data.gameLevel = 1;
      game.initLevel(data, true);
    }

    // build the entities for this level
    this.initEntitiesForLevel(data);

    // track the start time and how much time is allowed for each level
    data.levelStartTime = new Date().getTime();
    data.levelTimeAllowed = level.timeAllowed;
    data.levelTimeRemaining = level.timeAllowed;
  },

  initEntitiesForLevel(data) {
    var level = levelData[data.gameLevel];

    // see if we're missing data in our level setup info
    if (
      !level.player ||
      !level.enemyPortals ||
      !level.levelCompletePortal ||
      !level.walls
    ) {
      console.error("Invalid level data: ", level);
    }
    if (!level.food || !level.ladders) {
      console.warn("Are we missing level data? ", level);
    }

    // reset all entity info fresh
    data.player = null;
    data.levelCompletePortal = null;
    data.enemyPortals = [];
    data.walls = [];
    data.enemies = [];
    data.food = [];
    data.ladders = [];

    // build entities from level setup info
    data.player = new Player(level.player.x, level.player.y);
    level.enemyPortals.forEach((portal) => {
      data.enemyPortals.push(
        new EnemyPortal(portal.x, portal.y, portal.spawnMovingLeft)
      );
    });
    data.levelCompletePortal = new LevelCompletePortal(
      level.levelCompletePortal.x,
      level.levelCompletePortal.y
    );
    level.walls.forEach((wall) => {
      data.walls.push(new Wall(wall.x, wall.y, wall.w, wall.h));
    });
    level.food.forEach((food) => {
      data.food.push(new Food(food.x, food.y));
    });
    level.pointsFood.forEach((pointsFood) => {
      data.pointsFood.push(new PointsFood(pointsFood.x, pointsFood.y));
    });
    level.ladders.forEach((ladder) => {
      data.ladders.push(new Ladder(ladder.x, ladder.y, ladder.h));
    });
    level.spikes.forEach((spike) => {
      data.spikes.push(new Spike(spike.x, spike.y));
    });
  },

  /***************** END INITIALIZATION ******************/

  /***************** EVENT HANDLERS ******************/

  handleKeydown: function (e, data) {
    // get key code and prevent default action for that key
    const key = e.which || e.keyCode || 0;
    if (key === 27 || key === 32 || (key >= 37 && key <= 40)) {
      e.preventDefault();
    }

    // esc key pauses game
    if (key === 27) {
      game.pauseGame(data);
    }

    // keep track of which keys are down
    data.keys.down[key] = true;
  },

  handleKeyup: function (e, data) {
    const key = e.which || e.keyCode || 0;
    data.keys.down[key] = false;
  },

  /***************** END EVENT HANDLERS ******************/

  /***************** GAME LOOP ******************/

  run: function (data) {
    function loop() {
      if (data.gameOver) {
        game.gameOver(data);
      } else {
        if (data.gameRunning) {
          game.render(data);
          game.update(data);
          data.animationFrame++;
        }

        window.requestAnimationFrame(loop);
      }
    }

    loop();
  },

  update: function (data) {
    // if user is touching a piece of food, gain a level and destroy the food
    data.food.forEach((food, index) => {
      if (isCollision(food, data.player)) {
        data.lives++;
        data.food.splice(index, 1);
      }
    });

    // if user is touching a piece of pointsFood, gain some points and destroy the food
    data.pointsFood.forEach((pointsFood, index) => {
      if (isCollision(pointsFood, data.player)) {
        data.points += 100;
        data.pointsFood.splice(index, 1);
      }
    });

    // see if player is touching the level complete portal
    if (isCollision(data.player, data.levelCompletePortal)) {
      data.gameLevel++;
      data.lives++;
      data.points += 100;
      game.initLevel(data);
    }

    // if player is out of lives, it's game over
    if (data.lives <= 0) {
      game.gameOver(data);
    }

    // update level timer and see if time is up for the level
    var now = new Date().getTime();
    var timeElapsedSinceLevelStart = now - data.levelStartTime;
    var timeLeft = data.levelTimeAllowed - timeElapsedSinceLevelStart;
    data.levelTimeRemaining = timeLeft;
    if (data.levelTimeRemaining <= 0) {
      data.playerJustDied = true;
    }

    // tell entities that move to move themselves
    data.player.update(data);
    data.enemies.forEach((enemy, index) => enemy.update(data, index));

    // check for player collisions with enemy or spikes
    var playerHitEnemy = data.enemies.some((enemy) =>
      isCollision(data.player, enemy)
    );
    var playerHitSpike = data.spikes.some((spike) =>
      isCollision(spike, data.player)
    );
    if (playerHitEnemy || playerHitSpike) {
      data.playerJustDied = true;
    }

    // if player falls off the bottom, they die
    if (data.player.y > data.canvas.h - data.player.h) {
      data.playerJustDied = true;
    }

    if (data.playerJustDied) {
      // reset player position & level timer, but keep level going
      data.playerJustDied = false;
      data.levelStartTime = new Date().getTime();
      data.levelTimeRemaining = data.levelTimeAllowed;
      data.lives--;
      data.player.x = data.player.startX;
      data.player.y = data.player.startY;
    }

    // spawn enemies every so often
    data.enemyPortals.forEach((portal) => {
      portal.maybeSpawnEnemy(data);
    });
  },

  render: function (data) {
    var timeRemainingFormatted = (data.levelTimeRemaining / 1000).toFixed(1);
    var timerColor = timeRemainingFormatted < 10 ? "red" : "white";

    data.canvas.clear();
    data.canvas.drawText(
      0,
      0,
      "Timer: " + timeRemainingFormatted,
      timerColor,
      18
    );
    data.canvas.drawText(0, 20, "Level: " + data.gameLevel, "white", 18);
    data.canvas.drawText(0, 40, "Lives: " + data.lives, "white", 18);
    data.canvas.drawText(0, 60, "Points: " + data.points, "white", 18);
    data.player.render(data);
    data.enemyPortals.forEach((portal) => portal.render(data));
    data.levelCompletePortal.render(data);
    data.enemies.forEach((enemy) => enemy.render(data));
    data.walls.forEach((wall) => wall.render(data));
    data.ladders.forEach((ladder) => ladder.render(data));
    data.food.forEach((food) => food.render(data));
    data.pointsFood.forEach((pointsFood) => pointsFood.render(data));
    data.spikes.forEach((spike) => spike.render(data));
  },

  /***************** END GAME LOOP ******************/

  /***************** OTHER METHODS ******************/

  pauseGame: function (data) {
    if (data.gameRunning) {
      // stop player movement
      data.keys.down = {};
      data.gameRunning = false;
      data.canvas.drawText(270, 350, "GAME PAUSED", "white", 40);
    } else {
      data.gameRunning = true;
    }
  },

  gameOver: function (data) {
    data.gameOver = true;
    data.gameRunning = false;
    game.removeEventListeners(data);
    data.canvas.drawText(270, 350, "GAME OVER", "white", 40);
  },

  // unbinds all of the event listeners saved in the data.eventListeners list
  removeEventListeners: function (data) {
    data.eventListeners.forEach(function (eventListener) {
      eventListener.target.removeEventListener(
        eventListener.eventType,
        eventListener.handler
      );
    });
    data.eventListeners = [];
  },
};
