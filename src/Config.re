let randomSeed = (~level as _) => 34;

let levelWidth = (~level as _) => 2400.;

let levelHeight = (~level as _) => 256.;

let enemyDensity = (~level as _) => 20; // One out of 20 blocks has an enemy on it

let canvasId = "canvas";

let delayWhenFinished = 300.;

let images = [|"blocks.png", "items.png", "enemies.png", "mario-small.png"|];

let blockw = (~level) => levelWidth(~level) /. 16.;
let blockh = (~level) => levelHeight(~level) /. 16. -. 1.;

let mapDim = (~level) => (levelWidth(~level), levelHeight(~level));

let restartAfter = 5.;

let spritesDir = "sprites/";

let scale = 1.5;

let friction = 0.9;

let gravity = 0.2;

let maxYVel = 4.5;

let playerSpeed = 2.8;

let playerJump = 5.7;

let playerMaxJump = (-6.);

let dampenJump = 4.;

let invuln = 60;