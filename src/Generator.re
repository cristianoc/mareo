open Actors;

open Belt;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type blockCoord = (Actors.blockTyp, float, float);
type enemyCoord = (Actors.enemyTyp, float, float);

// Check if the given position checkpos is already part of the list of locations
// in blocks
let rec memPos = (x: float, y, objs: list(_)): bool =>
  switch (objs) {
  | [] => false
  | [(_, px, py), ...t] =>
    if (x == px && y == py) {
      true;
    } else {
      memPos(x, y, t);
    }
  };

let rec removeOverlap = (lst, currentObjs) =>
  switch (lst) {
  | [] => []
  | [(_, x, y) as h, ...t] =>
    if (memPos(x, y, currentObjs)) {
      removeOverlap(t, currentObjs);
    } else {
      [h, ...removeOverlap(t, currentObjs)];
    }
  };

let rec memPos2 = (x, y, objs: list(_)): bool =>
  switch (objs) {
  | [] => false
  | [{Object.obj: {pos: {x: px, y: py}}}, ...t] =>
    if (x == px && y == py) {
      true;
    } else {
      memPos2(x, y, t);
    }
  };

let rec removeOverlap2 = (lst, currentObjs) =>
  switch (lst) {
  | [] => []
  | [(_, x, y) as h, ...t] =>
    if (memPos2(x, y, currentObjs)) {
      removeOverlap2(t, currentObjs);
    } else {
      [h, ...removeOverlap2(t, currentObjs)];
    }
  };

let pixx = Config.blockw *. 16.;
let pixy = Config.blockh *. 16.;

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let trimEdge = (x, y) => {
  !(x < 128. || pixx -. x < 528. || y == 0. || pixy -. y < 48.);
};
let trimEdges = lst => lst->List.keep(((_, x, y)) => trimEdge(x, y));

let addBlock = (blocks, blockTyp, x, y) =>
  if (!memPos2(x *. 16., y *. 16., blocks^) && trimEdge(x *. 16., y *. 16.)) {
    let (sprite, obj) =
      Object.make(
        ~dir=Left,
        Sprite.makeParams(blockTyp),
        Object.makeBlock(blockTyp),
        x *. 16.,
        y *. 16.,
      );
    blocks := [{Object.objTyp: Block(blockTyp), sprite, obj}, ...blocks^];
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

let convertCoinToObj = ((_, x, y)) => {
  let (sprite, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makeItem(Coin),
      Object.makeItem(Coin),
      x,
      y,
    );
  {Object.objTyp: Item(Coin), sprite, obj};
};

// Convert the list of coordinates into a list of Coin objects
let convertCoinsToObj = lst => lst->List.map(convertCoinToObj);

// Generate an objCoord list (typ, coordinates) of coins to be placed.
let rec generateCoins =
        (blocks: list(Object.collidable)): list(Object.collidable) => {
  let placeCoin = Random.int(2);
  switch (blocks) {
  | [] => []
  | [{obj: {pos: {x, y}}}, ...t] =>
    if (placeCoin == 0 && !memPos2(x, y, blocks) && trimEdge(x, y)) {
      [(QBlock(Coin), x, y -. 16.)->convertCoinToObj] @ generateCoins(t);
    } else {
      generateCoins(t);
    }
  };
};

let randomEnemyTyp = () =>
  switch (Random.int(3)) {
  | 0 => RKoopa
  | 1 => GKoopa
  | _ => Goomba
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
    (cbx: float, cby: float, blocks: ref(list(Object.collidable))) =>
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
let rec generateEnemies =
        (cbx: float, cby: float, blocks: list(Object.collidable))
        : list(enemyCoord) =>
  if (cbx > Config.blockw -. 32.) {
    [];
  } else if (cby > Config.blockh -. 1. || cbx < 15.) {
    generateEnemies(cbx +. 1., 0., blocks);
  } else if (memPos2(cbx, cby, blocks) || cby == 0.) {
    generateEnemies(cbx, cby +. 1., blocks);
  } else {
    let isEnemy = Random.int(10) == 0;
    if (isEnemy && Config.blockh -. 1. == cby) {
      [
        (randomEnemyTyp(), cbx *. 16., cby *. 16.),
        ...generateEnemies(cbx, cby +. 1., blocks),
      ];
    } else {
      generateEnemies(cbx, cby +. 1., blocks);
    };
  };

// Generates a list of enemies to be placed upon the block objects.
let rec generateBlockEnemies =
        (blockCoord: list(Object.collidable)): list(enemyCoord) => {
  let placeEnemy = Random.int(20);
  switch (blockCoord) {
  | [] => []
  | [{obj: {pos: {x, y}}}, ...t] =>
    if (placeEnemy == 0) {
      [(randomEnemyTyp(), x, y -. 16.)] @ generateBlockEnemies(t);
    } else {
      generateBlockEnemies(t);
    }
  };
};

// Generate an objCoord list (typ, coordinates) of blocks to be placed.
let rec generateBlockLocs =
        (cbx: float, cby: float, blocks: ref(list(Object.collidable))) =>
  if (Config.blockw -. cbx < 33.) {
    ();
  } else if (cby > Config.blockh -. 1.) {
    generateBlockLocs(cbx +. 1., 0., blocks);
  } else if (memPos2(cbx, cby, blocks^) || cby == 0.) {
    generateBlockLocs(cbx, cby +. 1., blocks);
  } else if (Random.int(20) == 0) {
    chooseBlockPattern(cbx, cby, blocks);
    generateBlockLocs(cbx, cby +. 1., blocks);
  } else {
    generateBlockLocs(cbx, cby +. 1., blocks);
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel = (): Object.collidable => {
  let (sprite, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makeParams(Panel),
      Object.makeBlock(Panel),
      Config.blockw *. 16. -. 256.,
      Config.blockh *. 16. *. 2. /. 3.,
    );
  {objTyp: Block(Panel), sprite, obj};
};

let convertBlockToObj = ((blockTyp, x, y)) => {
  let (sprite, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makeParams(blockTyp),
      Object.makeBlock(blockTyp),
      x,
      y,
    );
  {Object.objTyp: Block(blockTyp), sprite, obj};
};

// Convert the objCoord list called by generateBlockLocs to a list of objects
// with the coordinates given from the objCoord list.
let convertBlocksToObj = (lst: list(blockCoord)): list(Object.collidable) =>
  lst->List.map(convertBlockToObj);

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround =
        (inc: float, acc: list(Object.collidable)): list(Object.collidable) =>
  if (inc > Config.blockw) {
    acc;
  } else if (inc > 10.) {
    let skip = Random.int(10);
    if (skip == 7 && Config.blockw -. inc > 32.) {
      generateGround(inc +. 1., acc);
    } else {
      generateGround(
        inc +. 1.,
        [
          (Ground, inc *. 16., Config.blockh *. 16.)->convertBlockToObj,
          ...acc,
        ],
      );
    };
  } else {
    generateGround(
      inc +. 1.,
      [
        (Ground, inc *. 16., Config.blockh *. 16.)->convertBlockToObj,
        ...acc,
      ],
    );
  };

let convertEnemyToObj = ((enemyTyp, x, y)) => {
  let (sprite, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makeEnemy(enemyTyp, Left),
      Object.makeEnemy(enemyTyp),
      x,
      y,
    );
  Object.setVelToSpeed(obj);
  {Object.objTyp: Enemy(enemyTyp), sprite, obj};
};

let convertToEnemiesToObj = lst => lst->List.map(convertEnemyToObj);

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper = (): list(Object.collidable) => {
  let blocks = {
    let blockLocs = ref([]);
    generateBlockLocs(0., 0., blockLocs);
    blockLocs^;
  };

  let groundBlocks = generateGround(0., []);

  let allBlocks = blocks @ groundBlocks;

  let objConvertedEnemies =
    generateEnemies(0., 0., allBlocks)->convertToEnemiesToObj;

  let coinBlocks = generateCoins(groundBlocks);

  let objEnemyBlocks =
    generateBlockEnemies(groundBlocks)
    ->removeOverlap2(groundBlocks)
    ->removeOverlap2(coinBlocks)
    ->convertToEnemiesToObj;

  let objPanel = generatePanel();

  allBlocks @ objConvertedEnemies @ coinBlocks @ objEnemyBlocks @ [objPanel];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generateHelper. Spawns
// the list of collidables received from generateHelper to display on canvas.
let generate = (): (Object.collidable, list(Object.collidable)) => {
  let initial = Html.performance.now(.);
  let collideList = generateHelper();
  let (sprite, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makePlayer(SmallM, Standing, Left),
      Object.makePlayer(),
      100.,
      224.,
    );
  let player = {Object.objTyp: Player(SmallM), sprite, obj};
  let elapsed = Html.performance.now(.) -. initial;
  Js.log3(
    "generated",
    collideList |> List.length,
    "objects in " ++ Js.Float.toString(elapsed) ++ " milliseconds",
  );
  (player, collideList);
};