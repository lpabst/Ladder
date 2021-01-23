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
      entities: [],
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

  initEntities(data) {
    // create entities & add to data oject
    const player = new Player(100, 400);
    data.player = player;
    data.entities.push(player);
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

    // update player location based on which keys are down
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var upArrowDown = data.keys.down[38];
    var downArrowDown = data.keys.down[40];

    if (leftArrowDown) {
      data.player.x -= data.player.speed;
    }
    if (rightArrowDown) {
      data.player.x += data.player.speed;
    }
    if (upArrowDown) {
      data.player.y -= data.player.speed;
    }
    if (downArrowDown) {
      data.player.y += data.player.speed;
    }
  },

  render: function (data) {
    data.canvas.clear();
    data.entities.forEach((entity) => {
      switch (entity.drawType) {
        case "line":
          data.canvas.drawLine(
            entity.x,
            entity.y,
            entity.toX,
            entity.toY,
            entity.color
          );
        case "circle":
          data.canvas.drawCircle(
            entity.x,
            entity.y,
            entity.radius,
            entity.color,
            entity.fill
          );
        case "rect":
          data.canvas.drawRect(
            entity.x,
            entity.y,
            entity.width,
            entity.height,
            entity.color,
            entity.fill
          );
        case "text":
          data.canvas.drawText(
            entity.x,
            entity.y,
            entity.text,
            entity.color,
            entity.fontSize
          );
      }
    });
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
