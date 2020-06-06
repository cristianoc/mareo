open Particle;

let invuln: int; /* # of frames of invulnerability */

let dampen_jump: float; /* Boost to jump when enemy jumped on */

type aabb = {
  center: Actors.xy,
  half: Actors.xy,
};

type obj_params = {
  has_gravity: bool,
  speed: float,
};

type obj = {
  params: obj_params,
  pos: Actors.xy,
  vel: Actors.xy,
  id: int,
  mutable jumping: bool,
  mutable grounded: bool,
  mutable dir: Actors.dir_1d,
  mutable invuln: int,
  mutable kill: bool,
  mutable health: int,
  mutable crouch: bool,
  mutable score: int,
};

type collidable =
  | Player(Actors.pl_typ, Sprite.sprite, obj)
  | Enemy(Actors.enemy_typ, Sprite.sprite, obj)
  | Item(Actors.item_typ, Sprite.sprite, obj)
  | Block(Actors.block_typ, Sprite.sprite, obj);

/* Returns the sprite associated with the object */
let get_sprite: collidable => Sprite.sprite;

let get_obj: collidable => obj;

/* Creates a new object with a given
 * actor type on the the canvas at a given position */
let spawn:
  (Actors.spawn_typ, Html.canvasRenderingContext2D, Actors.xy) => collidable;

let equals: (collidable, collidable) => bool;

let is_player: collidable => bool;

let is_enemy: collidable => bool;

let normalize_pos:
  (Actors.xy, Sprite.sprite_params, Sprite.sprite_params) => unit;

/* Destroys the object, returning a list of destruction effect objects */
let kill: (collidable, Html.canvasRenderingContext2D) => list(particle);

let process_obj: (obj, float) => unit;

let update_player:
  (obj, list(Actors.controls), Html.canvasRenderingContext2D) =>
  option((Actors.pl_typ, Sprite.sprite));

/* Checks whether a collision occured between two objects, returning the
 * direction of the collision if one occurred. */
let check_collision: (collidable, collidable) => option(Actors.dir_2d);

let evolve_enemy:
  (
    Actors.dir_1d,
    Actors.enemy_typ,
    Sprite.sprite,
    obj,
    Html.canvasRenderingContext2D
  ) =>
  option(collidable);

let evolve_block: (obj, Html.canvasRenderingContext2D) => collidable;

let dec_health: obj => unit;

let rev_dir: (obj, Actors.enemy_typ, Sprite.sprite) => unit;

let reverse_left_right: obj => unit;

let collide_block: (Actors.dir_2d, obj) => unit;

let spawn_above:
  (Actors.dir_1d, obj, Actors.item_typ, Html.canvasRenderingContext2D) =>
  collidable;