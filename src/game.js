"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;
/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  this.posX = 187;
  this.posY = 503;
  this.dead = -1;
  this.win = -1;
  this.score = 0;
  this.won = [false,false,false,false];
  this.lives = 3;
  this.score = 0;
  this.level = 0;
  this.extra = 0;
  this.dead = 0;
  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}
Game.prototype.reset = function () {
      this.posY = 503;
      this.posX = 187;
      this.log = -1;
      this.current = -1;
      //this.highest = -1;
      this.dead = -1;
      this.win = -1;
  }
Game.prototype.win = function() {
    this.score += 50;
    this.win = 15;
    if(this.won[0] && this.won[1] && this.won[2] && this.won[3] && this.won[4]){
      this.level();
    }
}
Game.prototype.draw_lives = function(){
    var x = 4;
    var y = 532;
    if ((this.score - (this.extra * 10000)) >= 10000 && this.lives < 4) {
        this.extra++;
    }
    for (var i = 0; i<(this.lives + this.extra); i++){
        ctx.drawImage(spritesheet, 13, 334, 17, 23, this.x, this.y, 11, 15);
        x += 14;
    }
}

Game.prototype.level = function() {
  for (var i=0; i<this.won.length; i++) {
    this.won[i] = false;
  }
    this.score += 1000;
    this.level ++;
}
//avoid collision
Game.prototype.collides = function(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (((x1 <= x2+w2 && x1 >=x2) && (y1 <= y2+h2 && y1 >= y2)) ||
            ((x1+w1 <= x2+w2 && x1+w1 >= x2) && (y1 <= y2+h2 && y1 >= y2)) ||
            ((x1 <= x2+w2 && x1 >=x2) && (y1+h1 <= y2+h2 && y1+h1 >= y2)) ||
            ((x1+w1 <= x2+w2 && x1+w1 >= x2) && (y1+h1 <= y2+h2 && y1+h1 >= y2)));
}
Game.prototype.water_collision = function() {
  return (this.posX > 105 && this.posX < 270);
}

Game.prototype.sploosh = function() {
    this.lives--;
    this.dead = 20;
}
/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}
