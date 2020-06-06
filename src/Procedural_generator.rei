let init: unit => unit;

/* Procedurally generates a new map of default size*/
let generate:
  (float, float, Html.canvasRenderingContext2D) =>
  (Object.collidable, list(Object.collidable));