open Belt;

open Actors;

type status =
  | Playing
  | Lost(float)
  | Won;

/*st represents the state of the game. It includes a background sprite (e.g.,
 * (e.g., hills), a context (used for rendering onto the page), a viewport
 * (used for moving the player's "camera"), a score (which is kept track
 * throughout the game), coins (also kept track through the game),
 * a multiplier (used for when you kill multiple enemies before ever touching
 * the ground, as in the actual Super Mario), and a game_over bool (which
 * is only true when the game is over). */
type st = {
  bgd: Sprite.t,
  vpt: Viewport.viewport,
  map: float,
  mutable score: int,
  mutable coins: int,
  mutable multiplier: int,
  mutable status,
};

let collid_objs = ref([]); /* List of next iteration collidable objects */

let particles = ref([]); /* List of next iteration particles */

let lastTime = ref(0.); /* Used for calculating fps */
let initialTime = ref(0.); /* Used for calculating fps */

/* Calculates fps as the difference between [t0] and [t1] */
let calcFps = () => {
  let t0 = lastTime^;
  let time = Html.performance.now(.);
  lastTime := time;
  if (t0 == 0.) {
    initialTime := time;
    0.;
  } else {
    let delta = (time -. t0) /. 1000.;
    time -. initialTime^ < 1000.0 ? 0. : 1. /. delta;
  };
};

/* Adds [i] to the score in [state] */
let update_score = (state, i) => state.score = state.score + i;

// playerAttackEnemy is called for a player hitting an enemy from the north.
// This causes the player to either kill the enemy or move the enemy, in the
// case that the enemy is a shell. Invulnerability, jumping, and grounded
// are used for fine tuning the movements.
let playerAttackEnemy = (o1, typ, s2, o2, state) => {
  o1.Object.invuln = 10;
  o1.jumping = false;
  o1.grounded = true;
  switch (typ) {
  | GKoopaShell
  | RKoopaShell =>
    let r2 = Object.evolveEnemy(o1.dir, typ, s2, o2);
    o1.vel.y = -. Config.dampen_jump;
    o1.pos.y = o1.pos.y -. 5.;
    (None, r2);
  | _ =>
    Object.decHealth(o2);
    o1.vel.y = -. Config.dampen_jump;
    if (state.multiplier == 8) {
      update_score(state, 800);
      o2.score = 800;
      (None, Object.evolveEnemy(o1.dir, typ, s2, o2));
    } else {
      let score = 100 * state.multiplier;
      update_score(state, score);
      o2.score = score;
      state.multiplier = state.multiplier * 2;
      (None, Object.evolveEnemy(o1.dir, typ, s2, o2));
    };
  };
};

// enemyAttackPlayer is used when an enemy kills a player.
let enemyAttackPlayer = (o1: Object.t, t2, s2, o2: Object.t) => {
  switch (t2) {
  | GKoopaShell
  | RKoopaShell =>
    let r2 =
      if (o2.vel.x == 0.) {
        Object.evolveEnemy(o1.dir, t2, s2, o2);
      } else {
        Object.decHealth(o1);
        o1.invuln = Config.invuln;
        None;
      };
    (None, r2);
  | _ =>
    Object.decHealth(o1);
    o1.invuln = Config.invuln;
    (None, None);
  };
};

/*In the case that two enemies collide, they are to reverse directions. However,
 *in the case that one or more of the two enemies is a koopa shell, then
 *the koopa shell kills the other enemy. */
let col_enemy_enemy = (t1, s1, o1, t2, s2, o2, dir) =>
  switch (t1, t2) {
  | (GKoopaShell, GKoopaShell)
  | (GKoopaShell, RKoopaShell)
  | (RKoopaShell, RKoopaShell)
  | (RKoopaShell, GKoopaShell) =>
    Object.decHealth(o1);
    Object.decHealth(o2);
    (None, None);
  | (RKoopaShell, _)
  | (GKoopaShell, _) =>
    if (o1.vel.x == 0.) {
      Object.revDir(o2, t2, s2);
      (None, None);
    } else {
      Object.decHealth(o2);
      (None, None);
    }
  | (_, RKoopaShell)
  | (_, GKoopaShell) =>
    if (o2.vel.x == 0.) {
      Object.revDir(o1, t1, s1);
      (None, None);
    } else {
      Object.decHealth(o1);
      (None, None);
    }
  | (_, _) =>
    switch (dir) {
    | West
    | East =>
      Object.revDir(o1, t1, s1);
      Object.revDir(o2, t2, s2);
      (None, None);
    | _ => (None, None)
    }
  };

/* Process collision is called to match each of the possible collisions that
 * may occur. Returns a pair of collidable options, representing objects that
 * were created from the existing ones. That is, the first element represents
 * a new item spawned as a result of the first collidable. None indicates that
 * no new item should be spawned. Transformations to existing objects occur
 * mutably, as many changes are side-effectual.*/
let process_collision =
    (
      dir: Actors.dir2d,
      c1: Object.collidable,
      c2: Object.collidable,
      state: st,
    ) => {
  switch (c1, c2, dir) {
  | (
      {objTyp: Player(_), obj: o1},
      {objTyp: Enemy(typ), sprite: s2, obj: o2},
      South,
    )
  | (
      {objTyp: Enemy(typ), sprite: s2, obj: o2},
      {objTyp: Player(_), obj: o1},
      North,
    ) =>
    playerAttackEnemy(o1, typ, s2, o2, state)
  | (
      {objTyp: Player(_), obj: o1},
      {objTyp: Enemy(t2), sprite: s2, obj: o2},
      _,
    )
  | (
      {objTyp: Enemy(t2), sprite: s2, obj: o2},
      {objTyp: Player(_), obj: o1},
      _,
    ) =>
    enemyAttackPlayer(o1, t2, s2, o2)
  | ({objTyp: Player(_), obj: o1}, {objTyp: Item(t2), obj: o2}, _)
  | ({objTyp: Item(t2), obj: o2}, {objTyp: Player(_), obj: o1}, _) =>
    switch (t2) {
    | Mushroom =>
      Object.decHealth(o2);
      if (o1.health == 2) {
        ();
      } else {
        o1.health = o1.health + 1;
      };
      o1.vel.x = 0.;
      o1.vel.y = 0.;
      update_score(state, 1000);
      o2.score = 1000;
      (None, None);
    | Coin =>
      state.coins = state.coins + 1;
      Object.decHealth(o2);
      update_score(state, 100);
      (None, None);
    }
  | (
      {objTyp: Enemy(t1), sprite: s1, obj: o1},
      {objTyp: Enemy(t2), sprite: s2, obj: o2},
      dir,
    ) =>
    col_enemy_enemy(t1, s1, o1, t2, s2, o2, dir)
  | (
      {objTyp: Enemy(t1), sprite: s1, obj: o1},
      {objTyp: Block(t2), obj: o2},
      East,
    )
  | (
      {objTyp: Enemy(t1), sprite: s1, obj: o1},
      {objTyp: Block(t2), obj: o2},
      West,
    ) =>
    switch (t1, t2) {
    | (RKoopaShell, Brick)
    | (GKoopaShell, Brick) =>
      Object.decHealth(o2);
      Object.reverseLeftRight(o1);
      (None, None);
    | (RKoopaShell, QBlock(typ))
    | (GKoopaShell, QBlock(typ)) =>
      let updated_block = Object.evolveBlock(o2);
      let spawned_item = Object.spawnAbove(o1.dir, o2, typ);
      Object.revDir(o1, t1, s1);
      (Some(updated_block), Some(spawned_item));
    | (_, _) =>
      Object.revDir(o1, t1, s1);
      (None, None);
    }
  | ({objTyp: Item(_), obj: o1}, {objTyp: Block(_)}, East)
  | ({objTyp: Item(_), obj: o1}, {objTyp: Block(_)}, West) =>
    Object.reverseLeftRight(o1);
    (None, None);
  | ({objTyp: Enemy(_), obj: o1}, {objTyp: Block(_)}, _)
  | ({objTyp: Item(_), obj: o1}, {objTyp: Block(_)}, _) =>
    Object.collideBlock(dir, o1);
    (None, None);
  | ({objTyp: Player(t1, _), obj: o1}, {objTyp: Block(t), obj: o2}, North) =>
    switch (t) {
    | QBlock(typ) =>
      let updated_block = Object.evolveBlock(o2);
      let spawned_item = Object.spawnAbove(o1.dir, o2, typ);
      Object.collideBlock(dir, o1);
      (Some(spawned_item), Some(updated_block));
    | Brick =>
      if (t1 == BigM) {
        Object.collideBlock(dir, o1);
        Object.decHealth(o2);
        (None, None);
      } else {
        Object.collideBlock(dir, o1);
        (None, None);
      }
    | Panel =>
      state.status = Won;
      (None, None);
    | _ =>
      Object.collideBlock(dir, o1);
      (None, None);
    }
  | ({objTyp: Player(_), obj: o1}, {objTyp: Block(t)}, _) =>
    switch (t) {
    | Panel =>
      state.status = Won;
      (None, None);
    | _ =>
      switch (dir) {
      | South =>
        state.multiplier = 1;
        Object.collideBlock(dir, o1);
        (None, None);
      | _ =>
        Object.collideBlock(dir, o1);
        (None, None);
      }
    }
  | (_, _, _) => (None, None)
  };
};

let viewportFilter = (state, obj: Object.t, collid) =>
  Viewport.inViewport(state.vpt, obj.pos)
  || Object.isPlayer(collid)
  || Viewport.outOfViewportBelow(state.vpt, obj.pos.y);

// Run the broad phase object filtering
let broadPhase = (collid: Object.collidable, allCollids, state) => {
  allCollids->List.keep(_c => viewportFilter(state, collid.obj, collid));
};

// narrowPhase of collision is used in order to continuously loop through
// each of the collidable objects to constantly check if collisions are
// occurring.
let narrowPhase = (c, cs, state) => {
  let rec narrow_helper = (c: Object.collidable, cs, state, acc) =>
    switch (cs) {
    | [] => acc
    | [h, ...t] =>
      let new_objs =
        if (!Object.equals(c, h)) {
          switch (Object.checkCollision(c, h)) {
          | None => (None, None)
          | Some(dir) =>
            if (h.obj.id != c.obj.id) {
              process_collision(dir, c, h, state);
            } else {
              (None, None);
            }
          };
        } else {
          (None, None);
        };
      let acc =
        switch (new_objs) {
        | (None, Some(o)) => [o, ...acc]
        | (Some(o), None) => [o, ...acc]
        | (Some(o1), Some(o2)) => [o1, o2, ...acc]
        | (None, None) => acc
        };
      narrow_helper(c, t, state, acc);
    };
  narrow_helper(c, cs, state, []);
};

// This is an optimization setp to determine which objects require narrow phase
// checking. This excludes static collidables, allowing collision to only be
// checked with moving objects. This method is called once per collidable.
// Collision detection proceeds as follows:
//  1. Broad phase - filter collidables that cannot possibly collide with
//     this object.
//  2. Narrow phase - compare against all objects to determine whether there
//     is a collision, and process the collision.
// This method returns a list of objects that are created, which should be
// added to the list of collidables for the next iteration.
let checkCollisions = (collid, all_collids, state) =>
  switch (collid.Object.objTyp) {
  | Block(_) => []
  | _ =>
    let broad = broadPhase(collid, all_collids, state);
    narrowPhase(collid, broad, state);
  };

// primary update method for collidable objects,
// checking the collision, updating the object, and drawing to the canvas
let updateCollidable = (state, collid: Object.collidable, all_collids) => {
  /* TODO: optimize. Draw static elements only once */
  let obj = collid.obj;
  let spr = collid.sprite;
  obj.invuln = (
    if (obj.invuln > 0) {
      obj.invuln - 1;
    } else {
      0;
    }
  );
  if (!obj.kill && viewportFilter(state, obj, collid)) {
    obj.grounded = false;
    Object.processObj(obj, state.map);
    /* Run collision detection if moving object*/
    let evolved = checkCollisions(collid, all_collids, state);
    /* Render and update animation */
    let vpt_adj_xy = Viewport.fromCoord(state.vpt, obj.pos);
    Draw.render(spr, vpt_adj_xy.x, vpt_adj_xy.y);
    if (Keys.check_bbox_enabled()) {
      Draw.renderBbox(spr, vpt_adj_xy.x, vpt_adj_xy.y);
    };
    if (obj.vel.x != 0. || !Object.isEnemy(collid)) {
      Sprite.updateAnimation(spr);
    };
    evolved;
  } else {
    [];
  };
};

// used to update all of the collidables at once. Primarily used
// as a wrapper method. This method is necessary to differentiate between
// the player collidable and the remaining collidables, as special operations
// such as viewport centering only occur with the player
let runUpdateCollid = (state, collid: Object.collidable, all_collids) =>
  switch (collid) {
  | {objTyp: Player(_, n), sprite: s, obj: o} as p =>
    let keys = Keys.translate_keys(n);
    o.crouch = false;
    let player =
      switch (Object.updatePlayer(o, keys)) {
      | None => p
      | Some((new_typ, new_spr)) =>
        Object.normalizePos(o.pos, s.params, new_spr.params);
        {...p, objTyp: Player(new_typ, n), sprite: new_spr};
      };
    let evolved = updateCollidable(state, player, all_collids);
    collid_objs := evolved @ collid_objs^;
    player;
  | _ =>
    let obj = collid.obj;
    let evolved = updateCollidable(state, collid, all_collids);
    if (!obj.kill) {
      collid_objs := [collid, ...evolved @ collid_objs^];
    };
    let new_parts =
      if (obj.kill) {
        Object.kill(collid);
      } else {
        [];
      };
    particles := new_parts @ particles^;
    collid;
  };

// Primary update function to update and persist a particle
let runUpdateParticle = (state, part) => {
  Particle.process(part);
  let x = part.pos.x -. state.vpt->Viewport.getPos.x
  and y = part.pos.y -. state.vpt->Viewport.getPos.y;
  Draw.render(part.params.sprite, x, y);
  if (!part.kill) {
    particles := [part, ...particles^];
  };
};

// updateLoop is constantly being called to check for collisions and to
// update each of the objects in the game.
let rec updateLoop = ((player1: Object.collidable, player2, objs)) => {
  let viewport = Viewport.make(Load.getCanvasSizeScaled(), Config.mapDim);
  let state = {
    bgd: Sprite.makeBgd(),
    vpt: Viewport.update(viewport, player1.obj.pos),
    score: 0,
    coins: 0,
    multiplier: 1,
    map: snd(Config.mapDim),
    status: Playing,
  };

  let rec updateHelper = (time, state, player1, player2, objs, parts) => {
    switch (state.status) {
    | Won => Draw.gameWon()
    | Lost(t) when time -. t > Config.delayWhenLost =>
      let timeToStart =
        [@doesNotRaise]
        (Config.restartAfter - int_of_float(time -. t) / 1000);
      if (timeToStart > 0) {
        Draw.gameLost(timeToStart);
        Html.requestAnimationFrame((t: float) =>
          updateHelper(t, state, player1, player2, collid_objs^, particles^)
        );
      } else {
        let (player1, player2, objs) = Generator.generate();
        updateLoop((player1, player2, objs));
      };

    | Playing
    | Lost(_) =>
      let fps = calcFps();
      collid_objs := [];
      particles := [];
      Draw.clearCanvas();
      /* Parallax background */
      let vpos_x_int = int_of_float(state.vpt->Viewport.getPos.x /. 5.);
      let bgd_width = int_of_float(fst(state.bgd.params.frameSize));
      Draw.drawBgd(
        state.bgd,
        [@doesNotRaise] float_of_int(vpos_x_int mod bgd_width),
      );
      let player1 = runUpdateCollid(state, player1, [player2, ...objs]);
      let player2 = runUpdateCollid(state, player2, [player1, ...objs]);
      if (player1.obj.kill == true) {
        switch (state.status) {
        | Lost(_) => ()
        | _ => state.status = Lost(time)
        };
      };
      let state = {
        ...state,
        vpt: Viewport.update(state.vpt, player1.obj.pos),
      };
      List.forEach(objs, obj => runUpdateCollid(state, obj, objs));
      List.forEach(parts, part => runUpdateParticle(state, part));
      Draw.fps(fps);
      Draw.hud(state.score, state.coins);
      Html.requestAnimationFrame((t: float) =>
        updateHelper(t, state, player1, player2, collid_objs^, particles^)
      );
    };
  };
  updateHelper(0., state, player1, player2, objs, []);
};