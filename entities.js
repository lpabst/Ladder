var gravityAcceleration = 0.3;
var maxGravitySpeed = 3;
var unhandledCollision = null;

var debugBoundaries = false;

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

// sets up the shared items for all text entity types
function setupTextEntity(thisContext, x, y, w, h, text, color) {
  thisContext.id = randomString(64);
  thisContext.x = x;
  thisContext.y = y;
  thisContext.w = w;
  thisContext.h = h;
  thisContext.text = text;
  thisContext.color = color;

  thisContext.render = function (data) {
    data.canvas.drawTextEntity(
      thisContext.x,
      thisContext.y,
      thisContext.text,
      thisContext.color,
      13
    );

    if (debugBoundaries) {
      data.canvas.drawRect(
        thisContext.x,
        thisContext.y,
        thisContext.w,
        thisContext.h,
        thisContext.color
      );
    }
  };
}

function EnemyPortal(x, y, spawnMovingLeft = true) {
  setupTextEntity(this, x, y, 16, 16, "@", "red");
  this.spawnMovingLeft = spawnMovingLeft;
}

function LevelCompletePortal(x, y) {
  setupTextEntity(this, x, y, 10, 16, "$", "green");
}

function Food(x, y) {
  setupTextEntity(this, x, y, 8, 12, "+", "green");
}

function PointsFood(x, y) {
  setupTextEntity(this, x, y, 8, 12, "+", "blue");
}

function Spike(x, y) {
  setupTextEntity(this, x, y, 9, 12, "#", "pink");
}

function Player(x, y) {
  setupTextEntity(this, x, y, 8, 17, "p", "white");
  this.startX = x;
  this.startY = y;
  this.speed = 1.8;
  this.yVel = 0;
  this.availableJumps = 2;
  this.jumpVel = -5;

  // called by the game.update method
  this.update = function (data) {
    var spacebarDown = data.keys.down[32];
    var leftArrowDown = data.keys.down[37];
    var rightArrowDown = data.keys.down[39];
    var upArrowDown = data.keys.down[38];
    var downArrowDown = data.keys.down[40];
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
    var isTouchingLadder = data.ladders.some((ladder) =>
      isCollision(this, ladder)
    );

    // if we are touching a ladder, kill y velocity and listen to up/down arrow commands
    if (isTouchingLadder) {
      this.yVel = 0;
      if (upArrowDown) {
        newY -= this.speed;
      }
      if (downArrowDown) {
        newY += this.speed;
      }
    }

    // if we aren't touching a ladder we are affected by gravity and jumps
    if (!isTouchingLadder) {
      // if you are falling downward, you cannot jump (although we'll allow a slight buffer)
      if (this.yVel > gravityAcceleration * 2) {
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
      }
    }

    newY += this.yVel;

    // if our new position is touching a wall, make sure we don't move through it at all
    data.walls.forEach((wall) => {
      var newPositionCollidesWithWall = isCollision(
        { x: newX, y: newY, w: this.w, h: this.h },
        wall
      );

      if (newPositionCollidesWithWall) {
        // if you collide with a wall, you get your 2 jumps back
        if (this.availableJumps < 2) {
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
    this.x = newX;
    this.y = newY;
  };

  // called by the game.render method
  this.render = function (data) {
    data.canvas.drawTextEntity(this.x, this.y, this.text, this.color, 12);

    if (debugBoundaries) {
      data.canvas.drawRect(this.x, this.y, this.w, this.h, "blue");
    }
  };
}

function Enemy(x, y, walkingLeft) {
  setupTextEntity(this, x, y, 8, 10, "e", "gray");
  this.speed = 1.6;
  this.walkingLeft = walkingLeft;
  this.yVel = 0;

  // if on top of a wall, move in a direction. Otherwise, fall with gravity
  // eventually disappears off the map
  this.update = function (data, index) {
    var newX = this.x;
    var newY = this.y;

    // move enemy in the direction they are headed
    if (this.walkingLeft) newX -= this.speed;
    else newX += this.speed;

    // gravity accelerates us up to a max speed
    if (this.yVel < maxGravitySpeed) {
      this.yVel += gravityAcceleration;
    }

    newY += this.yVel;

    // if enemy's new position is touching a wall, reverse direction
    data.walls.forEach((wall) => {
      var newPositionCollidesWithWall = isCollision(
        { x: newX, y: newY, w: this.w, h: this.h },
        wall
      );

      if (newPositionCollidesWithWall) {
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

        // if new left/right is in wall && current top/bottom is in wall, reverse direction
        if (
          (newLeftIsInWall || newRightIsInWall) &&
          (topIsInWall || bottomIsInWall || wallIsInNewPlayerVertically)
        ) {
          this.walkingLeft = !this.walkingLeft;
        }
      }
    });

    // if enemy is actively falling, cancel any x movement
    if (this.yVel > 0) {
      newX = this.x;
    }

    // move to new location
    this.x = newX;
    this.y = newY;

    // enemies that fall off the bottom of the map die/disappear and the player gets a point
    if (newY > data.canvas.h) {
      data.enemies.splice(index, 1);
      data.points++;
    }
  };;

  this.render = function (data) {
    data.canvas.drawTextEntity(this.x, this.y, this.text, this.color, 10);

    if (debugBoundaries) {
      data.canvas.drawRect(this.x, this.y, this.w, this.h, "red");
    }
  };
}

function Ladder(x, y) {
  this.id = randomString(64);
  this.x = x;
  this.y = y;
  this.w = 16;
  this.h = 80;
  this.color = "white";
  this.numRungs = 4;
  this.rungSpacing = this.h / (this.numRungs + 1);

  this.render = function (data) {
    this.left = this.x;
    this.right = this.x + this.w;
    this.top = this.y;
    this.bottom = this.y + this.h;

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

    if (debugBoundaries) {
      data.canvas.drawRect(this.x, this.y, this.w, this.h, "green");
    }
  };
}

function Wall(x, y, w, h) {
  this.id = randomString(64);
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = "#ccc";

  this.render = function (data) {
    data.canvas.drawRect(this.x, this.y, this.w, this.h, this.color, true);

    if (debugBoundaries) {
      data.canvas.drawRect(this.x, this.y, this.w, this.h, "purple");
    }
  };
}