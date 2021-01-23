const game = {
  init: () => {
    const canvas = new Canvas("canvas");
    canvas.clear();
    canvas.drawLine(20, 20, 60, 20, "orange");
    canvas.drawCircle(100, 100, 50, 50, "blue", false);
    canvas.drawCircle(200, 100, 50, 50, "blue", true);
    canvas.drawRect(300, 300, 50, 50, "yellow", true);
    canvas.drawRect(400, 400, 80, 20, "purple", false);
  },
};

game.init();
