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

// Draw the game won screen
let gameWon: Html.canvasRenderingContext2D => 'a;

// Draw the game lost screen
let gameLost: Html.canvasRenderingContext2D => 'a;
