const game = {
  /*********** INITIALIZATION ******************/

  init: function () {
    // create data object to be passed around
    const data = {
      canvas: null,
      gameOver: false,
      gameRunning: true,
      animationFrame: 0,
      player: null,
      playerJustDied: false,
      enemyPortal: null,
      levelCompletePortal: null,
      enemies: [],
      walls: [],
      ladders: [],
      food: [],
      eventListeners: [],
      keys: { down: {} },
      gameLevel: 1,
    };

    game.initCanvas(data);
    game.initEventListeners(data);
    game.initEntities(data);

    game.run(data);
  },

  initCanvas: function (data) {
    const canvas = new Canvas("canvas");
    canvas.clear();
    data.canvas = canvas;
  },

  initEventListeners: function (data) {
    // helper function creates the event listener and adds it to the data.eventListeners array so we can unbind it later
    function createEventListner(target, eventType, handler) {
      target.addEventListener(eventType, handler);
      data.eventListeners.push({
        target: target,
        eventType: eventType,
        handler: handler,
      });
    }

    createEventListner(window, "keydown", (e) => game.handleKeydown(e, data));
    createEventListner(window, "keyup", (e) => game.handleKeyup(e, data));
  },

  // create entities & add to data oject
  initEntities(data) {
    const player = new Player(380, 480);
    data.player = player;

    const ladder = new Ladder(200, 430);
    data.ladders.push(ladder);

    const enemyPortal = new EnemyPortal(600, 300, true);
    data.enemyPortal = enemyPortal;

    const levelCompletePortal = new LevelCompletePortal(600, 580);
    data.levelCompletePortal = levelCompletePortal;

    const floor = new Wall(500, 320, 300, 4);
    const floor2 = new Wall(350, 600, 400, 4);
    const floor3 = new Wall(200, 680, 400, 4);
    const floor4 = new Wall(100, 750, 400, 4);
    const wall1 = new Wall(580, 720, 4, 30);
    const wall2 = new Wall(580, 570, 4, 30);
    const wall3 = new Wall(380, 650, 4, 30);
    const wall4 = new Wall(480, 650, 4, 30);
    const wall5 = new Wall(380, 550, 4, 30);
    data.walls.push(floor);
    data.walls.push(floor2);
    data.walls.push(floor3);
    data.walls.push(floor4);
    data.walls.push(wall1);
    data.walls.push(wall2);
    data.walls.push(wall3);
    data.walls.push(wall4);
    data.walls.push(wall5);
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
      // see if player is touching the level complete portal
    if (isCollision(data.player, data.levelCompletePortal)) {
        data.gameLevel++;
        data.player.lives++;
        data.player.x = 380;
        data.player.y = 480;
        // TODO: start new level instead of just resetting player position
    }

    // if player is out of lives, it's game over
    if (data.player.lives <= 0) {
      game.gameOver(data);
    }

    if (data.playerJustDied) {
      data.playerJustDied = false;
      data.player.x = 380;
      data.player.y = 480;
      // reset player position but keep level going
    }

    // tell entities that move to move themselves
    data.player.update(data);
    data.enemies.forEach((enemy, index) => enemy.update(data, index));

    // check enemy collisions
    var playerHitEnemy = data.enemies.some(enemy => isCollision(data.player, enemy));
    if (playerHitEnemy) {
        data.player.lives--;
        data.playerJustDied = true;
    }

    // spawn enemies every so often
    if (data.enemyPortal && data.animationFrame % 100 === 0) {
      const enemy = new Enemy(
        data.enemyPortal.x,
        data.enemyPortal.y,
        data.enemyPortal.spawnMovingLeft
      );
      data.enemies.push(enemy);
    }
  },

  render: function (data) {
    data.canvas.clear();
    data.canvas.drawText(0, 0, "Level: " + data.gameLevel, "white", 25);
    data.canvas.drawText(0, 30, "Lives: " + data.player.lives, "white", 25);
    data.player.render(data);
    data.enemyPortal.render(data);
    data.levelCompletePortal.render(data);
    data.enemies.forEach((enemy) => enemy.render(data));
    data.walls.forEach((wall) => wall.render(data));
    data.ladders.forEach((ladder) => ladder.render(data));
    data.food.forEach((food) => food.render(data));
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

// get everything rolling
game.init();
