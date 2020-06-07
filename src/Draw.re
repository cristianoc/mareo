open Sprite;

let renderBbox = (sprite, (posx, posy)) => {
  let context = sprite.context;
  let (bbox, bboy) = sprite.params.bbox_offset;
  let (bbsx, bbsy) = sprite.params.bbox_size;
  context.strokeStyle = "#FF0000";
  context.strokeRect(. posx +. bbox, posy +. bboy, bbsx, bbsy);
};

// Draws a sprite onto the canvas
let render = (sprite, (posx, posy)) => {
  let context = sprite.context;
  let (sx, sy) = sprite.params.src_offset;
  let (sw, sh) = sprite.params.frame_size;
  let (dx, dy) = (posx, posy);
  let (dw, dh) = sprite.params.frame_size;
  let sx = sx +. float_of_int(sprite.frame^) *. sw;
  context.drawImage(. sprite.img, sx, sy, sw, sh, dx, dy, dw, dh);
};

// Draws two background images, which needs to be done because of the
// constantly changing viewport, which is always at most going to be
// between two background images.
let drawBgd = (bgd, off_x) => {
  render(bgd, (-. off_x, 0.));
  render(bgd, (fst(bgd.params.frame_size) -. off_x, 0.));
};

// Used for animation updating. Canvas is cleared each frame and redrawn.
let clearCanvas = (canvas: Html.canvasElement) => {
  let context = canvas.getContext(. "2d");
  let cwidth = float_of_int(canvas.width);
  let cheight = float_of_int(canvas.height);
  context.clearRect(. 0., 0., cwidth, cheight);
};

// Displays the text for score and coins.
let hud = (canvas: Html.canvasElement, score, coins) => {
  let score_string = string_of_int(score);
  let coin_string = string_of_int(coins);
  let context = canvas.Html.getContext(. "2d");
  context.font = "10px 'Press Start 2P'";
  context.fillText(.
    "Score: " ++ score_string,
    float_of_int(canvas.width) -. 140.,
    18.,
  );
  context.fillText(. "Coins: " ++ coin_string, 120., 18.);
};

// Displays the fps.
let fps = (canvas: Html.canvasElement, fps_val) => {
  let fps_str = int_of_float(fps_val) |> string_of_int;
  let context = canvas.getContext(. "2d");
  context.fillText(. fps_str, 10., 18.);
};

// gameWon displays a black screen when you finish a game.
let gameWon = (ctx: Html.canvasRenderingContext2D) => {
  ctx.rect(. 0., 0., 512., 512.);
  ctx.fillStyle = "black";
  ctx.fill(.);
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText(. "You win!", 180., 128.);
};

// gameLost displays a black screen stating a loss to finish that level play.
let gameLost = (ctx: Html.canvasRenderingContext2D, elapsed) => {
  ctx.rect(. 0., 0., 512., 512.);
  ctx.fillStyle = "black";
  ctx.fill(.);
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText(. "GAME OVER. You lose! ", 60., 100.);
  ctx.fillText(. string_of_int(elapsed), 230., 150.);
};