function Player(x, y) {
  this.x = x;
  this.y = y;
  this.fontSize = 20;;
  this.w = this.fontSize;
  this.h = this.fontSize;
  this.speed = 2;
  this.text = "p";
  this.color = "gray";

  // called by the game.update method
  this.update = function (data) {
    // update player location based on which keys are down
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var upArrowDown = data.keys.down[38];
    var newX = this.x;
    var newY = this.y;

    if (leftArrowDown) {
      newX = this.x - this.speed;
    }
    if (upArrowDown && data.isOnLadder) {
      newY = this.y - this.speed;
    }
    if (rightArrowDown) {
      newX = this.x + this.speed;
    }

    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > data.canvas.width - this.w) newX = data.canvas.width - this.w;
    if (newY > data.canvas.height - this.h) newY = data.canvas.height - this.h;
    this.x = newX;
    this.y = newY;
  };

  // called by the game.render method
  this.render = function (data) {
    data.canvas.drawText(this.x, this.y, this.text, this.color, this.fontSize);
  };
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.fontSize = 20;
  this.w = this.fontSize;
  this.h = this.fontSize;
  this.speed = 2;
  this.text = "e";
  this.color = "gray";

  this.update = function (data) {
    // go towards the exit
  };

  this.render = function (data) {
    data.canvas.drawText(this.x, this.y, this.text, this.color, this.fontSize);
  };
}

function Ladder(x, y) {
  this.x = x;
  this.y = y;
  this.w = 20;
  this.h = 80;
  this.numRungs = 4;
  this.rungSpacing = this.h / (this.numRungs + 1);

  this.update = function () {
    return;
  };

  this.render = function (data) {
    var top = this.y;
    var bottom = this.y + this.h;
    var left = this.x;
    var right = this.x + this.w;
    this.color = "green";

    // draw sides
    data.canvas.drawLine(left, top, left, bottom, this.color);
    data.canvas.drawLine(right, top, right, bottom), this.color;

    // draw rungs
    for (var i = 1; i <= this.numRungs; i++) {
      var rungY = top + this.rungSpacing * i;
      data.canvas.drawLine(left, rungY, right, rungY, this.color);
    }
  };
}

function Wall(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = 'red';

  this.update = function () {
    return;
  };

  this.render = function (data) {
    data.canvas.drawRect(this.x, this.y, this.w, this.h, this.color, true);
  };
}