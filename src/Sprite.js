

import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Caml_int32 from "bs-platform/lib/es6/caml_int32.js";

function setup_sprite(bbox_offsetOpt, bbox_sizeOpt, img_src, max_frames, max_ticks, frame_size, src_offset) {
  var bbox_offset = bbox_offsetOpt !== undefined ? bbox_offsetOpt : [
      0,
      0
    ];
  var bbox_size = bbox_sizeOpt !== undefined ? bbox_sizeOpt : [
      0,
      0
    ];
  var bbox_size$1 = Caml_obj.caml_equal(bbox_size, [
        0,
        0
      ]) ? frame_size : bbox_size;
  var img_src$1 = "./sprites/" + img_src;
  return {
          max_frames: max_frames,
          max_ticks: max_ticks,
          img_src: img_src$1,
          frame_size: frame_size,
          src_offset: src_offset,
          bbox_offset: bbox_offset,
          bbox_size: bbox_size$1
        };
}

function make_small_player(param) {
  var typ = param[0];
  if (param[1]) {
    switch (typ) {
      case /* Standing */0 :
          return setup_sprite([
                      1,
                      1
                    ], [
                      11,
                      15
                    ], "mario-small.png", 1, 0, [
                      16,
                      16
                    ], [
                      0,
                      32
                    ]);
      case /* Jumping */1 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      13,
                      15
                    ], "mario-small.png", 2, 10, [
                      16,
                      16
                    ], [
                      16,
                      48
                    ]);
      case /* Running */2 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      12,
                      15
                    ], "mario-small.png", 3, 5, [
                      16,
                      16
                    ], [
                      16,
                      32
                    ]);
      case /* Crouching */3 :
          return setup_sprite([
                      1,
                      5
                    ], [
                      14,
                      10
                    ], "mario-small.png", 1, 0, [
                      16,
                      16
                    ], [
                      0,
                      64
                    ]);
      
    }
  } else {
    switch (typ) {
      case /* Standing */0 :
          return setup_sprite([
                      3,
                      1
                    ], [
                      11,
                      15
                    ], "mario-small.png", 1, 0, [
                      16,
                      16
                    ], [
                      0,
                      0
                    ]);
      case /* Jumping */1 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      13,
                      15
                    ], "mario-small.png", 2, 10, [
                      16,
                      16
                    ], [
                      16,
                      16
                    ]);
      case /* Running */2 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      12,
                      15
                    ], "mario-small.png", 3, 5, [
                      16,
                      16
                    ], [
                      16,
                      0
                    ]);
      case /* Crouching */3 :
          return setup_sprite([
                      1,
                      5
                    ], [
                      14,
                      10
                    ], "mario-small.png", 1, 0, [
                      16,
                      16
                    ], [
                      0,
                      64
                    ]);
      
    }
  }
}

function make_big_player(param) {
  var typ = param[0];
  if (param[1]) {
    switch (typ) {
      case /* Standing */0 :
          return setup_sprite([
                      1,
                      1
                    ], [
                      13,
                      25
                    ], "mario-big.png", 1, 0, [
                      16,
                      26
                    ], [
                      16,
                      69
                    ]);
      case /* Jumping */1 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      12,
                      25
                    ], "mario-big.png", 1, 0, [
                      16,
                      26
                    ], [
                      48,
                      70
                    ]);
      case /* Running */2 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], "mario-big.png", 4, 10, [
                      16,
                      27
                    ], [
                      0,
                      101
                    ]);
      case /* Crouching */3 :
          return setup_sprite([
                      2,
                      10
                    ], [
                      13,
                      17
                    ], "mario-big.png", 1, 0, [
                      16,
                      27
                    ], [
                      32,
                      69
                    ]);
      
    }
  } else {
    switch (typ) {
      case /* Standing */0 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], "mario-big.png", 1, 0, [
                      16,
                      27
                    ], [
                      16,
                      5
                    ]);
      case /* Jumping */1 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      12,
                      25
                    ], "mario-big.png", 1, 0, [
                      16,
                      26
                    ], [
                      48,
                      6
                    ]);
      case /* Running */2 :
          return setup_sprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], "mario-big.png", 4, 10, [
                      16,
                      27
                    ], [
                      0,
                      37
                    ]);
      case /* Crouching */3 :
          return setup_sprite([
                      2,
                      10
                    ], [
                      13,
                      17
                    ], "mario-big.png", 1, 0, [
                      16,
                      27
                    ], [
                      32,
                      5
                    ]);
      
    }
  }
}

function make_enemy(param) {
  var dir = param[1];
  switch (param[0]) {
    case /* Goomba */0 :
        return setup_sprite([
                    1,
                    1
                  ], [
                    14,
                    14
                  ], "enemies.png", 2, 10, [
                    16,
                    16
                  ], [
                    0,
                    128
                  ]);
    case /* GKoopa */1 :
        if (dir) {
          return setup_sprite([
                      1,
                      10
                    ], [
                      11,
                      16
                    ], "enemies.png", 2, 10, [
                      16,
                      27
                    ], [
                      32,
                      69
                    ]);
        } else {
          return setup_sprite([
                      4,
                      10
                    ], [
                      11,
                      16
                    ], "enemies.png", 2, 10, [
                      16,
                      27
                    ], [
                      0,
                      69
                    ]);
        }
    case /* RKoopa */2 :
        if (dir) {
          return setup_sprite([
                      1,
                      10
                    ], [
                      11,
                      16
                    ], "enemies.png", 2, 10, [
                      16,
                      27
                    ], [
                      32,
                      5
                    ]);
        } else {
          return setup_sprite([
                      4,
                      10
                    ], [
                      11,
                      16
                    ], "enemies.png", 2, 10, [
                      16,
                      27
                    ], [
                      0,
                      5
                    ]);
        }
    case /* GKoopaShell */3 :
        return setup_sprite([
                    2,
                    2
                  ], [
                    12,
                    13
                  ], "enemies.png", 4, 10, [
                    16,
                    16
                  ], [
                    0,
                    96
                  ]);
    case /* RKoopaShell */4 :
        return setup_sprite([
                    2,
                    2
                  ], [
                    12,
                    13
                  ], "enemies.png", 4, 10, [
                    16,
                    16
                  ], [
                    0,
                    32
                  ]);
    
  }
}

function make_item(param) {
  if (param) {
    return setup_sprite([
                3,
                0
              ], [
                12,
                16
              ], "items.png", 3, 15, [
                16,
                16
              ], [
                0,
                80
              ]);
  } else {
    return setup_sprite([
                2,
                0
              ], [
                12,
                16
              ], "items.png", 1, 0, [
                16,
                16
              ], [
                0,
                0
              ]);
  }
}

function make_block(param) {
  if (typeof param !== "number") {
    return setup_sprite(undefined, undefined, "blocks.png", 4, 15, [
                16,
                16
              ], [
                0,
                16
              ]);
  }
  switch (param) {
    case /* QBlockUsed */0 :
        return setup_sprite(undefined, undefined, "blocks.png", 1, 0, [
                    16,
                    16
                  ], [
                    0,
                    32
                  ]);
    case /* Brick */1 :
        return setup_sprite(undefined, undefined, "blocks.png", 5, 10, [
                    16,
                    16
                  ], [
                    0,
                    0
                  ]);
    case /* UnBBlock */2 :
        return setup_sprite(undefined, undefined, "blocks.png", 1, 0, [
                    16,
                    16
                  ], [
                    0,
                    48
                  ]);
    case /* Cloud */3 :
        return setup_sprite(undefined, undefined, "blocks.png", 1, 0, [
                    16,
                    16
                  ], [
                    0,
                    64
                  ]);
    case /* Panel */4 :
        return setup_sprite(undefined, undefined, "panel.png", 3, 15, [
                    26,
                    26
                  ], [
                    0,
                    0
                  ]);
    case /* Ground */5 :
        return setup_sprite(undefined, undefined, "ground.png", 1, 0, [
                    16,
                    16
                  ], [
                    0,
                    32
                  ]);
    
  }
}

function make_particle(param) {
  switch (param) {
    case /* GoombaSquish */0 :
        return setup_sprite(undefined, undefined, "enemies.png", 1, 0, [
                    16,
                    16
                  ], [
                    0,
                    144
                  ]);
    case /* BrickChunkL */1 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, [
                    8,
                    8
                  ], [
                    0,
                    0
                  ]);
    case /* BrickChunkR */2 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, [
                    8,
                    8
                  ], [
                    8,
                    0
                  ]);
    case /* Score100 */3 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    12,
                    8
                  ], [
                    0,
                    0
                  ]);
    case /* Score200 */4 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    12,
                    9
                  ], [
                    0,
                    9
                  ]);
    case /* Score400 */5 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    12,
                    9
                  ], [
                    0,
                    18
                  ]);
    case /* Score800 */6 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    12,
                    9
                  ], [
                    0,
                    27
                  ]);
    case /* Score1000 */7 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    14,
                    9
                  ], [
                    13,
                    0
                  ]);
    case /* Score2000 */8 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    14,
                    9
                  ], [
                    13,
                    9
                  ]);
    case /* Score4000 */9 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    14,
                    9
                  ], [
                    13,
                    18
                  ]);
    case /* Score8000 */10 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, [
                    14,
                    9
                  ], [
                    13,
                    27
                  ]);
    
  }
}

function make_player(pt, spr_type) {
  if (pt) {
    return make_small_player(spr_type);
  } else {
    return make_big_player(spr_type);
  }
}

function make_type(typ, dir) {
  switch (typ.TAG | 0) {
    case /* SPlayer */0 :
        return make_player(typ._0, [
                    typ._1,
                    dir
                  ]);
    case /* SEnemy */1 :
        return make_enemy([
                    typ._0,
                    dir
                  ]);
    case /* SItem */2 :
        return make_item(typ._0);
    case /* SBlock */3 :
        return make_block(typ._0);
    
  }
}

function make_from_params(params) {
  var img = document.createElement("img");
  img.src = params.img_src;
  return {
          params: params,
          frame: {
            contents: 0
          },
          ticks: {
            contents: 0
          },
          img: img
        };
}

function make(spawn, dir) {
  return make_from_params(make_type(spawn, dir));
}

function make_bgd(param) {
  return make_from_params(setup_sprite(undefined, undefined, "bgd-1.png", 1, 0, [
                  512,
                  256
                ], [
                  0,
                  0
                ]));
}

function make_particle$1(ptyp) {
  return make_from_params(make_particle(ptyp));
}

function transform_enemy(enemy_typ, spr, dir) {
  var params = make_enemy([
        enemy_typ,
        dir
      ]);
  var img = document.createElement("img");
  img.src = params.img_src;
  spr.params = params;
  spr.img = img;
  
}

function update_animation(spr) {
  var curr_ticks = spr.ticks.contents;
  if (curr_ticks >= spr.params.max_ticks) {
    spr.ticks.contents = 0;
    spr.frame.contents = Caml_int32.mod_(spr.frame.contents + 1 | 0, spr.params.max_frames);
  } else {
    spr.ticks.contents = curr_ticks + 1 | 0;
  }
  
}

export {
  setup_sprite ,
  make_small_player ,
  make_big_player ,
  make_enemy ,
  make_item ,
  make_block ,
  make_player ,
  make_type ,
  make_from_params ,
  make ,
  make_bgd ,
  make_particle$1 as make_particle,
  transform_enemy ,
  update_animation ,
  
}
/* No side effect */
