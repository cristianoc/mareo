type viewport;

let getPos: viewport => Actors.xy;

/* Makes a new viewport of viewport dimensions and map dimensions*/
let make: ((float, float), (float, float)) => viewport;

/* Whether the supplied position is outside of the viewport */
let in_viewport: (viewport, Actors.xy) => bool;

/* Whether the supplied position is below the viewport */
let out_of_viewport_below: (viewport, float) => bool;

/* Converts absolute coordinates to viewport coodinates */
let coord_to_viewport: (viewport, Actors.xy) => Actors.xy;

/* Update the viewport */
let update: (viewport, Actors.xy) => viewport;