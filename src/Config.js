


var images = [
  "blocks.png",
  "items.png",
  "enemies.png",
  "mario-small.png"
];

var blockw = 102400 / 16;

var blockh = 256 / 16 - 1;

var mapDim = [
  102400,
  256
];

var canvasId = "canvas";

var delayWhenLost = 300;

var levelWidth = 102400;

var levelHeight = 256;

var enemyDensity = 20;

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
  canvasId ,
  delayWhenLost ,
  images ,
  levelWidth ,
  levelHeight ,
  enemyDensity ,
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
