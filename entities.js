var gravity = 2;
let unhandledCollision = null;

// check if entities are touching in any way
function isCollision(entity1, entity2) {
  var entity1Left = entity1.x;
  var entity1Right = entity1.x + entity1.w;
  var entity1Top = entity1.y;
  var entity1Bottom = entity1.y + entity1.h;
  var entity2Left = entity2.x;
  var entity2Right = entity2.x + entity2.w;
  var entity2Top = entity2.y;
  var entity2Bottom = entity2.y + entity2.h;

  var sameVerticalSpace =
    entity1Left < entity2Right && entity1Right > entity2Left;
  var sameHorizontalSpace =
    entity1Top < entity2Bottom && entity1Bottom > entity2Top;

  if (sameVerticalSpace && sameHorizontalSpace) return true;
  else return false;
}

function Player(x, y) {
  this.x = x;
  this.y = y;
  this.fontSize = 20;
  this.w = this.fontSize / 2;
  this.h = this.fontSize;
  this.speed = 2;
  this.text = "p";
  this.color = "gray";

  // called by the game.update method
  this.update = function (data) {
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var upArrowDown = data.keys.down[38];
    var newX = this.x;
    var newY = this.y;

    // update player location based on which keys are down
    if (leftArrowDown && !rightArrowDown) {
      newX = this.x - this.speed;
    }
    if (rightArrowDown && !leftArrowDown) {
      newX = this.x + this.speed;
    }

    var isToucingLadder = data.ladders.some((ladder) =>
      isCollision(this, ladder)
    );

    // gravity makes us fall if we aren't touching a ladder
    if (!isToucingLadder) newY += gravity;

    // if we are touching a ladder, we can move upward
    // if (isToucingLadder && upArrowDown) newY -= this.speed;
    if (upArrowDown) newY -= this.speed + 2;

    // if we're now touching a wall, make sure we don't move through it at all
    data.walls.forEach((wall) => {
      var wallCollision = isCollision(
        { x: newX, y: newY, w: this.w, h: this.h },
        wall
      );

      if (wallCollision) {
        var wallTop = wall.y;
        var wallBottom = wall.y + wall.h;
        var wallLeft = wall.x;
        var wallRight = wall.x + wall.w;

        // if our new bottom is in the wall, cancel any vertical movement
        var bottom = this.y + this.h;
        var newBottom = newY + this.h;
        var right = this.x + this.w;
        var newRight = newX + this.w;

        // see which aspects of player are colliding with wall
        var topIsInWall = this.y > wallTop && this.y < wallBottom;
        var newTopIsInWall = newY > wallTop && newY < wallBottom;
        var bottomIsInWall = bottom > wallTop && bottom < wallBottom;
        var newBottomIsInWall = newBottom > wallTop && newBottom < wallBottom;
        var leftIsInWall = this.x > wallLeft && this.x < wallRight;
        var newLeftIsInWall = newX > wallLeft && newX < wallRight;
        var rightIsInWall = right > wallLeft && right < wallRight;
        var newRightIsInWall = newRight > wallLeft && newRight < wallRight;
        var wallIsInNewPlayerVertically =
          wallTop >= newY && wallBottom <= newBottom;
        var wallIsInNewPlayerHorizontally =
          wallLeft >= newX && wallRight <= newRight;

        // if new top/bottom is in wall, and current left/right is in wall, cancel y movement
        if (
          (newTopIsInWall || newBottomIsInWall) &&
          (leftIsInWall || rightIsInWall || wallIsInNewPlayerHorizontally)
        ) {
          newY = this.y;
        }

        // if new left/right is in wall && current top/bottom is in wall, cancel x movement
        if (
          (newLeftIsInWall || newRightIsInWall) &&
          (topIsInWall || bottomIsInWall || wallIsInNewPlayerVertically)
        ) {
          newX = this.x;
        }
      }
    });

    // map edges are boundaries
    if (newX < 0) newX = 0;
    if (newY < 0) newY = 0;
    if (newX > data.canvas.w - 12) newX = data.canvas.w - 12;
    if (newY > data.canvas.h - this.h) newY = data.canvas.h - this.h;
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
  this.direction = "left";

  this.update = function (data) {
    this.y += gravity;
    if (this.direction === "left") this.x -= this.speed;
    else this.x += this.speed;
    // if on a wall, move in a direction. Otherwise, fall with gravity
    // Move the same direction until you hit a wall, then reverse direction
    // eventually disappears off the map
  };;

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

  this.render = function (data) {
    this.color = "green";

    // draw sides
    data.canvas.drawLine(
      this.left,
      this.top,
      this.left,
      this.bottom,
      this.color
    );
    data.canvas.drawLine(
      this.right,
      this.top,
      this.right,
      this.bottom,
      this.color
    );

    // draw rungs
    for (var i = 1; i <= this.numRungs; i++) {
      var rungY = this.top + this.rungSpacing * i;
      data.canvas.drawLine(this.left, rungY, this.right, rungY, this.color);
    }
  };
}

function Wall(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = "white";

  this.render = function (data) {
    data.canvas.drawRect(this.x, this.y, this.w, this.h, this.color, true);
  };
}
