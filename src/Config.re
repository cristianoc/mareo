let canvasId = "canvas";

let delayWhenLost = 300.;

let images = [|"blocks.png", "items.png", "enemies.png", "mario-small.png"|];

let levelWidth = 2400.;

let levelHeight = 256.;

let enemyDensity = 20; // One out of 20 blocks has an enemy on it
let blockw = levelWidth /. 16.;
let blockh = levelHeight /. 16. -. 1.;

let mapDim = (levelWidth, levelHeight);

let restartAfter = 5;

let root_dir = "sprites/";

let scale = 1.5;

let friction = 0.9;

let gravity = 0.2;

let max_y_vel = 4.5;

let player_speed = 2.8;

let player_jump = 5.7;

let player_max_jump = (-6.);

let dampen_jump = 4.;

let invuln = 60;