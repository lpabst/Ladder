const game = {
  init: function () {
    const canvas = new Canvas("canvas");
    canvas.clear();
    const data = { canvas };
    game.run(data);
  },

  run: function (data) {
    console.log(data);
  },
};

game.init();
