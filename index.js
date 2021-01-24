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
      enemies: [],
      walls: [],
      ladders: [],
      food: [],
      eventListeners: [],
      keys: { down: {} },
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
    const player = new Player(400, 260);
    data.player = player;

    const ladder = new Ladder(200, 330);
    data.ladders.push(ladder);

    const enemy = new Enemy(500, 400);
    data.enemies.push(enemy);

    // const floor2 = new Wall(200, 600, 400, 3);
    const floor3 = new Wall(100, 790, 400, 3);
    const floor4 = new Wall(580, 770, 3, 30);
    // data.walls.push(floor2);
    data.walls.push(floor3);
    data.walls.push(floor4);
  },

  /***************** END INITIALIZATION ******************/

  /***************** EVENT HANDLERS ******************/

  handleKeydown: function (e, data) {
    // get key code and prevent default action for that key
    const key = e.which || e.keyCode || 0;
    if (key === 32 || (key >= 37 && key <= 40)) {
      e.preventDefault();
    }

    if (key === 32) {
      return game.pauseGame(data);
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
    // check collisions

    // tell entities that move to move themselves
    data.player.update(data);
    data.enemies.forEach((enemy) => enemy.update(data));
  },

  render: function (data) {
    data.canvas.clear();
    data.player.render(data);
    data.enemies.forEach((enemy) => enemy.render(data));
    data.walls.forEach((wall) => wall.render(data));
    data.ladders.forEach((ladder) => ladder.render(data));
    data.food.forEach((food) => food.render(data));
    data.canvas.drawRect(
      data.player.x,
      data.player.y,
      data.player.w,
      data.player.h,
      "blue"
    );
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
