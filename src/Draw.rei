// Render a given object on the canvas
let render: (Sprite.sprite, (float, float)) => unit;

// Clear the canvass
let clear_canvas: Html.canvasElement => unit;

// Draw the given sprite as a background */
let draw_bgd: (Sprite.sprite, float) => unit;

// Draw the axis aligned bounding box of the sprite at the position
let render_bbox: (Sprite.sprite, (float, float)) => unit;

// Draw the fps on the canvas
let fps: (Html.canvasElement, float) => unit;

// Draw the heads up display
let hud: (Html.canvasElement, int, int) => unit;

// Draw the game win screen
let gameWin: Html.canvasRenderingContext2D => unit;

// Draw the game loss screen
let gameLose: Html.canvasRenderingContext2D => unit;
