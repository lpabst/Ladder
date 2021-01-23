const game = {
  init: function () {
    const canvas = new Canvas("canvas");
    canvas.clear();

    const player = new Player(100, 400);

    const data = {
      canvas,
      gameOver: false,
      gameRunning: true,
      animationFrame: 0,
      entities: [player],
    };

    game.run(data);
  },

  run: function (data) {
    function loop() {
      if (data.gameOver) {
        game.gameOver(data);
      } else {
        if (data.gameRunning) {
          game.update(data);
          game.render(data);
          data.animationFrame++;
        }

        window.requestAnimationFrame(loop);
      }
    }

    loop();
  },

  update: function(data) {
      // check collisions
      // update object locations
  },

  render: function(data) {
    data.canvas.clear();
    data.entities.forEach(entity => {
        switch(entity.drawType) {
            case 'line': data.canvas.drawLine(entity.x, entity.y, entity.toX, entity.toY, entity.color)
            case 'circle': data.canvas.drawCircle(entity.x, entity.y, entity.radius, entity.color, entity.fill);
            case 'rect': data.canvas.drawRect(entity.x, entity.y, entity.width, entity.height, entity.color, entity.fill)
            case 'text': data.canvas.drawText(entity.x, entity.y, entity.text, entity.color, entity.fontSize);
        }
    })
  },

  gameOver: function (data) {
    // end game
  },
};

game.init();
