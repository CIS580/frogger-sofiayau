"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Car;

/**
 * @constructor Snake
 * Creates a new snake object
 * @param {Postition} position object specifying an x and y
 */
function Car(position) {
  this.state = (Math.random() > 0.5) ? "up" : "down";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 200;
  this.height = 180;
  this.UpBound = position.y - 10;
  this.DownBound = position.y + 10;

/** Declare spritesheet at the class level */
Car.prototype.upSpritesheet = new Image();
Car.prototype.upSpritesheet.src = 'assets/cars_mini.svg';

Car.prototype.downSpritesheet = new Image();
Car.prototype.downSpritesheet.src = 'assets/cars_racer.svg';

this.out_of_bounds = function() {
  return ((this.y + this.height) < 0 || this.y > 399);
}
}
/*
var flagU = false;
var flagD = false;
upSpritesheet.src = image.src;
downSpritesheet.src = img.src;
if(image.width > 0 && image.height > 0){
  flagU = true;
  if(image.width > 750 && image.height > 480){}
  else{
   image.width = upSpritesheet.width;
   image.height = upSpritesheet.height;
   }
 }

 if(img.width > 0 && img.height > 0){
   flagD = true;
   if(img.width > 750 && img.height > 480){}
   else{
    img.width = downSpritesheet.width;
    img.height = downSpritesheet.height;
  }
}
*/
/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Car.prototype.update = function(elapsedTime) {
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
Car.prototype.render = function(time, ctx) {

  if(this.state == "up") {
    ctx.drawImage(
      // image
      this.upSpritesheet,
      // source rectangle
      this.frame * this.width - 100, 0, this.width, this.height,
      // destination rectangle
      this.x / 2 -50 , this.y, 0.5*this.width, 0.5*this.height
    );
  } else {
    ctx.drawImage(
      // image
      this.downSpritesheet,
      // source rectangle
      this.frame * this.width - 100 , 100, this.width, this.height,
      // destination rectangle
      this.x / 2 - 50, this.y, 0.5 * this.width, 0.5 * this.height
    );
  }
}
