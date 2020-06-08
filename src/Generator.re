open Actors;

open Belt;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type blockCoord = (Actors.blockTyp, float, float);
type enemyCoord = (Actors.enemyTyp, float, float);

// Convert list of locations from blocksize to pixelsize by multiplying (x,y) by 16.
let rec convertList = (lst: list(blockCoord)): list(blockCoord) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, x, y), ...t] =>
    [(blockTyp, x *. 16., y *. 16.)] @ convertList(t)
  };

// Check if the given position checkpos is already part of the list of locations
// in blocks
let rec memPos = (x, y, objs: list(_)): bool =>
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

let pixx = Config.blockw *. 16.;
let pixy = Config.blockh *. 16.;

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let trimEdge = (x, y) => {
  !(x < 128. || pixx -. x < 528. || y == 0. || pixy -. y < 48.);
};
let trimEdges = lst => lst->List.keep(((_, x, y)) => trimEdge(x, y));

// Generate a stair formation with block typ being dependent on typ. This type
// of stair formation requires that the first step be on the ground.
let generateGroundStairs = (cbx, cby, typ) => {
  let four = [
    (typ, cbx, cby),
    (typ, cbx +. 1., cby),
    (typ, cbx +. 2., cby),
    (typ, cbx +. 3., cby),
  ];
  let three = [
    (typ, cbx +. 1., cby -. 1.),
    (typ, cbx +. 2., cby -. 1.),
    (typ, cbx +. 3., cby -. 1.),
  ];
  let two = [(typ, cbx +. 2., cby -. 2.), (typ, cbx +. 3., cby -. 2.)];
  let one = [(typ, cbx +. 3., cby -. 3.)];
  four @ three @ two @ one;
};

// Generate a stair formation going upwards.
let generateAirupStairs = (cbx, cby, typ) => {
  let one = [(typ, cbx, cby), (typ, cbx +. 1., cby)];
  let two = [(typ, cbx +. 3., cby -. 1.), (typ, cbx +. 4., cby -. 1.)];
  let three = [
    (typ, cbx +. 4., cby -. 2.),
    (typ, cbx +. 5., cby -. 2.),
    (typ, cbx +. 6., cby -. 2.),
  ];
  one @ two @ three;
};

// Generate a stair formation going downwards
let generateAirdownStairs = (cbx, cby, typ) => {
  let three = [
    (typ, cbx, cby),
    (typ, cbx +. 1., cby),
    (typ, cbx +. 2., cby),
  ];
  let two = [(typ, cbx +. 2., cby +. 1.), (typ, cbx +. 3., cby +. 1.)];
  let one = [(typ, cbx +. 5., cby +. 2.), (typ, cbx +. 6., cby +. 2.)];
  three @ two @ one;
};

// Generate a cloud block platform with some length num.
let rec generateClouds = (cbx, cby, typ, num) =>
  if (num == 0) {
    [];
  } else {
    [(typ, cbx, cby)] @ generateClouds(cbx +. 1., cby, typ, num - 1);
  };

// Generate an objCoord list (typ, coordinates) of coins to be placed.
let rec generateCoins = (blocks: list(blockCoord)): list(blockCoord) => {
  let placeCoin = Random.int(2);
  switch (blocks) {
  | [] => []
  | [(_, x, y), ...t] =>
    if (placeCoin == 0) {
      [(QBlock(Coin), x, y -. 16.)] @ generateCoins(t);
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
        (stairTyp, cbx, cby),
        (middleBlock, cbx +. 1., cby),
        (stairTyp, cbx +. 2., cby),
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
        [(stairTyp, cbx, cby)];
      }
    | _ =>
      if (cby +. 3. -. Config.blockh == 2.) {
        [(stairTyp, cbx, cby)];
      } else if (cby +. 3. -. Config.blockh == 1.) {
        [(stairTyp, cbx, cby), (stairTyp, cbx, cby +. 1.)];
      } else {
        [
          (stairTyp, cbx, cby),
          (stairTyp, cbx, cby +. 1.),
          (stairTyp, cbx, cby +. 2.),
        ];
      }
    };
  };

// Generates a list of enemies to be placed on the ground.
let rec generateEnemies =
        (cbx: float, cby: float, blocks: list(blockCoord)): list(enemyCoord) =>
  if (cbx > Config.blockw -. 32.) {
    [];
  } else if (cby > Config.blockh -. 1. || cbx < 15.) {
    generateEnemies(cbx +. 1., 0., blocks);
  } else if (memPos(cbx, cby, blocks) || cby == 0.) {
    generateEnemies(cbx, cby +. 1., blocks);
  } else {
    let isEnemy = Random.int(10) == 0;
    if (isEnemy && Config.blockh -. 1. == cby) {
      let enemy = [(randomEnemyTyp(), cbx *. 16., cby *. 16.)];
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
  | [(_, x, y), ...t] =>
    if (placeEnemy == 0) {
      [(randomEnemyTyp(), x, y -. 16.)] @ generateBlockEnemies(t);
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
  } else if (memPos(cbx, cby, acc) || cby == 0.) {
    generateBlockLocs(cbx, cby +. 1., acc);
  } else if (Random.int(20) == 0) {
    let newacc = chooseBlockPattern(cbx, cby);
    let undupLst = removeOverlap(newacc, acc);
    let calledAcc = acc @ undupLst;
    generateBlockLocs(cbx, cby +. 1., calledAcc);
  } else {
    generateBlockLocs(cbx, cby +. 1., acc);
  };

type spawn_typ =
  | SPlayer(pl_typ, player_typ)
  | SEnemy(enemyTyp)
  | SItem(item_typ)
  | SBlock(blockTyp);

let makeTypeToremove = (spawnable, dir: Actors.dir_1d) =>
  switch (spawnable) {
  | SPlayer(pt, st) => Sprite.make_player(pt, (st, dir))
  | SEnemy(t) => Sprite.make_enemy((t, dir))
  | SItem(t) => Sprite.make_item(t)
  | SBlock(t) => Sprite.make_block(t)
  };

/*Make is the wrapper function to cycle through sprite animations*/
let maketoRemove0 = (spawnable, dir) => {
  let params = makeTypeToremove(spawnable, dir);
  Sprite.make_from_params(params);
};

let makeTypeToremove =
  fun
  | SPlayer(_) => Object.make_player()
  | SEnemy(t) => Object.make_enemy(t)
  | SItem(t) => Object.make_item(t)
  | SBlock(t) => Object.make_block(t);

// create a new sprite and object from a spawnable object
let makeToRemove = (~dir=Left, spawnable, x, y) => {
  let spr = maketoRemove0(spawnable, dir);
  let params = makeTypeToremove(spawnable);
  let id = Object.new_id();
  let obj = {
    Object.params,
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
  (spr, obj);
};

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel = (): Object.collidable => {
  let (spr, obj) =
    makeToRemove(
      SBlock(Panel),
      Config.blockw *. 16. -. 256.,
      Config.blockh *. 16. *. 2. /. 3.,
    );
  Block(Panel, spr, obj);
};

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround =
        (inc: float, acc: list(blockCoord)): list(blockCoord) =>
  if (inc > Config.blockw) {
    acc;
  } else if (inc > 10.) {
    let skip = Random.int(10);
    let newacc = acc @ [(Ground, inc *. 16., Config.blockh *. 16.)];
    if (skip == 7 && Config.blockw -. inc > 32.) {
      generateGround(inc +. 1., acc);
    } else {
      generateGround(inc +. 1., newacc);
    };
  } else {
    let newacc = acc @ [(Ground, inc *. 16., Config.blockh *. 16.)];
    generateGround(inc +. 1., newacc);
  };

// Convert the objCoord list called by generateBlockLocs to a list of objects
// with the coordinates given from the objCoord list.
let rec convertToBlockObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(Object.collidable) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, x, y), ...t] =>
    let (spr, obj) = makeToRemove(SBlock(blockTyp), x, y);
    let ob = Object.Block(blockTyp, spr, obj);
    [ob] @ convertToBlockObj(t, context);
  };

// Convert the objCoord list called by generateEnemies to a list of objects
// with the coordinates given from the objCoord list.
let rec convertToEnemyObj =
        (lst: list(enemyCoord), context: Html.canvasRenderingContext2D)
        : list(Object.collidable) =>
  switch (lst) {
  | [] => []
  | [(enemyTyp, x, y), ...t] =>
    let (spr, obj) = makeToRemove(SEnemy(enemyTyp), x, y);
    Object.set_vel_to_speed(obj);
    let ob = Object.Enemy(enemyTyp, spr, obj);
    [ob] @ convertToEnemyObj(t, context);
  };

// Convert the list of coordinates into a list of Coin objects
let rec convertToCoinObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(Object.collidable) =>
  switch (lst) {
  | [] => []
  | [(_, x, y), ...t] =>
    let (spr, obj) = makeToRemove(SItem(Coin), x, y);
    let ob = Object.Item(Coin, spr, obj);
    [ob] @ convertToCoinObj(t, context);
  };

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper =
    (context: Html.canvasRenderingContext2D): list(Object.collidable) => {
  let blockLocs = generateBlockLocs(0., 0., [])->convertList->trimEdges;
  let objConvertedBlockLocs = convertToBlockObj(blockLocs, context);
  let groundBlocks = generateGround(0., []);
  let objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  let blockLocations = blockLocs @ groundBlocks;
  let allBlocks = objConvertedBlockLocs @ objConvertedGroundBlocks;
  let enemyLocs = generateEnemies(0., 0., blockLocations);
  let objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  let coinsLocs = generateCoins(blockLocs);
  let undupCoinLocs = trimEdges(removeOverlap(coinsLocs, blockLocs));
  let enemyBlockLocs = generateBlockEnemies(blockLocs);
  let undupEnemyBlockLocs =
    enemyBlockLocs->removeOverlap(blockLocs)->removeOverlap(coinsLocs);
  let objEnemyBlocks = convertToEnemyObj(undupEnemyBlockLocs, context);
  let coinObjects = convertToCoinObj(undupCoinLocs, context);
  let objPanel = generatePanel();
  allBlocks @ objConvertedEnemies @ coinObjects @ objEnemyBlocks @ [objPanel];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generateHelper. Spawns
// the list of collidables received from generateHelper to display on canvas.
let generate = (): (Object.collidable, list(Object.collidable)) => {
  let initial = Html.performance.now(.);
  let collideList = generateHelper(Load.getContext());
  let (spr, obj) = makeToRemove(SPlayer(SmallM, Standing), 100., 224.);
  let player = Object.Player(SmallM, spr, obj);
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