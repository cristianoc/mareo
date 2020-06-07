open Actors;

open Object;

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

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let rec trimEdges = (lst: list('a), blockw: float, blockh: float): list('a) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let cx = snd(h).x;
    let cy = snd(h).y;
    let pixx = blockw *. 16.;
    let pixy = blockh *. 16.;
    if (cx < 128. || pixx -. cx < 528. || cy == 0. || pixy -. cy < 48.) {
      trimEdges(t, blockw, blockh);
    } else {
      [h] @ trimEdges(t, blockw, blockh);
    };
  };

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

// Generate an obj_coord list (typ, coordinates) of coins to be placed.
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
// 3. Else call helper methods to created block formations and return obj_coord
//    slist.
let choose_block_pattern =
    (blockw: float, blockh: float, cbx: float, cby: float, prob: int)
    : list(blockCoord) =>
  if (cbx > blockw || cby > blockh) {
    [];
  } else {
    let stair_typ = randomStairTyp();
    let life_block_chance = Random.int(5);
    let middle_block =
      if (life_block_chance == 0) {
        QBlock(Mushroom);
      } else {
        stair_typ;
      };
    let obj_coord =
      switch (prob) {
      | 0 => [
          (stair_typ, {x: cbx, y: cby}),
          (middle_block, {x: cbx +. 1., y: cby}),
          (stair_typ, {x: cbx +. 2., y: cby}),
        ]
      | 1 =>
        let num_clouds = Random.int(5) + 5;
        if (cby < 5.) {
          generateClouds(cbx, cby, Cloud, num_clouds);
        } else {
          [];
        };
      | 2 =>
        if (blockh -. cby == 1.) {
          generateGroundStairs(cbx, cby, stair_typ);
        } else {
          [];
        }
      | 3 =>
        if (stair_typ == Brick && blockh -. cby > 3.) {
          generateAirdownStairs(cbx, cby, stair_typ);
        } else if (blockh -. cby > 2.) {
          generateAirupStairs(cbx, cby, stair_typ);
        } else {
          [(stair_typ, {x: cbx, y: cby})];
        }
      | 4 =>
        if (cby +. 3. -. blockh == 2.) {
          [(stair_typ, {x: cbx, y: cby})];
        } else if (cby +. 3. -. blockh == 1.) {
          [
            (stair_typ, {x: cbx, y: cby}),
            (stair_typ, {x: cbx, y: cby +. 1.}),
          ];
        } else {
          [
            (stair_typ, {x: cbx, y: cby}),
            (stair_typ, {x: cbx, y: cby +. 1.}),
            (stair_typ, {x: cbx, y: cby +. 2.}),
          ];
        }
      | _ => failwith("Shouldn't reach here")
      };
    obj_coord;
  };

// Generates a list of enemies to be placed on the ground.
let rec generateEnemies =
        (
          blockw: float,
          blockh: float,
          cbx: float,
          cby: float,
          blocks: list(blockCoord),
        ) =>
  if (cbx > blockw -. 32.) {
    [];
  } else if (cby > blockh -. 1. || cbx < 15.) {
    generateEnemies(blockw, blockh, cbx +. 1., 0., blocks);
  } else if (memPos({x: cbx, y: cby}, blocks) || cby == 0.) {
    generateEnemies(blockw, blockh, cbx, cby +. 1., blocks);
  } else {
    let isEnemy = Random.int(10) == 0;
    if (isEnemy && blockh -. 1. == cby) {
      let enemy = [(randomEnemyTyp(), {x: cbx *. 16., y: cby *. 16.})];
      enemy @ generateEnemies(blockw, blockh, cbx, cby +. 1., blocks);
    } else {
      generateEnemies(blockw, blockh, cbx, cby +. 1., blocks);
    };
  };

// Generates a list of enemies to be placed upon the block objects.
let rec generateBlockEnemies =
        (block_coord: list(blockCoord)): list(enemyCoord) => {
  let place_enemy = Random.int(20);
  let enemy_typ = randomEnemyTyp();
  switch (block_coord) {
  | [] => []
  | [h, ...t] =>
    if (place_enemy == 0) {
      let xc = snd(h).x;
      let yc = snd(h).y;
      [(enemy_typ, {x: xc, y: yc -. 16.})] @ generateBlockEnemies(t);
    } else {
      generateBlockEnemies(t);
    }
  };
};

// Generate an obj_coord list (typ, coordinates) of blocks to be placed.
let rec generateBlockLocs =
        (
          blockw: float,
          blockh: float,
          cbx: float,
          cby: float,
          acc: list(blockCoord),
        )
        : list(blockCoord) =>
  if (blockw -. cbx < 33.) {
    acc;
  } else if (cby > blockh -. 1.) {
    generateBlockLocs(blockw, blockh, cbx +. 1., 0., acc);
  } else if (memPos({x: cbx, y: cby}, acc) || cby == 0.) {
    generateBlockLocs(blockw, blockh, cbx, cby +. 1., acc);
  } else {
    let prob = Random.int(100);
    let block_prob = 5;
    if (prob < block_prob) {
      let newacc = choose_block_pattern(blockw, blockh, cbx, cby, prob);
      let undup_lst = removeOverlap(newacc, acc);
      let called_acc = acc @ undup_lst;
      generateBlockLocs(blockw, blockh, cbx, cby +. 1., called_acc);
    } else {
      generateBlockLocs(blockw, blockh, cbx, cby +. 1., acc);
    };
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generatePanel =
    (context: Html.canvasRenderingContext2D, blockw: float, blockh: float)
    : collidable => {
  let ob =
    Object.spawn(
      SBlock(Panel),
      context,
      {Actors.x: blockw *. 16. -. 256., y: blockh *. 16. *. 2. /. 3.},
    );
  ob;
};

// Generate the list of brick locations needed to display the ground.
// 1/10 chance that a ground block is skipped each call to create holes.
let rec generateGround =
        (blockw: float, blockh: float, inc: float, acc: list(blockCoord))
        : list(blockCoord) =>
  if (inc > blockw) {
    acc;
  } else if (inc > 10.) {
    let skip = Random.int(10);
    let newacc = acc @ [(Ground, {x: inc *. 16., y: blockh *. 16.})];
    if (skip == 7 && blockw -. inc > 32.) {
      generateGround(blockw, blockh, inc +. 1., acc);
    } else {
      generateGround(blockw, blockh, inc +. 1., newacc);
    };
  } else {
    let newacc = acc @ [(Ground, {x: inc *. 16., y: blockh *. 16.})];
    generateGround(blockw, blockh, inc +. 1., newacc);
  };

// Convert the obj_coord list called by generate_block_locs to a list of objects
// with the coordinates given from the obj_coord list.
let rec convertToBlockObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [(blockTyp, pos), ...t] =>
    let ob = Object.spawn(SBlock(blockTyp), context, pos);
    [ob] @ convertToBlockObj(t, context);
  };

// Convert the obj_coord list called by generate_enemies to a list of objects
// with the coordinates given from the obj_coord list.
let rec convertToEnemyObj =
        (lst: list(enemyCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [(enemyTyp, pos), ...t] =>
    let ob = Object.spawn(SEnemy(enemyTyp), context, pos);
    [ob] @ convertToEnemyObj(t, context);
  };

// Convert the list of coordinates into a list of Coin objects
let rec convertToCoinObj =
        (lst: list(blockCoord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let sitem_typ = Coin;
    let ob = Object.spawn(SItem(sitem_typ), context, snd(h));
    [ob] @ convertToCoinObj(t, context);
  };

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generateHelper =
    (
      blockw: float,
      blockh: float,
      _cx: float,
      _cy: float,
      context: Html.canvasRenderingContext2D,
    )
    : list(collidable) => {
  let blockLocs = generateBlockLocs(blockw, blockh, 0., 0., []);
  let convertedBlockLocs = trimEdges(convertList(blockLocs), blockw, blockh);
  let objConvertedBlockLocs = convertToBlockObj(convertedBlockLocs, context);
  let groundBlocks = generateGround(blockw, blockh, 0., []);
  let objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  let blockLocations = blockLocs @ groundBlocks;
  let allBlocks = objConvertedBlockLocs @ objConvertedGroundBlocks;
  let enemyLocs = generateEnemies(blockw, blockh, 0., 0., blockLocations);
  let objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  let coinsLocs = generateCoins(convertedBlockLocs);
  let undupCoinLocs =
    trimEdges(removeOverlap(coinsLocs, convertedBlockLocs), blockw, blockh);
  let enemyBlockLocs = generateBlockEnemies(convertedBlockLocs);
  let undupEnemyBlockLocs =
    enemyBlockLocs
    ->removeOverlap(convertedBlockLocs)
    ->removeOverlap(coinsLocs);
  let objEnemyBlocks = convertToEnemyObj(undupEnemyBlockLocs, context);
  let coinObjects = convertToCoinObj(undupCoinLocs, context);
  let objPanel = generatePanel(context, blockw, blockh);
  allBlocks @ objConvertedEnemies @ coinObjects @ objEnemyBlocks @ [objPanel];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generateHelper. Spawns
// the list of collidables received from generateHelper to display on canvas.
let generate =
    (context: Html.canvasRenderingContext2D): (collidable, list(collidable)) => {
  let blockw = Config.levelWidth /. 16.;
  let blockh = Config.levelHeight /. 16. -. 1.;
  let collideList = generateHelper(blockw, blockh, 0., 0., context);
  let player =
    Object.spawn(SPlayer(SmallM, Standing), context, {x: 100., y: 224.});
  (player, collideList);
};

// Makes sure level map is uniquely generated at each call.
let init = () => Random.self_init();