function Canvas(id = "canvas") {
  this.id = id;
  this.canvas = document.getElementById(id);
  this.context = this.canvas.getContext("2d");

  this.clear = function () {
    this.drawRect(0, 0, this.canvas.width, this.canvas.height, "black");
  };

  this.drawLine = function (x, y, toX, toY, color) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.moveTo(x, y);
    this.context.lineTo(toX, toY);
    this.context.stroke();
  };

  this.drawCircle = function (x, y, radius, color = "white", fill = false) {
    this.context.beginPath();
    if (fill) {
      this.context.fillStyle = color;
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.fill();
    } else {
      this.context.strokeStyle = color;
      this.context.arc(x, y, radius, 0, 2 * Math.PI);
      this.context.stroke();
    }
    // this.context.endPath();
  };

  this.drawRect = function (
    x,
    y,
    width,
    height,
    color = "white",
    fill = false
  ) {
    this.context.beginPath();
    if (fill) {
      this.context.fillStyle = color;
      this.context.fillRect(x, y, width, height);
    } else {
      this.context.strokeStyle = color;
      this.context.rect(x, y, width, height);
      this.context.stroke();
    }
  };

  this.drawText = function () {
    //
  };
}
