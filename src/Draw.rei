/* Renders a given object on the canvas */
let render: (Sprite.sprite, (float, float)) => unit;

/* Clears the canvas */
let clear_canvas: Html.canvasElement => unit;

/* Draw the given sprite as a background */
let draw_bgd: (Sprite.sprite, float) => unit;

/* Draws the axis aligned bounding box of the sprite at the position */
let render_bbox: (Sprite.sprite, (float, float)) => unit;

/* Draws the fps on the canvas */
let fps: (Html.canvasElement, float) => unit;

/* Draw the heads up display */
let hud: (Html.canvasElement, int, int) => unit;

/* Draw the game win screen */
let game_win: Html.canvasRenderingContext2D => unit;

/* Draw the game loss screen */
let game_loss: Html.canvasRenderingContext2D => unit;
