open Belt;

open Actors;

type status =
  | Playing
  | Lost(float)
  | Won;

// st represents the state of the game. It includes a background sprite (e.g.,
// (e.g., hills), a context (used for rendering onto the page), a viewport
// (used for moving the player's "camera"), a score (which is kept track
// throughout the game), coins (also kept track through the game),
// a multiplier (used for when you kill multiple enemies before ever touching
// the ground, as in the actual Super Mario), and a game_over bool (which
// is only true when the game is over).
type st = {
  bgd: Sprite.t,
  vpt: Viewport.viewport,
  map: float,
  mutable score: int,
  mutable coins: int,
  mutable multiplier: int,
  mutable status,
};

let collidObjs = ref([]); // List of next iteration collidable objects

let particles = ref([]); // List of next iteration particles

let lastTime = ref(0.); // Used for calculating fps
let initialTime = ref(0.); // Used for calculating fps

// Calculate fps as the difference between [t0] and [t1]
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

// Add [i] to the score in [state]
let updateScore = (state, i) => state.score = state.score + i;

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
    o1.vy = -. Config.dampenJump;
    o1.py = o1.py -. 5.;
    (None, r2);
  | _ =>
    Object.decHealth(o2);
    o1.vy = -. Config.dampenJump;
    if (state.multiplier == 8) {
      updateScore(state, 800);
      o2.score = 800;
      (None, Object.evolveEnemy(o1.dir, typ, s2, o2));
    } else {
      let score = 100 * state.multiplier;
      updateScore(state, score);
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
      if (o2.vx == 0.) {
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

// In the case that two enemies collide, they are to reverse directions. However,
// in the case that one or more of the two enemies is a koopa shell, then
// the koopa shell kills the other enemy.
let collEnemyEnemy = (t1, s1, o1, t2, s2, o2, dir) =>
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
    if (o1.vx == 0.) {
      Object.revDir(o2, t2, s2);
      (None, None);
    } else {
      Object.decHealth(o2);
      (None, None);
    }
  | (_, RKoopaShell)
  | (_, GKoopaShell) =>
    if (o2.vx == 0.) {
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

// Process collision is called to match each of the possible collisions that
// may occur. Returns a pair of options, representing objects that
// were created from the existing ones. That is, the first element represents
// a new item spawned as a result of the first object. None indicates that
// no new item should be spawned. Transformations to existing objects occur
// mutably, as many changes are side-effectual.
let processCollision =
    (dir: Actors.dir2d, c1: Object.t, c2: Object.t, state: st) => {
  switch (c1, c2, dir) {
  | ({objTyp: Player(_)}, {objTyp: Enemy(typ), sprite: s2}, South)
  | ({objTyp: Enemy(typ), sprite: s2}, {objTyp: Player(_)}, North) =>
    playerAttackEnemy(c1, typ, s2, c2, state)
  | ({objTyp: Player(_)}, {objTyp: Enemy(t2), sprite: s2}, _)
  | ({objTyp: Enemy(t2), sprite: s2}, {objTyp: Player(_)}, _) =>
    enemyAttackPlayer(c1, t2, s2, c2)
  | ({objTyp: Player(_)}, {objTyp: Item(t2)}, _)
  | ({objTyp: Item(t2)}, {objTyp: Player(_)}, _) =>
    switch (t2) {
    | Mushroom =>
      Object.decHealth(c2);
      if (c1.health == 2) {
        ();
      } else {
        c1.health = c1.health + 1;
      };
      c1.vx = 0.;
      c1.vy = 0.;
      updateScore(state, 1000);
      c2.score = 1000;
      (None, None);
    | Coin =>
      state.coins = state.coins + 1;
      Object.decHealth(c2);
      updateScore(state, 100);
      (None, None);
    }
  | ({objTyp: Enemy(t1), sprite: s1}, {objTyp: Enemy(t2), sprite: s2}, dir) =>
    collEnemyEnemy(t1, s1, c1, t2, s2, c2, dir)
  | ({objTyp: Enemy(t1), sprite: s1}, {objTyp: Block(t2)}, East)
  | ({objTyp: Enemy(t1), sprite: s1}, {objTyp: Block(t2)}, West) =>
    switch (t1, t2) {
    | (RKoopaShell, Brick)
    | (GKoopaShell, Brick) =>
      Object.decHealth(c2);
      Object.reverseLeftRight(c1);
      (None, None);
    | (RKoopaShell, QBlock(typ))
    | (GKoopaShell, QBlock(typ)) =>
      let updatedBlock = Object.evolveBlock(c2);
      let spawnedItem = Object.spawnAbove(c1.dir, c2, typ);
      Object.revDir(c1, t1, s1);
      (Some(updatedBlock), Some(spawnedItem));
    | (_, _) =>
      Object.revDir(c1, t1, s1);
      (None, None);
    }
  | ({objTyp: Item(_)}, {objTyp: Block(_)}, East)
  | ({objTyp: Item(_)}, {objTyp: Block(_)}, West) =>
    Object.reverseLeftRight(c1);
    (None, None);
  | ({objTyp: Enemy(_)}, {objTyp: Block(_)}, _)
  | ({objTyp: Item(_)}, {objTyp: Block(_)}, _) =>
    Object.collideBlock(dir, c1);
    (None, None);
  | ({objTyp: Player(t1, _)}, {objTyp: Block(t)}, North) =>
    switch (t) {
    | QBlock(typ) =>
      let updatedBlock = Object.evolveBlock(c2);
      let spawnedItem = Object.spawnAbove(c1.dir, c2, typ);
      Object.collideBlock(dir, c1);
      (Some(spawnedItem), Some(updatedBlock));
    | Brick =>
      if (t1 == BigM) {
        Object.collideBlock(dir, c1);
        Object.decHealth(c2);
        (None, None);
      } else {
        Object.collideBlock(dir, c1);
        (None, None);
      }
    | Panel =>
      state.status = Won;
      (None, None);
    | _ =>
      Object.collideBlock(dir, c1);
      (None, None);
    }
  | ({objTyp: Player(_)}, {objTyp: Block(t)}, _) =>
    switch (t) {
    | Panel =>
      state.status = Won;
      (None, None);
    | _ =>
      switch (dir) {
      | South =>
        state.multiplier = 1;
        Object.collideBlock(dir, c1);
        (None, None);
      | _ =>
        Object.collideBlock(dir, c1);
        (None, None);
      }
    }
  | (_, _, _) => (None, None)
  };
};

let viewportFilter = (obj: Object.t, state) =>
  Viewport.inViewport(state.vpt, obj.px, obj.py)
  || Object.isPlayer(obj)
  || Viewport.outOfViewportBelow(state.vpt, obj.py);

// Run the broad phase object filtering
let broadPhase = (obj: Object.t, allCollids, state) => {
  allCollids->List.keep(_c => obj->viewportFilter(state));
};

// narrowPhase of collision is used in order to continuously loop through
// each of the collidable objects to constantly check if collisions are
// occurring.
let narrowPhase = (c, cs, state) => {
  let rec narrowHelper = (c: Object.t, cs, state, acc) =>
    switch (cs) {
    | [] => acc
    | [h, ...t] =>
      let newObjs =
        if (!Object.equals(c, h)) {
          switch (Object.checkCollision(c, h)) {
          | None => (None, None)
          | Some(dir) =>
            if (h.id != c.id) {
              processCollision(dir, c, h, state);
            } else {
              (None, None);
            }
          };
        } else {
          (None, None);
        };
      let acc =
        switch (newObjs) {
        | (None, Some(o)) => [o, ...acc]
        | (Some(o), None) => [o, ...acc]
        | (Some(o1), Some(o2)) => [o1, o2, ...acc]
        | (None, None) => acc
        };
      narrowHelper(c, t, state, acc);
    };
  narrowHelper(c, cs, state, []);
};

// This is an optimization setp to determine which objects require narrow phase
// checking. This excludes static objects, allowing collision to only be
// checked with moving objects. This method is called once per objects.
// Collision detection proceeds as follows:
//  1. Broad phase - filter objects that cannot possibly collide with
//     this object.
//  2. Narrow phase - compare against all objects to determine whether there
//     is a collision, and process the collision.
// This method returns a list of objects that are created, which should be
// added to the list of objects for the next iteration.
let checkCollisions = (obj, allCollids, state) =>
  switch (obj.Object.objTyp) {
  | Block(_) => []
  | _ =>
    let broad = broadPhase(obj, allCollids, state);
    narrowPhase(obj, broad, state);
  };

// primary update method for objects,
// checking the collision, updating the object, and drawing to the canvas
let updateCollidable = (state, obj: Object.t, allCollids) => {
  /* TODO: optimize. Draw static elements only once */
  let spr = obj.sprite;
  obj.invuln = (
    if (obj.invuln > 0) {
      obj.invuln - 1;
    } else {
      0;
    }
  );
  if (!obj.kill && obj->viewportFilter(state)) {
    obj.grounded = false;
    Object.processObj(obj, state.map);
    // Run collision detection if moving object
    let evolved = checkCollisions(obj, allCollids, state);
    // Render and update animation
    let vptAdjXy = Viewport.fromCoord(state.vpt, obj.px, obj.py);
    Draw.render(spr, vptAdjXy.x, vptAdjXy.y);
    if (Keys.checkBboxEnabled()) {
      Draw.renderBbox(spr, vptAdjXy.x, vptAdjXy.y);
    };
    if (obj.vx != 0. || !Object.isEnemy(obj)) {
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
let updateOnCollid = (state, obj: Object.t, allCollids) =>
  switch (obj.objTyp) {
  | Player(_, n) =>
    let keys = Keys.translateKeys(n);
    obj.crouch = false;
    Object.updatePlayer(obj, n, keys);
    let evolved = updateCollidable(state, obj, allCollids);
    collidObjs := evolved @ collidObjs^;
  | _ =>
    let evolved = updateCollidable(state, obj, allCollids);
    if (!obj.kill) {
      collidObjs := [obj, ...evolved @ collidObjs^];
    };
    let newParts =
      if (obj.kill) {
        Object.kill(obj);
      } else {
        [];
      };
    particles := newParts @ particles^;
  };

// Primary update function to update and persist a particle
let updateParticle = (state, part) => {
  Particle.process(part);
  let x = part.px -. state.vpt->Viewport.getPos.x
  and y = part.py -. state.vpt->Viewport.getPos.y;
  Draw.render(part.params.sprite, x, y);
  if (!part.kill) {
    particles := [part, ...particles^];
  };
};

// updateLoop is constantly being called to check for collisions and to
// update each of the objects in the game.
let rec updateLoop = (player1: Object.t, player2, objs) => {
  let viewport = Viewport.make(Load.getCanvasSizeScaled(), Config.mapDim);
  let state = {
    bgd: Sprite.makeBgd(),
    vpt: Viewport.update(viewport, player1.px, player1.py),
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
          updateHelper(t, state, player1, player2, collidObjs^, particles^)
        );
      } else {
        let (player1, player2, objs) = Generator.generate();
        updateLoop(player1, player2, objs);
      };

    | Playing
    | Lost(_) =>
      let fps = calcFps();
      collidObjs := [];
      particles := [];
      Draw.clearCanvas();
      /* Parallax background */
      let vposXInt = int_of_float(state.vpt->Viewport.getPos.x /. 5.);
      let bgdWidth = int_of_float(fst(state.bgd.params.frameSize));
      Draw.drawBgd(
        state.bgd,
        [@doesNotRaise] float_of_int(vposXInt mod bgdWidth),
      );
      updateOnCollid(state, player1, [player2, ...objs]);
      updateOnCollid(state, player2, [player1, ...objs]);
      if (player1.kill == true) {
        switch (state.status) {
        | Lost(_) => ()
        | _ => state.status = Lost(time)
        };
      };
      let state = {
        ...state,
        vpt: Viewport.update(state.vpt, player1.px, player1.py),
      };
      objs->List.forEach(obj => updateOnCollid(state, obj, objs));
      parts->List.forEach(part => updateParticle(state, part));
      Draw.fps(fps);
      Draw.hud(state.score, state.coins);
      Html.requestAnimationFrame((t: float) =>
        updateHelper(t, state, player1, player2, collidObjs^, particles^)
      );
    };
  };
  updateHelper(0., state, player1, player2, objs, []);
};