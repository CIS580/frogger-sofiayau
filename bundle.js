(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game');
const EntityManager = require('./entity-manager');
const Player = require('./player');
const Car = require('./car');
const Log = require('./log');
const Shark = require('./shark');

var PickUpImage = new Image();
var SedanImage = new Image();
PickUpImage.src = "assets/TRBRYcars [Converted] pickup.svg";
SedanImage.src = "assets/TRBRYcars [Converted] sedan.svg";
/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 300});
var entities = new EntityManager(canvas.width, canvas.height, 128);
entities.addEntity(player);

var imageRoad = new Image();
imageRoad.src = 'assets/roadTiles_water.svg';
var imagePond = new Image();
imagePond.src = 'assets/pond.svg';

var cars = [];
for(var i=0; i < 20; i++) {
  var car = new Car({
    x: Math.random() * 700,
    y: Math.random() * 30 + 100,
  });
  cars.push(car);
  entities.addEntity(car);
}
cars.sort(function(c1, c2) {return c1.y - c2.y;});

var logs = [];
for(var i=0; i < 20; i++) {
  var log = new Log({
    x: Math.random() * 800 + 370,
    y: Math.random() * 30 + 60,
  });
  logs.push(log);
  entities.addEntity(log);
}
logs.sort(function(l1, l2) {return l1.y - l2.y;});

var sharks = [];
for(var i=0; i < 20; i++) {
  var shark = new Shark({
    x: Math.random() * 600 + 500,
    y: Math.random() * 20 + 200,
  });
  sharks.push(shark);
  entities.addEntity(shark);
}
sharks.sort(function(s1, s2) {return s1.y - s2.y;});
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  entities.updateEntity(player);
  cars.forEach(function(car){
    car.update(elapsedTime);
    entities.updateEntity(car);
  });
  logs.forEach(function(log){
    log.update(elapsedTime);
    entities.updateEntity(log);
  });
  sharks.forEach(function(shark){
    shark.update(elapsedTime);
    entities.updateEntity(shark);
  });
  entities.collide(function(player, car){
    return true;
  });
  entities.collide(function(player, log){
    return true;
  });

  if(game.dead == 0){
    game.reset();
  }

  if (game.posY < 505 && game.posY > 270) {
    for (var i=0; i<cars.length; i++) {
      if (game.collides(game.posX, game.posY, game.width, game.height, cars[i].posX, cars[i].posY, cars[i].width, cars[i].height))
        drawImage(PickUpImage,
              100,100,30,60,
              100,200,30,60);
              //game.level();
          }
      }

if (game.posY < 270) {
  for (var i=0; i<logs.length; i++) {
   if (game.collides(game.posX, game.posY, game.width, game.height, logs[i].posX, logs[i].posY, logs[i].width, logs[i].height))
    drawImage(SedanImage,
        100,100,30,60,
        100,200,30,60);
        game.dead++;
  }
}
  // TODO: Update the game objects
  /*if(entites.collide(function(player, log)) == true){
  ctx.drawImage(
    // image
    this.PickUpImage,
    // source rectangle
    100, 100, 30, 60,
    // destination rectangle
    100, 200, 30, 60);
  }*/
}
/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle="#191970";
  ctx.fillRect(0,0,399,480);
  ctx.fillStyle="lightblue";
  ctx.fillRect(399,0,399,480);
  ctx.drawImage(imageRoad, 0, 0, 399, 480, 0, 0, 399, 480);
  ctx.drawImage(imagePond, 0, 480, 399, 480, 0, 0, 399, 480);  //?

  var score_text = "Score:" + this.score;
  ctx.fillStyle = "black";
  ctx.fillText(score_text,145,20);
  ctx.fillText("Highscore: ", 145, 40);
  //draw_score();
  var level_text = "Level:" + this.level;
  var lives_text = "Lives:" + this.lives;
  ctx.fillStyle = "#00EE00";
  ctx.fillText(level_text, 240, 20);
  ctx.fillText(lives_text,240, 40);

  entities.renderCells(ctx);
  player.render(elapsedTime, ctx);
  cars.forEach(function(car){car.render(elapsedTime, ctx);});
  logs.forEach(function(log){log.render(elapsedTime, ctx);});
  sharks.forEach(function(shark){shark.render(elapsedTime, ctx);});
}

},{"./car":2,"./entity-manager":3,"./game":4,"./log":5,"./player":6,"./shark":7}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){

module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback)

        // check for collisions in cell to the right
        if(i % (self.widthInCells - 1) != 0) {
          //self.cells[i+1].forEach(function(entity2) {
            checkForCollision(entity1, entity2, callback);
          //});
        }

        // check for collisions in cell below
        if(i < self.numberOfCells - self.widthInCells) {
          //self.cells[i+self.widthInCells].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          //});
        }

        // check for collisions diagionally below and right
        if(i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
          self.cells[i+self.widthInCells + 1].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }
      });
    });
  });
}

function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width < entity2.x ||
                   entity1.x > entity2.x + entity2.width ||
                   entity1.y + entity1.height < entity2.y ||
                   entity1.y > entity2.y + entity2.height);
  if(collides) {
    callback(entity1, entity2);
  }
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      //cars rect
      /*
      ctx.strokeStyle = '#333333';
      ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
      */
    }
  }
}

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Shark;


/**
 * @constructor Snake
 * Creates a new snake object
 * @param {Postition} position object specifying an x and y
 */
function Shark(position) {
  this.state = (Math.random() > 0.5) ? "up" : "down";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 160;
  this.height = 220;
  this.UpBound = position.y - 10;
  this.DownBound = position.y + 10;

/** Declare spritesheet at the class level */
Shark.prototype.upSpritesheet = new Image();
Shark.prototype.upSpritesheet.src = 'assets/shark.png';

Shark.prototype.downSpritesheet = new Image();
Shark.prototype.downSpritesheet.src = 'assets/shark.png';
  this.out_of_bounds = function() {
    return ((this.y + this.height) < 0 || this.y > 399);
  }

}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Shark.prototype.update = function(elapsedTime) {
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
Shark.prototype.render = function(time, ctx) {
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
      this.frame * this.width , 0, this.width, this.height,
      // destination rectangle
      this.x , this.y, this.width, 0.5*this.height
    );
  }
  /*
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
  */
}

},{}]},{},[1]);
