


function randomSeed(param) {
  return 34;
}

function levelWidth(param) {
  return 2400;
}

function levelHeight(param) {
  return 256;
}

function enemyDensity(param) {
  return 20;
}

var images = [
  "blocks.png",
  "items.png",
  "enemies.png",
  "mario-small.png"
];

function blockw(level) {
  return 2400 / 16;
}

function blockh(level) {
  return 256 / 16 - 1;
}

function mapDim(level) {
  return [
          2400,
          256
        ];
}

var canvasId = "canvas";

var delayWhenFinished = 300;

var restartAfter = 5;

var spritesDir = "sprites/";

var scale = 1.5;

var friction = 0.9;

var gravity = 0.2;

var maxYVel = 4.5;

var playerSpeed = 2.8;

var playerJump = 5.7;

var playerMaxJump = -6;

var dampenJump = 4;

var invuln = 60;

export {
  randomSeed ,
  levelWidth ,
  levelHeight ,
  enemyDensity ,
  canvasId ,
  delayWhenFinished ,
  images ,
  blockw ,
  blockh ,
  mapDim ,
  restartAfter ,
  spritesDir ,
  scale ,
  friction ,
  gravity ,
  maxYVel ,
  playerSpeed ,
  playerJump ,
  playerMaxJump ,
  dampenJump ,
  invuln ,
  
}
/* No side effect */
