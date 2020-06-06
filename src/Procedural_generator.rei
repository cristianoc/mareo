open Object;

type obj_coord;

let init: unit => unit;

/* Procedurally generates a new map of default size*/
let generate: (float, float, Html.canvasRenderingContext2D) => (collidable, list(collidable));
