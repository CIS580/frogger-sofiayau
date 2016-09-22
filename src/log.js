"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Log;


/**
 * @constructor Snake
 * Creates a new snake object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
  this.state = (Math.random() > 0.5) ? "up" : "down";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 600;
  this.height = 820;
  this.UpBound = position.y - 10;
  this.DownBound = position.y + 10;

/** Declare spritesheet at the class level */
Log.prototype.upSpritesheet = new Image();
Log.prototype.upSpritesheet.src = 'assets/tiny_ship.png';

Log.prototype.downSpritesheet = new Image();
Log.prototype.downSpritesheet.src = 'assets/tiny_ship.png';
  this.out_of_bounds = function() {
    return ((this.y + this.height) < 0 || this.y > 399);
  }

}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  if(this.timer > 1000/6) {
    this.frame = (this.frame + 1) % 4;
    this.timer = 0;
  }
  switch(this.state) {
    case "up":
      this.y -= 0.5;
      if(this.x < this.upBound) this.state = "up";
      break;
    case "down":
      this.y += 0.5;
      if(this.x > this.downBound) this.state = "down";
      break;
  }
  this.color = '#000000';
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function(time, ctx) {
  if(this.state == "up") {
    ctx.drawImage(
      // image
      this.upSpritesheet,
      // source rectangle
      this.frame * 30 , 0, this.width, this.height,
      // destination rectangle
      this.x , this.y, this.width, 0.5*this.height
    );
  } else {
    ctx.drawImage(
      // image
      this.downSpritesheet,
      // source rectangle
      this.frame * 30 , 0, this.width, this.height,
      // destination rectangle
      this.x , this.y, this.width, 0.5*this.height
    );
  }
  /*
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  */
}
