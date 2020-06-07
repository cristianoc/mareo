open Actors;

open Object;

// Note: Canvas is 512 by 256 (w*h) -> 32 by 16 blocks
// Holds obj typ and its coordinates. (int, (x-coord, y-coord))
type obj_coord = (int, Actors.xy);

// Check if the given location checkloc is already part of the list of locations
// in loclist
let rec mem_loc = (checkloc: Actors.xy, loclist: list(obj_coord)): bool =>
  switch (loclist) {
  | [] => false
  | [h, ...t] =>
    if (checkloc == snd(h)) {
      true;
    } else {
      mem_loc(checkloc, t);
    }
  };

// Convert list of locations from blocksize to pixelsize by multiplying (x,y) by 16.
let rec convert_list = (lst: list(obj_coord)): list(obj_coord) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    [(fst(h), {x: snd(h).x *. 16., y: snd(h).y *. 16.})]
    @ convert_list(t)
  };

// Choose what type of enemy should be instantiated given typ number
let choose_enemy_typ = (typ: int): enemy_typ =>
  switch (typ) {
  | 0 => RKoopa
  | 1 => GKoopa
  | 2 => Goomba
  | _ => failwith("Shouldn't reach here")
  };

// Choose what type of block should be instantiated given typ number
let choose_sblock_typ = (typ: int): block_typ =>
  switch (typ) {
  | 0 => Brick
  | 1 => UnBBlock
  | 2 => Cloud
  | 3 => QBlock(Mushroom)
  | 4 => Ground
  | _ => failwith("Shouldn't reach here")
  };

// Optimize lst such that there are no two items in the list that have the same
// coordinates. If there is one, it is removed.
let rec avoid_overlap =
        (lst: list(obj_coord), currentLst: list(obj_coord))
        : list(obj_coord) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    if (mem_loc(snd(h), currentLst)) {
      avoid_overlap(t, currentLst);
    } else {
      [h] @ avoid_overlap(t, currentLst);
    }
  };

// Get rid of objects with coordinates in the ending frame, within 128 pixels of
// the start, at the very top, and two blocks from the ground.
let rec trim_edges =
        (lst: list(obj_coord), blockw: float, blockh: float)
        : list(obj_coord) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let cx = snd(h).x;
    let cy = snd(h).y;
    let pixx = blockw *. 16.;
    let pixy = blockh *. 16.;
    if (cx < 128. || pixx -. cx < 528. || cy == 0. || pixy -. cy < 48.) {
      trim_edges(t, blockw, blockh);
    } else {
      [h] @ trim_edges(t, blockw, blockh);
    };
  };

// Generate a stair formation with block typ being dependent on typ. This type
// of stair formation requires that the first step be on the ground.
let generate_ground_stairs = (cbx, cby, typ) => {
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
let generate_airup_stairs = (cbx, cby, typ) => {
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
let generate_airdown_stairs = (cbx, cby, typ) => {
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
let rec generate_clouds = (cbx, cby, typ, num) =>
  if (num == 0) {
    [];
  } else {
    [(typ, {x: cbx, y: cby})]
    @ generate_clouds(cbx +. 1., cby, typ, num - 1);
  };

// Generate an obj_coord list (typ, coordinates) of coins to be placed.
let rec generate_coins = (block_coord: list(obj_coord)): list(obj_coord) => {
  let place_coin = Random.int(2);
  switch (block_coord) {
  | [] => []
  | [h, ...t] =>
    if (place_coin == 0) {
      let xc = snd(h).x;
      let yc = snd(h).y;
      [(0, {x: xc, y: yc -. 16.})] @ generate_coins(t);
    } else {
      generate_coins(t);
    }
  };
};

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
    : list(obj_coord) =>
  if (cbx > blockw || cby > blockh) {
    [];
  } else {
    let block_typ = Random.int(4);
    let stair_typ = Random.int(2);
    let life_block_chance = Random.int(5);
    let middle_block =
      if (life_block_chance == 0) {
        3;
      } else {
        stair_typ;
      };
    let obj_coord =
      switch (prob) {
      | 0 =>
        if (blockw -. cbx > 2.) {
          [
            (stair_typ, {x: cbx, y: cby}),
            (middle_block, {x: cbx +. 1., y: cby}),
            (stair_typ, {x: cbx +. 2., y: cby}),
          ];
        } else if (blockw -. cbx > 1.) {
          [
            (block_typ, {x: cbx, y: cby}),
            (block_typ, {x: cbx +. 1., y: cby}),
          ];
        } else {
          [(block_typ, {x: cbx, y: cby})];
        }
      | 1 =>
        let num_clouds = Random.int(5) + 5;
        if (cby < 5.) {
          generate_clouds(cbx, cby, 2, num_clouds);
        } else {
          [];
        };
      | 2 =>
        if (blockh -. cby == 1.) {
          generate_ground_stairs(cbx, cby, stair_typ);
        } else {
          [];
        }
      | 3 =>
        if (stair_typ == 0 && blockh -. cby > 3.) {
          generate_airdown_stairs(cbx, cby, stair_typ);
        } else if (blockh -. cby > 2.) {
          generate_airup_stairs(cbx, cby, stair_typ);
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
      | 5 => [(3, {x: cbx, y: cby})]
      | _ => failwith("Shouldn't reach here")
      };
    obj_coord;
  };

// Generates a list of enemies to be placed on the ground.
let rec generate_enemies =
        (
          blockw: float,
          blockh: float,
          cbx: float,
          cby: float,
          acc: list(obj_coord),
        ) =>
  if (cbx > blockw -. 32.) {
    [];
  } else if (cby > blockh -. 1. || cbx < 15.) {
    generate_enemies(blockw, blockh, cbx +. 1., 0., acc);
  } else if (mem_loc({x: cbx, y: cby}, acc) || cby == 0.) {
    generate_enemies(blockw, blockh, cbx, cby +. 1., acc);
  } else {
    let prob = Random.int(30);
    let enem_prob = 3;
    if (prob < enem_prob && blockh -. 1. == cby) {
      let enemy = [(prob, {x: cbx *. 16., y: cby *. 16.})];
      enemy @ generate_enemies(blockw, blockh, cbx, cby +. 1., acc);
    } else {
      generate_enemies(blockw, blockh, cbx, cby +. 1., acc);
    };
  };

// Generates a list of enemies to be placed upon the block objects.
let rec generate_block_enemies =
        (block_coord: list(obj_coord)): list(obj_coord) => {
  let place_enemy = Random.int(20);
  let enemy_typ = Random.int(3);
  switch (block_coord) {
  | [] => []
  | [h, ...t] =>
    if (place_enemy == 0) {
      let xc = snd(h).x;
      let yc = snd(h).y;
      [(enemy_typ, {x: xc, y: yc -. 16.})] @ generate_block_enemies(t);
    } else {
      generate_block_enemies(t);
    }
  };
};

// Generate an obj_coord list (typ, coordinates) of blocks to be placed.
let rec generate_block_locs =
        (
          blockw: float,
          blockh: float,
          cbx: float,
          cby: float,
          acc: list(obj_coord),
        )
        : list(obj_coord) =>
  if (blockw -. cbx < 33.) {
    acc;
  } else if (cby > blockh -. 1.) {
    generate_block_locs(blockw, blockh, cbx +. 1., 0., acc);
  } else if (mem_loc({x: cbx, y: cby}, acc) || cby == 0.) {
    generate_block_locs(blockw, blockh, cbx, cby +. 1., acc);
  } else {
    let prob = Random.int(100);
    let block_prob = 5;
    if (prob < block_prob) {
      let newacc = choose_block_pattern(blockw, blockh, cbx, cby, prob);
      let undup_lst = avoid_overlap(newacc, acc);
      let called_acc = acc @ undup_lst;
      generate_block_locs(blockw, blockh, cbx, cby +. 1., called_acc);
    } else {
      generate_block_locs(blockw, blockh, cbx, cby +. 1., acc);
    };
  };

// Generate the ending item panel at the end of the level. Games ends upon
// collision with player.
let generate_panel =
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
let rec generate_ground =
        (blockw: float, blockh: float, inc: float, acc: list(obj_coord))
        : list(obj_coord) =>
  if (inc > blockw) {
    acc;
  } else if (inc > 10.) {
    let skip = Random.int(10);
    let newacc = acc @ [(4, {x: inc *. 16., y: blockh *. 16.})];
    if (skip == 7 && blockw -. inc > 32.) {
      generate_ground(blockw, blockh, inc +. 1., acc);
    } else {
      generate_ground(blockw, blockh, inc +. 1., newacc);
    };
  } else {
    let newacc = acc @ [(4, {x: inc *. 16., y: blockh *. 16.})];
    generate_ground(blockw, blockh, inc +. 1., newacc);
  };

// Convert the obj_coord list called by generate_block_locs to a list of objects
// with the coordinates given from the obj_coord list.
let rec convert_to_block_obj =
        (lst: list(obj_coord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let sblock_typ = choose_sblock_typ(fst(h));
    let ob = Object.spawn(SBlock(sblock_typ), context, snd(h));
    [ob] @ convert_to_block_obj(t, context);
  };

// Convert the obj_coord list called by generate_enemies to a list of objects
// with the coordinates given from the obj_coord list.
let rec convert_to_enemy_obj =
        (lst: list(obj_coord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let senemy_typ = choose_enemy_typ(fst(h));
    let ob = Object.spawn(SEnemy(senemy_typ), context, snd(h));
    [ob] @ convert_to_enemy_obj(t, context);
  };

// Convert the list of coordinates into a list of Coin objects
let rec convert_to_coin_obj =
        (lst: list(obj_coord), context: Html.canvasRenderingContext2D)
        : list(collidable) =>
  switch (lst) {
  | [] => []
  | [h, ...t] =>
    let sitem_typ = Coin;
    let ob = Object.spawn(SItem(sitem_typ), context, snd(h));
    [ob] @ convert_to_coin_obj(t, context);
  };

// Procedurally generate a list of collidables given canvas width, height and
// context. Arguments block width (blockw) and block height (blockh) are in
// block form, not pixels.
let generate_helper =
    (
      blockw: float,
      blockh: float,
      _cx: float,
      _cy: float,
      context: Html.canvasRenderingContext2D,
    )
    : list(collidable) => {
  let block_locs = generate_block_locs(blockw, blockh, 0., 0., []);
  let converted_block_locs =
    trim_edges(convert_list(block_locs), blockw, blockh);
  let obj_converted_block_locs =
    convert_to_block_obj(converted_block_locs, context);
  let ground_blocks = generate_ground(blockw, blockh, 0., []);
  let obj_converted_ground_blocks =
    convert_to_block_obj(ground_blocks, context);
  let block_locations = block_locs @ ground_blocks;
  let all_blocks = obj_converted_block_locs @ obj_converted_ground_blocks;
  let enemy_locs = generate_enemies(blockw, blockh, 0., 0., block_locations);
  let obj_converted_enemies = convert_to_enemy_obj(enemy_locs, context);
  let coin_locs = generate_coins(converted_block_locs);
  let undup_coin_locs =
    trim_edges(
      avoid_overlap(coin_locs, converted_block_locs),
      blockw,
      blockh,
    );
  let converted_block_coin_locs = converted_block_locs @ coin_locs;
  let enemy_block_locs = generate_block_enemies(converted_block_locs);
  let undup_enemy_block_locs =
    avoid_overlap(enemy_block_locs, converted_block_coin_locs);
  let obj_enemy_blocks =
    convert_to_enemy_obj(undup_enemy_block_locs, context);
  let coin_objects = convert_to_coin_obj(undup_coin_locs, context);
  let obj_panel = generate_panel(context, blockw, blockh);
  all_blocks
  @ obj_converted_enemies
  @ coin_objects
  @ obj_enemy_blocks
  @ [obj_panel];
};

// Main function called to procedurally generate the level map. w and h args
// are in pixel form. Converts to block form to call generate_helper. Spawns
// the list of collidables received from generate_helper to display on canvas.
let generate =
    (context: Html.canvasRenderingContext2D): (collidable, list(collidable)) => {
  let blockw = Config.levelWidth /. 16.;
  let blockh = Config.levelHeight /. 16. -. 1.;
  let collide_list = generate_helper(blockw, blockh, 0., 0., context);
  let player =
    Object.spawn(SPlayer(SmallM, Standing), context, {x: 100., y: 224.});
  (player, collide_list);
};

// Makes sure level map is uniquely generated at each call.
let init = () => Random.self_init();