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
