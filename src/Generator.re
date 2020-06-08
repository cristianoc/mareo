open Actors;

open Object;

open Belt;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type blockCoord = (Actors.blockTyp, Actors.xy);
type enemyCoord = (Actors.enemyTyp, Actors.xy);

// Convert list of locations from blocksize to pixelsize by multiplying (x,y) by 16.
let rec convertList = (lst: list(blockCoord)): list(blockCoord) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, pos), ...t] =>
    [(blockTyp, {x: pos.x *. 16., y: pos.y *. 16.})] @ convertList(t)
  };

// Check if the given position checkpos is already part of the list of locations
// in blocks
let rec memPos = (checkpos: Actors.xy, objs: list(_)): bool =>
  switch (objs) {
  | [] => false
  | [(_, pos), ...t] =>
    if (checkpos == pos) {
      true;
    } else {
      memPos(checkpos, t);
    }
  };

let rec removeOverlap =
        (
          lst: list(('obj1, Actors.xy)),
          currentObjs: list(('obj2, Actors.xy)),
        )
        : list(('obj1, Actors.xy)) =>
  switch (lst) {
  | [] => []
  | [(_, pos) as h, ...t] =>
    if (memPos(pos, currentObjs)) {
      removeOverlap(t, currentObjs);
    } else {
      [h, ...removeOverlap(t, currentObjs)];
    }
  };

let pixx = Config.blockw *. 16.;
let pixy = Config.blockh *. 16.;

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let trimEdge = pos => {
  !(
    pos.x < 128. || pixx -. pos.x < 528. || pos.y == 0. || pixy -. pos.y < 48.
  );
};
let trimEdges = lst => lst->List.keep(((_, pos)) => pos->trimEdge);

// Generate a stair formation with block typ being dependent on typ. This type
// of stair formation requires that the first step be on the ground.
let generateGroundStairs = (cbx, cby, typ) => {
  let four = [
    (typ, {x: cbx, y: cby}),
    (typ, {x: cbx +. 1., y: cby}),
    (typ, {x: cbx +. 2., y: cby}),
    (typ, {x: cbx +. 3., y: cby}),
  ];
  let three = [
    (typ, {x: cbx +. 1., y: cby -. 1.}),
    (typ, {x: cbx +. 2., y: cby -. 1.}),
    (typ, {x: cbx +. 3., y: cby -. 1.}),
  ];
  let two = [
    (typ, {x: cbx +. 2., y: cby -. 2.}),
    (typ, {x: cbx +. 3., y: cby -. 2.}),
  ];
  let one = [(typ, {x: cbx +. 3., y: cby -. 3.})];
  four @ three @ two @ one;
};

// Generate a stair formation going upwards.
let generateAirupStairs = (cbx, cby, typ) => {
  let one = [(typ, {x: cbx, y: cby}), (typ, {x: cbx +. 1., y: cby})];
  let two = [
    (typ, {x: cbx +. 3., y: cby -. 1.}),
    (typ, {x: cbx +. 4., y: cby -. 1.}),
  ];
  let three = [
    (typ, {x: cbx +. 4., y: cby -. 2.}),
    (typ, {x: cbx +. 5., y: cby -. 2.}),
    (typ, {x: cbx +. 6., y: cby -. 2.}),
  ];
  one @ two @ three;
};

// Generate a stair formation going downwards
let generateAirdownStairs = (cbx, cby, typ) => {
  let three = [
    (typ, {x: cbx, y: cby}),
    (typ, {x: cbx +. 1., y: cby}),
    (typ, {x: cbx +. 2., y: cby}),
  ];
  let two = [
    (typ, {x: cbx +. 2., y: cby +. 1.}),
    (typ, {x: cbx +. 3., y: cby +. 1.}),
  ];
  let one = [
    (typ, {x: cbx +. 5., y: cby +. 2.}),
    (typ, {x: cbx +. 6., y: cby +. 2.}),
  ];
  three @ two @ one;
};

// Generate a cloud block platform with some length num.
let rec generateClouds = (cbx, cby, typ, num) =>
  if (num == 0) {
    [];
  } else {
    [(typ, {x: cbx, y: cby})]
    @ generateClouds(cbx +. 1., cby, typ, num - 1);
  };

// Generate an objCoord list (typ, coordinates) of coins to be placed.
let rec generateCoins = (blocks: list(blockCoord)): list(blockCoord) => {
  let placeCoin = Random.int(2);
  switch (blocks) {
  | [] => []
  | [(_, pos), ...t] =>
    if (placeCoin == 0) {
      let xc = pos.x;
      let yc = pos.y;
      [(QBlock(Coin), {x: xc, y: yc -. 16.})] @ generateCoins(t);
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
let chooseBlockPattern = (cbx: float, cby: float): list(blockCoord) =>
  if (cbx > Config.blockw || cby > Config.blockh) {
    [];
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
    | 0 => [
        (stairTyp, {x: cbx, y: cby}),
        (middleBlock, {x: cbx +. 1., y: cby}),
        (stairTyp, {x: cbx +. 2., y: cby}),
      ]
    | 1 =>
      let numClouds = Random.int(5) + 5;
      if (cby < 5.) {
        generateClouds(cbx, cby, Cloud, numClouds);
      } else {
        [];
      };
    | 2 =>
      if (Config.blockh -. cby == 1.) {
        generateGroundStairs(cbx, cby, stairTyp);
      } else {
        [];
      }
    | 3 =>
      if (stairTyp == Brick && Config.blockh -. cby > 3.) {
        generateAirdownStairs(cbx, cby, stairTyp);
      } else if (Config.blockh -. cby > 2.) {
        generateAirupStairs(cbx, cby, stairTyp);
      } else {
        [(stairTyp, {x: cbx, y: cby})];
      }
    | _ =>
      if (cby +. 3. -. Config.blockh == 2.) {
        [(stairTyp, {x: cbx, y: cby})];
      } else if (cby +. 3. -. Config.blockh == 1.) {
        [
          (stairTyp, {x: cbx, y: cby}),
          (stairTyp, {x: cbx, y: cby +. 1.}),
        ];
      } else {
        [
          (stairTyp, {x: cbx, y: cby}),
          (stairTyp, {x: cbx, y: cby +. 1.}),
          (stairTyp, {x: cbx, y: cby +. 2.}),
        ];
      }
    };
  };

// Generates a list of enemies to be placed on the ground.
let rec generateEnemies = (cbx: float, cby: float, blocks: list(blockCoord)) =>
  if (cbx > Config.blockw -. 32.) {
    [];
  } else if (cby > Config.blockh -. 1. || cbx < 15.) {
    generateEnemies(cbx +. 1., 0., blocks);
  } else if (memPos({x: cbx, y: cby}, blocks) || cby == 0.) {
    generateEnemies(cbx, cby +. 1., blocks);
  } else {
    let isEnemy = Random.int(10) == 0;
    if (isEnemy && Config.blockh -. 1. == cby) {
      let enemy = [(randomEnemyTyp(), {x: cbx *. 16., y: cby *. 16.})];
      enemy @ generateEnemies(cbx, cby +. 1., blocks);
    } else {
      generateEnemies(cbx, cby +. 1., blocks);
    };
  };

// Generates a list of enemies to be placed upon the block objects.
let rec generateBlockEnemies =
        (blockCoord: list(blockCoord)): list(enemyCoord) => {
  let placeEnemy = Random.int(20);
  switch (blockCoord) {
  | [] => []
  | [h, ...t] =>
    if (placeEnemy == 0) {
      let xc = snd(h).x;
      let yc = snd(h).y;
      [(randomEnemyTyp(), {x: xc, y: yc -. 16.})] @ generateBlockEnemies(t);
    } else {
      generateBlockEnemies(t);
    }
  };
};

// Generate an objCoord list (typ, coordinates) of blocks to be placed.
let rec generateBlockLocs =
        (cbx: float, cby: float, acc: list(blockCoord)): list(blockCoord) =>
  if (Config.blockw -. cbx < 33.) {
    acc;
  } else if (cby > Config.blockh -. 1.) {
    generateBlockLocs(cbx +. 1., 0., acc);
  } else if (memPos({x: cbx, y: cby}, acc) || cby == 0.) {
    generateBlockLocs(cbx, cby +. 1., acc);
  } else if (Random.int(20) == 0) {
    let newacc = chooseBlockPattern(cbx, cby);
    let undupLst = removeOverlap(newacc, acc);
    let calledAcc = acc @ undupLst;
    generateBlockLocs(cbx, cby +. 1., calledAcc);
  } else {
    generateBlockLocs(cbx, cby +. 1., acc);
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel = (): collidable => {
  let ob =
    Object.spawn(
      SBlock(Panel),
      {
        Actors.x: Config.blockw *. 16. -. 256.,
        y: Config.blockh *. 16. *. 2. /. 3.,
      },
    );
  ob;
};

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround =
        (inc: float, acc: list(blockCoord)): list(blockCoord) =>
  if (inc > Config.blockw) {
    acc;
  } else if (inc > 10.) {
    let skip = Random.int(10);
    let newacc = acc @ [(Ground, {x: inc *. 16., y: Config.blockh *. 16.})];
    if (skip == 7 && Config.blockw -. inc > 32.) {
      generateGround(inc +. 1., acc);
    } else {
      generateGround(inc +. 1., newacc);
    };
  } else {
    let newacc = acc @ [(Ground, {x: inc *. 16., y: Config.blockh *. 16.})];
    generateGround(inc +. 1., newacc);
  };

// Convert the objCoord list called by generateBlockLocs to a list of objects
// with the coordinates given from the objCoord list.
let rec convertToBlockObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, pos), ...t] =>
    let ob = Object.spawn(SBlock(blockTyp), pos);
    [ob] @ convertToBlockObj(t, context);
  };

// Convert the objCoord list called by generateEnemies to a list of objects
// with the coordinates given from the objCoord list.
let rec convertToEnemyObj =
        (lst: list(enemyCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [(enemyTyp, pos), ...t] =>
    let ob = Object.spawn(SEnemy(enemyTyp), pos);
    [ob] @ convertToEnemyObj(t, context);
  };

// Convert the list of coordinates into a list of Coin objects
let rec convertToCoinObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let sitemTyp = Coin;
    let ob = Object.spawn(SItem(sitemTyp), snd(h));
    [ob] @ convertToCoinObj(t, context);
  };

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper =
    (context: Html.canvasRenderingContext2D): list(collidable) => {
  let blockLocs = generateBlockLocs(0., 0., []);
  let convertedBlockLocs = trimEdges(convertList(blockLocs));
  let objConvertedBlockLocs = convertToBlockObj(convertedBlockLocs, context);
  let groundBlocks = generateGround(0., []);
  let objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  let blockLocations = blockLocs @ groundBlocks;
  let allBlocks = objConvertedBlockLocs @ objConvertedGroundBlocks;
  let enemyLocs = generateEnemies(0., 0., blockLocations);
  let objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  let coinsLocs = generateCoins(convertedBlockLocs);
  let undupCoinLocs =
    trimEdges(removeOverlap(coinsLocs, convertedBlockLocs));
  let enemyBlockLocs = generateBlockEnemies(convertedBlockLocs);
  let undupEnemyBlockLocs =
    enemyBlockLocs
    ->removeOverlap(convertedBlockLocs)
    ->removeOverlap(coinsLocs);
  let objEnemyBlocks = convertToEnemyObj(undupEnemyBlockLocs, context);
  let coinObjects = convertToCoinObj(undupCoinLocs, context);
  let objPanel = generatePanel();
  allBlocks @ objConvertedEnemies @ coinObjects @ objEnemyBlocks @ [objPanel];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generateHelper. Spawns
// the list of collidables received from generateHelper to display on canvas.
let generate = (): (collidable, list(collidable)) => {
  let initial = Html.performance.now(.);
  let collideList = generateHelper(Load.getContext());
  let player = Object.spawn(SPlayer(SmallM, Standing), {x: 100., y: 224.});
  let elapsed = Html.performance.now(.) -. initial;
  Js.log3(
    "generated",
    collideList |> List.length,
    "objects in " ++ Js.Float.toString(elapsed) ++ " milliseconds",
  );
  (player, collideList);
};

// Makes sure level map is uniquely generated at each call.
let init = () => Random.self_init();