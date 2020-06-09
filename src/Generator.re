open Actors;

open Belt;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type blockCoord = (Actors.blockTyp, int, int);
type enemyCoord = (Actors.enemyTyp, int, int);

// Check if the given position checkpos is already part of the list of locations
// in blocks
let rec memPos = (x: int, y, objs: list(_)): bool =>
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

let pixx = Config.blockw * 16;
let pixy = Config.blockh * 16;

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let trimEdge = (x, y) => {
  !(x < 128 || pixx - x < 528 || y == 0 || pixy - y < 48);
};
let trimEdges = lst => lst->List.keep(((_, x, y)) => trimEdge(x, y));

let addBlock = (blocks, blockTyp, x, y) =>
  if (!memPos(x * 16, y * 16, blocks^) && trimEdge(x * 16, y * 16)) {
    blocks := [(blockTyp, x * 16, y * 16), ...blocks^];
  };

// Generate a stair formation with block typ being dependent on typ. This type
// of stair formation requires that the first step be on the ground.
let generateGroundStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx + 1, cby);
  blocks->addBlock(typ, cbx + 2, cby);
  blocks->addBlock(typ, cbx + 3, cby);
  blocks->addBlock(typ, cbx + 1, cby - 1);
  blocks->addBlock(typ, cbx + 2, cby - 1);
  blocks->addBlock(typ, cbx + 3, cby - 1);
  blocks->addBlock(typ, cbx + 2, cby - 2);
  blocks->addBlock(typ, cbx + 3, cby - 2);
  blocks->addBlock(typ, cbx + 3, cby - 3);
};

// Generate a stair formation going upwards.
let generateAirupStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx + 1, cby);
  blocks->addBlock(typ, cbx + 3, cby - 1);
  blocks->addBlock(typ, cbx + 4, cby - 1);
  blocks->addBlock(typ, cbx + 4, cby - 2);
  blocks->addBlock(typ, cbx + 5, cby - 2);
  blocks->addBlock(typ, cbx + 6, cby - 2);
};

// Generate a stair formation going downwards
let generateAirdownStairs = (cbx, cby, typ, blocks) => {
  blocks->addBlock(typ, cbx, cby);
  blocks->addBlock(typ, cbx + 1, cby);
  blocks->addBlock(typ, cbx + 2, cby);
  blocks->addBlock(typ, cbx + 2, cby + 1);
  blocks->addBlock(typ, cbx + 3, cby + 1);
  blocks->addBlock(typ, cbx + 5, cby + 2);
  blocks->addBlock(typ, cbx + 6, cby + 2);
};

// Generate a cloud block platform with some length num.
let rec generateClouds = (cbx, cby, typ, num, blocks) =>
  if (num == 0) {
    ();
  } else {
    blocks->addBlock(typ, cbx, cby);
    generateClouds(cbx + 1, cby, typ, num - 1, blocks);
  };

// Generate an objCoord list (typ, coordinates) of coins to be placed.
let rec generateCoins = (blocks: list(blockCoord)): list(blockCoord) => {
  let placeCoin = Random.int(2);
  switch (blocks) {
  | [] => []
  | [(_, x, y), ...t] =>
    if (placeCoin == 0) {
      [(QBlock(Coin), x, y - 16)] @ generateCoins(t);
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
let chooseBlockPattern = (cbx: int, cby: int, blocks: ref(list(blockCoord))) =>
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
      blocks->addBlock(middleBlock, cbx + 1, cby);
      blocks->addBlock(stairTyp, cbx + 2, cby);
    | 1 =>
      let numClouds = Random.int(5) + 5;
      if (cby < 5) {
        generateClouds(cbx, cby, Cloud, numClouds, blocks);
      } else {
        ();
      };
    | 2 =>
      if (Config.blockh - cby == 1) {
        generateGroundStairs(cbx, cby, stairTyp, blocks);
      } else {
        ();
      }
    | 3 =>
      if (stairTyp == Brick && Config.blockh - cby > 3) {
        generateAirdownStairs(cbx, cby, stairTyp, blocks);
      } else if (Config.blockh - cby > 2) {
        generateAirupStairs(cbx, cby, stairTyp, blocks);
      } else {
        blocks->addBlock(stairTyp, cbx, cby);
      }
    | _ =>
      if (cby + 3 - Config.blockh == 2) {
        blocks->addBlock(stairTyp, cbx, cby);
      } else if (cby + 3 - Config.blockh == 1) {
        blocks->addBlock(stairTyp, cbx, cby);
        blocks->addBlock(stairTyp, cbx, cby + 1);
      } else {
        blocks->addBlock(stairTyp, cbx, cby);
        blocks->addBlock(stairTyp, cbx, cby + 1);
        blocks->addBlock(stairTyp, cbx, cby + 2);
      }
    };
  };

// Generates a list of enemies to be placed on the ground.
let rec generateEnemies =
        (cbx: int, cby: int, blocks: list(blockCoord)): list(enemyCoord) =>
  if (cbx > Config.blockw - 32) {
    [];
  } else if (cby > Config.blockh - 1 || cbx < 15) {
    generateEnemies(cbx + 1, 0, blocks);
  } else if (memPos(cbx, cby, blocks) || cby == 0) {
    generateEnemies(cbx, cby + 1, blocks);
  } else {
    let isEnemy = Random.int(10) == 0;
    if (isEnemy && Config.blockh - 1 == cby) {
      let enemy = [(randomEnemyTyp(), cbx * 16, cby * 16)];
      enemy @ generateEnemies(cbx, cby + 1, blocks);
    } else {
      generateEnemies(cbx, cby + 1, blocks);
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
      [(randomEnemyTyp(), x, y - 16)] @ generateBlockEnemies(t);
    } else {
      generateBlockEnemies(t);
    }
  };
};

// Generate an objCoord list (typ, coordinates) of blocks to be placed.
let rec generateBlockLocs =
        (cbx: int, cby: int, blocks: ref(list(blockCoord))) =>
  if (Config.blockw - cbx < 33) {
    ();
  } else if (cby > Config.blockh - 1) {
    generateBlockLocs(cbx + 1, 0, blocks);
  } else if (memPos(cbx, cby, blocks^) || cby == 0) {
    generateBlockLocs(cbx, cby + 1, blocks);
  } else if (Random.int(20) == 0) {
    chooseBlockPattern(cbx, cby, blocks);
    generateBlockLocs(cbx, cby + 1, blocks);
  } else {
    generateBlockLocs(cbx, cby + 1, blocks);
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel = (): Object.collidable => {
  let (spr, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makeBlock(Panel),
      Object.makeBlock(Panel),
      float_of_int(Config.blockw) *. 16. -. 256.,
      float_of_int(Config.blockh) *. 16. *. 2. /. 3.,
    );
  Block(Panel, spr, obj);
};

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround = (inc: int, acc: list(blockCoord)): list(blockCoord) =>
  if (inc > Config.blockw) {
    acc;
  } else if (inc > 10) {
    let skip = Random.int(10);
    let newacc = acc @ [(Ground, inc * 16, Config.blockh * 16)];
    if (skip == 7 && Config.blockw - inc > 32) {
      generateGround(inc + 1, acc);
    } else {
      generateGround(inc + 1, newacc);
    };
  } else {
    let newacc = acc @ [(Ground, inc * 16, Config.blockh * 16)];
    generateGround(inc + 1, newacc);
  };

// Convert the objCoord list called by generateBlockLocs to a list of objects
// with the coordinates given from the objCoord list.
let rec convertToBlockObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(Object.collidable) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, x, y), ...t] =>
    let (spr, obj) =
      Object.make(
        ~dir=Left,
        Sprite.makeBlock(blockTyp),
        Object.makeBlock(blockTyp),
        float_of_int(x),
        float_of_int(y),
      );
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
    let (spr, obj) =
      Object.make(
        ~dir=Left,
        Sprite.makeEnemy(enemyTyp, Left),
        Object.makeEnemy(enemyTyp),
        float_of_int(x),
        float_of_int(y),
      );
    Object.setVelToSpeed(obj);
    let ob = Object.Enemy(enemyTyp, spr, obj);
    [ob, ...convertToEnemyObj(t, context)];
  };

// Convert the list of coordinates into a list of Coin objects
let rec convertToCoinObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(Object.collidable) =>
  switch (lst) {
  | [] => []
  | [(_, x, y), ...t] =>
    let (spr, obj) =
      Object.make(
        ~dir=Left,
        Sprite.makeItem(Coin),
        Object.makeItem(Coin),
        float_of_int(x),
        float_of_int(y),
      );
    let ob = Object.Item(Coin, spr, obj);
    [ob] @ convertToCoinObj(t, context);
  };

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper = (): list(Object.collidable) => {
  let context = Load.getContext();
  let blockLocs = ref([]);
  generateBlockLocs(0, 0, blockLocs);
  let blockLocs = blockLocs^;
  let objConvertedBlockLocs = convertToBlockObj(blockLocs, context);
  let groundBlocks = generateGround(0, []);
  let objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  let blockLocations = blockLocs @ groundBlocks;
  let allBlocks = objConvertedBlockLocs @ objConvertedGroundBlocks;
  let enemyLocs = generateEnemies(0, 0, blockLocations);
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
  let collideList = generateHelper();
  let (spr, obj) =
    Object.make(
      ~dir=Left,
      Sprite.makePlayer(SmallM, Standing, Left),
      Object.makePlayer(),
      100.,
      224.,
    );
  let player = Object.Player(SmallM, spr, obj);
  let elapsed = Html.performance.now(.) -. initial;
  Js.log3(
    "generated",
    collideList |> List.length,
    "objects in " ++ Js.Float.toString(elapsed) ++ " milliseconds",
  );
  (player, collideList);
};