


var images = [
  "blocks.png",
  "items.png",
  "enemies.png",
  "mario-small.png"
];

var blockw = 2400 / 16;

var blockh = 256 / 16 - 1;

var mapDim = [
  2400,
  256
];

var canvasId = "canvas";

var delayWhenLost = 300;

var levelWidth = 2400;

var levelHeight = 256;

var enemyDensity = 20;

var restartAfter = 5;

var root_dir = "sprites/";

var scale = 1.5;

var friction = 0.9;

var gravity = 0.2;

var max_y_vel = 4.5;

var player_speed = 2.8;

var player_jump = 5.7;

var player_max_jump = -6;

var dampen_jump = 4;

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
  root_dir ,
  scale ,
  friction ,
  gravity ,
  max_y_vel ,
  player_speed ,
  player_jump ,
  player_max_jump ,
  dampen_jump ,
  invuln ,
  
}
/* No side effect */
