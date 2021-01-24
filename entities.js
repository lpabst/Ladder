var gravityAcceleration = 0.4;
var maxGravitySpeed = 2;
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
  this.w = 11;
  this.h = 18;
  this.speed = 2;
  this.text = "p";
  this.color = "gray";
  this.yVel = 0;
  this.availableJumps = 2;
  this.jumpVel = -7;

  // called by the game.update method
  this.update = function (data) {
    var spacebarDown = data.keys.down[32];
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var upArrowDown = data.keys.down[38];
    var newX = this.x;
    var newY = this.y;

    // update player x location based on which keys are down
    if (leftArrowDown && !rightArrowDown) {
      newX = this.x - this.speed;
    }
    if (rightArrowDown && !leftArrowDown) {
      newX = this.x + this.speed;
    }

    // if we are touching a ladder, we can move upward
    var isToucingLadder = data.ladders.some((ladder) =>
      isCollision(this, ladder)
    );
    if (isToucingLadder && upArrowDown) newY -= this.speed;

    // if we aren't touching a ladder we are affected by gravity and jumps
    if (!isToucingLadder) {
      // if you are falling downward, you cannot jump
      if (this.yVel > 0) {
        console.log(this.yVel)
        this.availableJumps = 0;
      }
      
      // gravity accelerates us up to a max speed
      if (this.yVel < maxGravitySpeed) {
        this.yVel += gravityAcceleration;
      }

      // make player jump if space bar is pressed
      if (spacebarDown && this.availableJumps > 0) {
        data.keys.down[32] = false;
        this.availableJumps--;
        this.yVel = this.jumpVel;
        console.log("jumps: ", this.availableJumps);
      }
    }

    newY += this.yVel;

    // if we're now touching a wall, make sure we don't move through it at all
    data.walls.forEach((wall) => {
      var newPositionCollidesWithWall = isCollision(
        { x: newX, y: newY, w: this.w, h: this.h },
        wall
      );

      if (newPositionCollidesWithWall) {
        // if you collide with a wall, you get your 2 jumps back
        if (this.availableJumps < 2) {
          console.log('reset jumps to 2')
          this.availableJumps = 2;
        }
        
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
          // reset y velocity since we aren't going anywhere in the Y axis
          this.yVel = 0;
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
    data.canvas.drawTextEntity(this.x, this.y, this.text, this.color);
  };
}

function Enemy(x, y) {
  this.x = x;
  this.y = y;
  this.w = 11;
  this.h = 18;
  this.speed = 2;
  this.text = "e";
  this.color = "gray";
  this.direction = "left";
  this.yVel = 0;

  this.update = function (data) {
    if (this.yVel < maxGravitySpeed) {
      this.yVel += gravityAcceleration;
    }
    this.y += this.yVel;
    if (this.direction === "left") this.x -= this.speed;
    else this.x += this.speed;
    // if on a wall, move in a direction. Otherwise, fall with gravity
    // Move the same direction until you hit a wall, then reverse direction
    // eventually disappears off the map
  };

  this.render = function (data) {
    data.canvas.drawTextEntity(this.x, this.y, this.text, this.color);
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
