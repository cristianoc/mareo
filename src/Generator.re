open Actors;

open Belt;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type blockCoord = (Actors.blockTyp, float, float);
type enemyCoord = (Actors.enemyTyp, float, float);

let rec memPos = (objs: list(_), x, y): bool =>
  switch (objs) {
  | [] => false
  | [{Object.px, py}, ...t] =>
    if (x == px && y == py) {
      true;
    } else {
      memPos(t, x, y);
    }
  };

let pixx = Config.blockw *. 16.;
let pixy = Config.blockh *. 16.;

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let trimEdge = (x, y) => {
  !(x < 128. || pixx -. x < 528. || y == 0. || pixy -. y < 48.);
};

let convertCoinToObj = ((_, x, y)) => {
  Object.make(
    ~dir=Left,
    Item(Coin),
    Sprite.makeItem(Coin),
    Object.makeItem(Coin),
    x,
    y,
  );
};

let addCoins = (objects, x, y0) => {
  let y = y0 -. 16.;
  if (Random.bool() && trimEdge(x, y) && !(objects^)->memPos(x, y)) {
    objects := [(QBlock(Coin), x, y)->convertCoinToObj, ...objects^];
  };
};

let convertEnemyToObj = ((enemyTyp, x, y)) => {
  let obj =
    Object.make(
      ~dir=Left,
      Enemy(enemyTyp),
      Sprite.makeEnemy(enemyTyp, Left),
      Object.makeEnemy(enemyTyp),
      x,
      y,
    );
  obj->Object.setVelToSpeed;
  obj;
};

let randomEnemyTyp = () =>
  switch (Random.int(3)) {
  | 0 => RKoopa
  | 1 => GKoopa
  | _ => Goomba
  };

let addEnemyOnBlock = (objects, x, y) => {
  let placeEnemy = Random.int(Config.enemyDensity);
  if (placeEnemy == 0 && !(objects^)->memPos(x, y -. 16.)) {
    objects :=
      [(randomEnemyTyp(), x, y -. 16.)->convertEnemyToObj, ...objects^];
  };
};

let addBlock = (objects, blockTyp, xBlock, yBlock) => {
  let x = xBlock *. 16.;
  let y = yBlock *. 16.;
  if (!(objects^)->memPos(x, y) && trimEdge(x, y)) {
    let obj =
      Object.make(
        ~dir=Left,
        Block(blockTyp),
        Sprite.makeParams(blockTyp),
        Object.makeBlock(blockTyp),
        x,
        y,
      );
    objects := [obj, ...objects^];
    objects->addCoins(x, y);
    objects->addEnemyOnBlock(x, y);
  };
};

// Generate a stair formation with block typ being dependent on typ. This type
// of stair formation requires that the first step be on the ground.
let generateGroundStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx +. 1., cby);
  blocks->addBlock(typ, cbx +. 2., cby);
  blocks->addBlock(typ, cbx +. 3., cby);
  blocks->addBlock(typ, cbx +. 1., cby -. 1.);
  blocks->addBlock(typ, cbx +. 2., cby -. 1.);
  blocks->addBlock(typ, cbx +. 3., cby -. 1.);
  blocks->addBlock(typ, cbx +. 2., cby -. 2.);
  blocks->addBlock(typ, cbx +. 3., cby -. 2.);
  blocks->addBlock(typ, cbx +. 3., cby -. 3.);
};

// Generate a stair formation going upwards.
let generateAirupStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx +. 1., cby);
  blocks->addBlock(typ, cbx +. 3., cby -. 1.);
  blocks->addBlock(typ, cbx +. 4., cby -. 1.);
  blocks->addBlock(typ, cbx +. 4., cby -. 2.);
  blocks->addBlock(typ, cbx +. 5., cby -. 2.);
  blocks->addBlock(typ, cbx +. 6., cby -. 2.);
};

// Generate a stair formation going downwards
let generateAirdownStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx +. 1., cby);
  blocks->addBlock(typ, cbx +. 2., cby);
  blocks->addBlock(typ, cbx +. 2., cby +. 1.);
  blocks->addBlock(typ, cbx +. 3., cby +. 1.);
  blocks->addBlock(typ, cbx +. 5., cby +. 2.);
  blocks->addBlock(typ, cbx +. 6., cby +. 2.);
};

// Generate a cloud block platform with some length num.
let rec generateClouds = (cbx, cby, typ, num, blocks) =>
  if (num == 0) {
    ();
  } else {
    blocks->addBlock(typ, cbx, cby);
    generateClouds(cbx +. 1., cby, typ, num - 1, blocks);
  };

let randomStairTyp = () => Random.bool() ? UnBBlock : Brick;

// Choose the form of the blocks to be placed.
// When called, leaves a 1 block gap from canvas size.
// 1. If current xblock or yblock is greater than canvas width or height
//    respectively, return an empty list.
// 2. If current xblock or yblock is within 10 blocks of the left and right sides
//    of the level map, prevent any objects from being initialized.
// 3. Else call helper methods to created block formations and return objCoord
//    slist.
let chooseBlockPattern =
    (cbx: float, cby: float, blocks: ref(list(Object.t))) =>
  if (cbx > Config.blockw || cby > Config.blockh) {
    ();
  } else {
    let stairTyp = randomStairTyp();
    let lifeBlock = Random.int(5) == 0;
    let middleBlock =
      if (lifeBlock) {
        QBlock(Mushroom);
      } else {
        stairTyp;
      };
    switch (Random.int(5)) {
    | 0 =>
      blocks->addBlock(stairTyp, cbx, cby);
      blocks->addBlock(middleBlock, cbx +. 1., cby);
      blocks->addBlock(stairTyp, cbx +. 2., cby);
    | 1 =>
      let numClouds = Random.int(5) + 5;
      if (cby < 5.) {
        generateClouds(cbx, cby, Cloud, numClouds, blocks);
      } else {
        ();
      };
    | 2 =>
      if (Config.blockh -. cby == 1.) {
        generateGroundStairs(cbx, cby, stairTyp, blocks);
      } else {
        ();
      }
    | 3 =>
      if (stairTyp == Brick && Config.blockh -. cby > 3.) {
        generateAirdownStairs(cbx, cby, stairTyp, blocks);
      } else if (Config.blockh -. cby > 2.) {
        generateAirupStairs(cbx, cby, stairTyp, blocks);
      } else {
        blocks->addBlock(stairTyp, cbx, cby);
      }
    | _ =>
      if (cby +. 3. -. Config.blockh == 2.) {
        blocks->addBlock(stairTyp, cbx, cby);
      } else if (cby +. 3. -. Config.blockh == 1.) {
        blocks->addBlock(stairTyp, cbx, cby);
        blocks->addBlock(stairTyp, cbx, cby +. 1.);
      } else {
        blocks->addBlock(stairTyp, cbx, cby);
        blocks->addBlock(stairTyp, cbx, cby +. 1.);
        blocks->addBlock(stairTyp, cbx, cby +. 2.);
      }
    };
  };

// Generates a list of enemies to be placed on the ground.
let rec generateEnemiesOnGround = (objects, cbx: float, cby: float) =>
  if (cbx > Config.blockw -. 32.) {
    ();
  } else if (cby > Config.blockh -. 1. || cbx < 15.) {
    generateEnemiesOnGround(objects, cbx +. 1., 0.);
  } else if (cby == 0. || Config.blockh -. 1. != cby || Random.int(10) != 0) {
    generateEnemiesOnGround(objects, cbx, cby +. 1.);
  } else {
    objects :=
      [
        (randomEnemyTyp(), cbx *. 16., cby *. 16.)->convertEnemyToObj,
        ...objects^,
      ];
    generateEnemiesOnGround(objects, cbx, cby +. 1.);
  };

// Generate an objCoord list (typ, coordinates) of blocks to be placed.
let rec generateBlocks = (objects, cbx: float, cby: float) =>
  if (Config.blockw -. cbx < 33.) {
    ();
  } else if (cby > Config.blockh -. 1.) {
    generateBlocks(objects, cbx +. 1., 0.);
  } else if ((objects^)->memPos(cbx, cby) || cby == 0.) {
    generateBlocks(objects, cbx, cby +. 1.);
  } else if (Random.int(20) == 0) {
    chooseBlockPattern(cbx, cby, objects);
    generateBlocks(objects, cbx, cby +. 1.);
  } else {
    generateBlocks(objects, cbx, cby +. 1.);
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel = (): Object.t => {
  Object.make(
    ~dir=Left,
    Block(Panel),
    Sprite.makeParams(Panel),
    Object.makeBlock(Panel),
    Config.blockw *. 16. -. 256.,
    Config.blockh *. 16. *. 2. /. 3.,
  );
};

let convertBlockToObj = ((blockTyp, x, y)) => {
  Object.make(
    ~dir=Left,
    Block(blockTyp),
    Sprite.makeParams(blockTyp),
    Object.makeBlock(blockTyp),
    x,
    y,
  );
};

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround = (objects, inc: float) =>
  if (inc > Config.blockw) {
    ();
  } else if (inc > 10.) {
    let skip = Random.int(10);
    if (skip == 7 && Config.blockw -. inc > 32.) {
      generateGround(objects, inc +. 1.);
    } else {
      objects :=
        [
          (Ground, inc *. 16., Config.blockh *. 16.)->convertBlockToObj,
          ...objects^,
        ];
      generateGround(objects, inc +. 1.);
    };
  } else {
    objects :=
      [
        (Ground, inc *. 16., Config.blockh *. 16.)->convertBlockToObj,
        ...objects^,
      ];
    generateGround(objects, inc +. 1.);
  };

// Procedurally generate a list of objects given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper = (): list(Object.t) => {
  let objects = ref([]);
  objects->generateBlocks(0., 0.);
  objects->generateGround(0.);
  objects->generateEnemiesOnGround(0., 0.);
  let panel = generatePanel();
  [panel, ...objects^];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generateHelper. Spawns
// the list of objects received from generateHelper to display on canvas.
let generate = (): (Object.t, Object.t, list(Object.t)) => {
  let initial = Html.performance.now(.);
  let objects = generateHelper();
  let player1 =
    Object.make(
      ~dir=Left,
      Player(SmallM, One),
      Sprite.makePlayer(SmallM, Standing, Left),
      Object.makePlayer(),
      100.,
      224.,
    );
  let player2 =
    Object.make(
      ~dir=Left,
      Player(SmallM, Two),
      Sprite.makePlayer(SmallM, Standing, Left),
      Object.makePlayer(),
      120.,
      224.,
    );
  let elapsed = Html.performance.now(.) -. initial;
  Js.log3(
    "generated",
    objects |> List.length,
    "objects in " ++ Js.Float.toString(elapsed) ++ " milliseconds",
  );
  (player1, player2, objects);
};