/* Represents an xy vector */
type xy = (float, float); /* x, y */

/* Inherent sprite parameters from which to create the sprite */
type sprite_params = {
  max_frames: int,
  max_ticks: int,
  img_src: string,
  frame_size: xy,
  src_offset: xy,
  bbox_offset: xy,
  bbox_size: xy,
};

/* Concrete sprite created to visually represent an object */
type sprite = {
  mutable params: sprite_params,
  context: Html.canvasRenderingContext2D,
  frame: ref(int),
  ticks: ref(int),
  mutable img: Html.imageElement,
};

/* Sets up a sprite to create */
let setup_sprite:
  (
    ~bb_off: (float, float)=?,
    ~bb_sz: (float, float)=?,
    string,
    int,
    int,
    xy,
    xy
  ) =>
  sprite_params;

/* Creates a sprite given the actor type */
let make:
  (Actors.spawn_typ, Actors.dir_1d, Html.canvasRenderingContext2D) => sprite;

/* Make a background */
let make_bgd: Html.canvasRenderingContext2D => sprite;

/* Make a particle corresponding to the given type */
let make_particle: (Actors.part_typ, Html.canvasRenderingContext2D) => sprite;

/* Transform an enemy sprite based on direction */
let transform_enemy: (Actors.enemy_typ, sprite, Actors.dir_1d) => unit;

/* Updates the sprite's animation */
let update_animation: sprite => unit;