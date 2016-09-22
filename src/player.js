"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
 var input = {
   up:false,
   down:false,
   left:false,
   right:false
 }

function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.onLog = false;
  var self = this;
  var speed = 1/16/1000;
  this.score = 0;
  //<=3 collide die

  window.onkeydown = function(event){
    event.preventDefault();
    if(self.state === "hopping"){
      return;
    }
    switch(event.keyCode){
//up
    case 38:
    case 87:
      input.up = true;
      break;
    //left
    case 37:
    case 65:
      input.left = true;
      break;
    //right
    case 39:
    case 68:
      input.right = true;
      break;
    //down
    case 40:
    case 83:
      input.down = true;
      break;
      case 27:
      canvas.exitFullscreen();
      break;
  }
    self.state = "hopping";
    return false;
}
// five frames of animation
  this.animate = function(elapsedTime){
    this.timer += elapsedTime;
    switch(this.state){
      case "idle":
        if(this.timer > MS_PER_FRAME) {
          this.timer = 0;
          this.frame += 1;
          if(this.frame > 3) this.frame = 0;
          }
        break;
      case "hopping":
        if(this.timer > 1000 / 16){
          this.frame = (this.frame +1)% 4;
          this.timer = 0;
      }
    }
  }
  //players move

  this.moveOnLog = function(){
    if(self.onLog){
      if(self.offset == -1){
        self.offset = self.y - self.collideLog.y;
      }
      self.y = self.collideLog.y + self.offset;
    }
    else self.offset = -1;
  }
  this.move = function(){
    if(this.x < 300 && this.y < 300){
      if(input.up){
        //ctx.drawImage(spritesheet, 12, 369, 23, 17, game.posX, game.posY, 23, 17);
        this.y -= 20;
        }
      if(input.right){
        this.x += 20;
      }
      if(input.left){
        this.x -= 20;
      }
      if(input.down){
        this.y += 20;
      }
    }
  }
}


/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(elapsedTime, ctx) {
  switch(this.state) {
    case "idle":
      this.animate(elapsedTime);
      this.moveOnLog();
      break;
    // TODO: Implement your player's update by state
    case "hopping":
    //this.timer += time;
      this.animate(elapsedTime);
      this.move();
      //this.draw_lives(ctx);
      //this.move(elapsedTime);
      break;
  }
  if(this.x === 760){
    alert("Congrats! You won!");
}
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  //draw_level();
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "hopping":
      /*
      if(input.up)
        ctx.drawImage(this.spritesheet, 12, 369, 23, 17, game.posX, game.posY, 23, 17);
        else if (input.down) {
          ctx.drawImage(spritesheet, 80, 369, 23, 17, game.posX, game.posY, 23, 17);
        }
        else if (input.left) {
          ctx.drawImage(spritesheet, 80, 335, 19, 23, game.posX, game.posY, 19, 23);
        }
        else if (input.right) {
          ctx.drawImage(spritesheet, 12, 335, 19, 23, game.posX, game.posY, 19, 23);
        }
        */
    /*
    ctx.drawImage(
      this.spritesheet,
      this.frame * 64, 64, this.width, this.height,
      this.x, this.y, 1.5 * this.width, 1.5 *this.height
    );
    */
    ctx.drawImage(this.spritesheet, this.frame * 64, 64, this.width, this.height,
       this.x + 100 , 300, 1.5 * this.width , 1.5 *this.height);
       this.x += 1;
  }
}
