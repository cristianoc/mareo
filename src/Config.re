let canvasId = "canvas";

let delayWhenLost = 300.;

let images = [|"blocks.png", "items.png", "enemies.png", "mario-small.png"|];

let levelWidth = 2400.;

let levelHeight = 256.;
let blockw = levelWidth /. 16.;
let blockh = levelHeight /. 16. -. 1.;

let mapDim = (levelWidth, levelHeight);

let restartAfter = 5;

let root_dir = "sprites/";

let scale = 1.;