open Belt;

open Actors;

type aabb = {
  center: xy,
  half: xy,
};

type params = {
  hasGravity: bool,
  speed: float,
};

let idCounter = ref(min_int);

type t = {
  params,
  pos: xy,
  vel: xy,
  id: int,
  mutable jumping: bool,
  mutable grounded: bool,
  mutable dir: Actors.dir1d,
  mutable invuln: int,
  mutable kill: bool,
  mutable health: int,
  mutable crouch: bool,
  mutable score: int,
};

type collidable =
  | Player(plTyp, Sprite.t, t)
  | Enemy(enemyTyp, Sprite.t, t)
  | Item(itemTyp, Sprite.t, t)
  | Block(blockTyp, Sprite.t, t);

// used to set gravity and speed, with default values true and 1
let setup = (~g as hasGravity=true, ~spd as speed=1., ()) => {
  hasGravity,
  speed,
};

/* Sets an object's x velocity to the speed specified in its params based on
 * its direction */
let setVelToSpeed = obj => {
  let speed = obj.params.speed;
  switch (obj.dir) {
  | Left => obj.vel.x = -. speed
  | Right => obj.vel.x = speed
  };
};

/* The following make functions all set the objects' has_gravity and speed,
 * returning an [obj_params] that can be directly plugged into the [obj]
 * during creation. */
let makePlayer = () => setup(~spd=Config.player_speed, ());

let makeItem =
  fun
  | Mushroom => setup()
  | Coin => setup(~g=false, ());

let makeEnemy =
  fun
  | Goomba => setup()
  | GKoopa => setup()
  | RKoopa => setup()
  | GKoopaShell => setup(~spd=3., ())
  | RKoopaShell => setup(~spd=3., ());

let makeBlock =
  fun
  | QBlock(_) => setup(~g=false, ())
  | QBlockUsed => setup(~g=false, ())
  | Brick => setup(~g=false, ())
  | UnBBlock => setup(~g=false, ())
  | Cloud => setup(~g=false, ())
  | Panel => setup(~g=false, ())
  | Ground => setup(~g=false, ());

/*Used in object creation and to compare two objects.*/
let newId = () => {
  idCounter := idCounter^ + 1;
  idCounter^;
};

let make = (~dir, spr, params, x, y) => {
  let id = newId();
  let obj = {
    params,
    pos: {
      x,
      y,
    },
    vel: {
      x: 0.0,
      y: 0.0,
    },
    id,
    jumping: false,
    grounded: false,
    dir,
    invuln: 0,
    kill: false,
    health: 1,
    crouch: false,
    score: 0,
  };
  (spr->Sprite.makeFromParams, obj);
};

/*Helper methods for getting sprites and objects from their collidables*/
let getSprite =
  fun
  | Player(_, s, _)
  | Enemy(_, s, _)
  | Item(_, s, _)
  | Block(_, s, _) => s;

let getObj =
  fun
  | Player(_, _, o)
  | Enemy(_, _, o)
  | Item(_, _, o)
  | Block(_, _, o) => o;

let isPlayer =
  fun
  | Player(_, _, _) => true
  | _ => false;

let isEnemy =
  fun
  | Enemy(_, _, _) => true
  | _ => false;

let equals = (col1, col2) => getObj(col1).id == getObj(col2).id;

// Matches the controls being used and updates each of the player's params
let updatePlayerKeys = (player: t, controls: controls): unit => {
  let lr_acc = player.vel.x *. 0.2;
  switch (controls) {
  | CLeft =>
    if (!player.crouch) {
      if (player.vel.x > -. player.params.speed) {
        player.vel.x = player.vel.x -. (0.4 +. abs_float(lr_acc));
      };
      player.dir = Left;
    }
  | CRight =>
    if (!player.crouch) {
      if (player.vel.x < player.params.speed) {
        player.vel.x = player.vel.x +. (0.4 +. abs_float(lr_acc));
      };
      player.dir = Right;
    }
  | CUp =>
    if (!player.jumping && player.grounded) {
      player.jumping = true;
      player.grounded = false;
      player.vel.y =
        max(
          player.vel.y
          -. (Config.player_jump +. abs_float(player.vel.x) *. 0.25),
          Config.player_max_jump,
        );
    }
  | CDown =>
    if (!player.jumping && player.grounded) {
      player.crouch = true;
    }
  };
};

// Used for sprite changing. If sprites change to different dimensions as a result
// of some action, the new sprite must be normalized so that things aren't
// jumpy
let normalizePos = (pos, p1: Sprite.params, p2: Sprite.params) => {
  let (box1, boy1) = p1.bboxOffset
  and (box2, boy2) = p2.bboxOffset;
  let (bw1, bh1) = p1.bboxSize
  and (bw2, bh2) = p2.bboxSize;
  pos.x = pos.x -. (bw2 +. box2) +. (bw1 +. box1);
  pos.y = pos.y -. (bh2 +. boy2) +. (bh1 +. boy1);
};

// Update player is constantly being called to check for if big or small
// Mario sprites/collidables should be used
let updatePlayer = (player, keys) => {
  let prev_jumping = player.jumping;
  let prev_dir = player.dir
  and prev_vx = abs_float(player.vel.x);
  List.forEach(keys, updatePlayerKeys(player));
  let v = player.vel.x *. Config.friction;
  let vel_damped =
    if (abs_float(v) < 0.1) {
      0.;
    } else {
      v;
    };
  player.vel.x = vel_damped;
  let plSize =
    if (player.health <= 1) {
      SmallM;
    } else {
      BigM;
    };

  let playerTyp =
    if (!prev_jumping && player.jumping) {
      Some(Jumping);
    } else if (prev_dir != player.dir
               || (prev_vx == 0. && abs_float(player.vel.x) > 0.)
               && !player.jumping) {
      Some(Running);
    } else if (prev_dir != player.dir && player.jumping && prev_jumping) {
      Some(Jumping);
    } else if (player.vel.y == 0. && player.crouch) {
      Some(Crouching);
    } else if (player.vel.y == 0. && player.vel.x == 0.) {
      Some(Standing);
    } else {
      None;
    };
  switch (playerTyp) {
  | Some(playerTyp) =>
    Some((
      plSize,
      Sprite.makePlayer(plSize, playerTyp, player.dir)->Sprite.makeFromParams,
    ))
  | None => None
  };
};

// The following two helper methods update velocity and position of the player
let updateVel = obj =>
  if (obj.grounded) {
    obj.vel.y = 0.;
  } else if (obj.params.hasGravity) {
    obj.vel.y =
      min(
        obj.vel.y +. Config.gravity +. abs_float(obj.vel.y) *. 0.01,
        Config.max_y_vel,
      );
  };

let updatePos = obj => {
  obj.pos.x = obj.vel.x +. obj.pos.x;
  if (obj.params.hasGravity) {
    obj.pos.y = obj.vel.y +. obj.pos.y;
  };
};

// Calls two above helper functions to update velocity and position of player
let processObj = (obj, mapy) => {
  updateVel(obj);
  updatePos(obj);
  if (obj.pos.y > mapy) {
    obj.kill = true;
  };
};

// Check upon collision of block and updates the values of the object
let collideBlock = (dir, obj) =>
  switch (dir) {
  | North => obj.vel.y = (-0.001)
  | South =>
    obj.vel.y = 0.;
    obj.grounded = true;
    obj.jumping = false;
  | East
  | West => obj.vel.x = 0.
  };

// Simple helper method that reverses the direction in question
let oppositeDir = dir =>
  switch (dir) {
  | Left => Right
  | Right => Left
  };

// Used for enemy-enemy collisions
let reverseLeftRight = obj => {
  obj.vel.x = -. obj.vel.x;
  obj.dir = oppositeDir(obj.dir);
};

// Actually creates a new enemy and deletes the previous. The positions must be
// normalized. This method is typically called when enemies are killed and a
// new sprite must be used (i.e., koopa to koopa shell).
let evolveEnemy = (player_dir, typ, spr: Sprite.t, obj) =>
  switch (typ) {
  | GKoopa =>
    let (new_spr, new_obj) =
      make(
        ~dir=obj.dir,
        Sprite.makeEnemy(GKoopaShell, obj.dir),
        makeEnemy(GKoopaShell),
        obj.pos.x,
        obj.pos.y,
      );
    normalizePos(new_obj.pos, spr.params, new_spr.params);
    Some(Enemy(GKoopaShell, new_spr, new_obj));
  | RKoopa =>
    let (new_spr, new_obj) =
      make(
        ~dir=obj.dir,
        Sprite.makeEnemy(RKoopaShell, obj.dir),
        makeEnemy(RKoopaShell),
        obj.pos.x,
        obj.pos.y,
      );
    Some(Enemy(RKoopaShell, new_spr, new_obj));
  | GKoopaShell
  | RKoopaShell =>
    obj.dir = player_dir;
    if (obj.vel.x != 0.) {
      obj.vel.x = 0.;
    } else {
      setVelToSpeed(obj);
    };
    None;
  | _ =>
    obj.kill = true;
    None;
  };

// Update the direction of the sprite
let revDir = (o, t, s: Sprite.t) => {
  reverseLeftRight(o);
  let old_params = s.params;
  Sprite.transformEnemy(t, s, o.dir);
  normalizePos(o.pos, old_params, s.params);
};

// Used for killing enemies, or to make big Mario into small Mario
let decHealth = obj => {
  let health = obj.health - 1;
  if (health == 0) {
    obj.kill = true;
  } else if (obj.invuln == 0) {
    obj.health = health;
  };
};

// Used for deleting a block and replacing it with a used block
let evolveBlock = obj => {
  decHealth(obj);
  let (new_spr, new_obj) =
    make(
      ~dir=obj.dir,
      Sprite.makeBlock(QBlockUsed),
      makeBlock(QBlockUsed),
      obj.pos.x,
      obj.pos.y,
    );
  Block(QBlockUsed, new_spr, new_obj);
};

// Used for spawning items above question mark blocks
let spawnAbove = (player_dir, obj, itemTyp) => {
  let item = {
    let (spr, obj) =
      make(
        ~dir=Left,
        Sprite.makeItem(itemTyp),
        makeItem(itemTyp),
        obj.pos.x,
        obj.pos.y,
      );
    Item(itemTyp, spr, obj);
  };
  let item_obj = getObj(item);
  item_obj.pos.y = item_obj.pos.y -. snd(getSprite(item).params.frameSize);
  item_obj.dir = oppositeDir(player_dir);
  setVelToSpeed(item_obj);
  item;
};

// Used to get the bounding box
let getAabb = obj => {
  let spr = getSprite(obj).params;
  let obj = getObj(obj);
  let (offx, offy) = spr.bboxOffset;
  let (box, boy) = (obj.pos.x +. offx, obj.pos.y +. offy);
  let (sx, sy) = spr.bboxSize;
  {
    center: {
      x: box +. sx /. 2.,
      y: boy +. sy /. 2.,
    },
    half: {
      x: sx /. 2.,
      y: sy /. 2.,
    },
  };
};

let colBypass = (c1, c2) => {
  let o1 = getObj(c1)
  and o2 = getObj(c2);
  let ctypes =
    switch (c1, c2) {
    | (Item(_, _, _), Enemy(_, _, _))
    | (Enemy(_, _, _), Item(_, _, _))
    | (Item(_, _, _), Item(_, _, _)) => true
    | (Player(_, _, o1), Enemy(_, _, _)) =>
      if (o1.invuln > 0) {
        true;
      } else {
        false;
      }
    | _ => false
    };
  o1.kill || o2.kill || ctypes;
};

// Used for checking if collisions occur. Compares half-widths and half-heights
// and adjusts for when collisions do occur, by changing position so that
// a second collision does not occur again immediately. This causes snapping
let checkCollision = (c1, c2) => {
  let b1 = getAabb(c1)
  and b2 = getAabb(c2);
  let o1 = getObj(c1);
  if (colBypass(c1, c2)) {
    None;
  } else {
    let vx = b1.center.x -. b2.center.x;
    let vy = b1.center.y -. b2.center.y;
    let hwidths = b1.half.x +. b2.half.x;
    let hheights = b1.half.y +. b2.half.y;
    if (abs_float(vx) < hwidths && abs_float(vy) < hheights) {
      let ox = hwidths -. abs_float(vx);
      let oy = hheights -. abs_float(vy);
      if (ox +. 0.2 > oy) { // avoid spurious horizontal collisions with floors when oy is tiny
        if (vy > 0.) {
          o1.pos.y = o1.pos.y +. oy;
          Some(North);
        } else {
          o1.pos.y = o1.pos.y -. oy;
          Some(South);
        };
      } else if (vx > 0.) {
        o1.pos.x = o1.pos.x +. ox;
        Some(West);
      } else {
        o1.pos.x = o1.pos.x -. ox;
        Some(East);
      };
    } else {
      None;
    };
  };
};

// "Kills" the matched object by setting certain parameters for each
let kill = collid =>
  switch (collid) {
  | Enemy(t, _, o) =>
    let pos = (o.pos.x, o.pos.y);
    let score =
      if (o.score > 0) {
        [Particle.makeScore(o.score, pos)];
      } else {
        [];
      };
    let remains =
      switch (t) {
      | Goomba => [Particle.make(GoombaSquish, pos)]
      | _ => []
      };
    score @ remains;
  | Block(t, _, o) =>
    switch (t) {
    | Brick =>
      let pos = (o.pos.x, o.pos.y);
      let p1 =
        Particle.make(
          ~vel=((-5.), (-5.)),
          ~acc=(0., 0.2),
          BrickChunkL,
          pos,
        );
      let p2 =
        Particle.make(
          ~vel=((-3.), (-4.)),
          ~acc=(0., 0.2),
          BrickChunkL,
          pos,
        );
      let p3 =
        Particle.make(~vel=(3., (-4.)), ~acc=(0., 0.2), BrickChunkR, pos);
      let p4 =
        Particle.make(~vel=(5., (-5.)), ~acc=(0., 0.2), BrickChunkR, pos);
      [p1, p2, p3, p4];
    | _ => []
    }
  | Item(t, _, o) =>
    switch (t) {
    | Mushroom => [Particle.makeScore(o.score, (o.pos.x, o.pos.y))]
    | _ => []
    }
  | _ => []
  };