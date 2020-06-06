

import * as Caml_obj from "../../../node_modules/bs-platform/lib/es6/caml_obj.js";
import * as Caml_int32 from "../../../node_modules/bs-platform/lib/es6/caml_int32.js";

function setup_sprite(bbox_offsetOpt, bbox_sizeOpt, img_src, max_frames, max_ticks, frame_size, src_offset) {
  var bbox_offset = bbox_offsetOpt !== undefined ? bbox_offsetOpt : /* tuple */[
      0,
      0
    ];
  var bbox_size = bbox_sizeOpt !== undefined ? bbox_sizeOpt : /* tuple */[
      0,
      0
    ];
  var bbox_size$1 = Caml_obj.caml_equal(bbox_size, /* tuple */[
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

function make_enemy(param) {
  var dir = param[1];
  switch (param[0]) {
    case /* Goomba */0 :
        return setup_sprite(/* tuple */[
                    1,
                    1
                  ], /* tuple */[
                    14,
                    14
                  ], "enemies.png", 2, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    128
                  ]);
    case /* GKoopa */1 :
        if (dir) {
          return setup_sprite(/* tuple */[
                      1,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      32,
                      69
                    ]);
        } else {
          return setup_sprite(/* tuple */[
                      4,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      0,
                      69
                    ]);
        }
    case /* RKoopa */2 :
        if (dir) {
          return setup_sprite(/* tuple */[
                      1,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      32,
                      5
                    ]);
        } else {
          return setup_sprite(/* tuple */[
                      4,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      0,
                      5
                    ]);
        }
    case /* GKoopaShell */3 :
        return setup_sprite(/* tuple */[
                    2,
                    2
                  ], /* tuple */[
                    12,
                    13
                  ], "enemies.png", 4, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    96
                  ]);
    case /* RKoopaShell */4 :
        return setup_sprite(/* tuple */[
                    2,
                    2
                  ], /* tuple */[
                    12,
                    13
                  ], "enemies.png", 4, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    32
                  ]);
    
  }
}

function make_particle(param) {
  switch (param) {
    case /* GoombaSquish */0 :
        return setup_sprite(undefined, undefined, "enemies.png", 1, 0, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    144
                  ]);
    case /* BrickChunkL */1 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, /* tuple */[
                    8,
                    8
                  ], /* tuple */[
                    0,
                    0
                  ]);
    case /* BrickChunkR */2 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, /* tuple */[
                    8,
                    8
                  ], /* tuple */[
                    8,
                    0
                  ]);
    case /* Score100 */3 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    8
                  ], /* tuple */[
                    0,
                    0
                  ]);
    case /* Score200 */4 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    9
                  ]);
    case /* Score400 */5 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    18
                  ]);
    case /* Score800 */6 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    27
                  ]);
    case /* Score1000 */7 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    0
                  ]);
    case /* Score2000 */8 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    9
                  ]);
    case /* Score4000 */9 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    18
                  ]);
    case /* Score8000 */10 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    27
                  ]);
    
  }
}

function make_type(typ, dir) {
  switch (typ.tag | 0) {
    case /* SPlayer */0 :
        var pt = typ[0];
        var spr_type = /* tuple */[
          typ[1],
          dir
        ];
        if (pt) {
          var typ$1 = spr_type[0];
          if (spr_type[1]) {
            switch (typ$1) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              1,
                              1
                            ], /* tuple */[
                              11,
                              15
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              32
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              15
                            ], "mario-small.png", 2, 10, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              48
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              15
                            ], "mario-small.png", 3, 5, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              32
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              1,
                              5
                            ], /* tuple */[
                              14,
                              10
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              64
                            ]);
              
            }
          } else {
            switch (typ$1) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              3,
                              1
                            ], /* tuple */[
                              11,
                              15
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              0
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              15
                            ], "mario-small.png", 2, 10, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              16
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              15
                            ], "mario-small.png", 3, 5, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              0
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              1,
                              5
                            ], /* tuple */[
                              14,
                              10
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              64
                            ]);
              
            }
          }
        } else {
          var typ$2 = spr_type[0];
          if (spr_type[1]) {
            switch (typ$2) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              1,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              16,
                              69
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              48,
                              70
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 4, 10, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              0,
                              101
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              2,
                              10
                            ], /* tuple */[
                              13,
                              17
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              32,
                              69
                            ]);
              
            }
          } else {
            switch (typ$2) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              16,
                              5
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              48,
                              6
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 4, 10, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              0,
                              37
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              2,
                              10
                            ], /* tuple */[
                              13,
                              17
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              32,
                              5
                            ]);
              
            }
          }
        }
    case /* SEnemy */1 :
        return make_enemy(/* tuple */[
                    typ[0],
                    dir
                  ]);
    case /* SItem */2 :
        var param = typ[0];
        switch (param) {
          case /* Mushroom */0 :
              return setup_sprite(/* tuple */[
                          2,
                          0
                        ], /* tuple */[
                          12,
                          16
                        ], "items.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          0
                        ]);
          case /* FireFlower */1 :
              return setup_sprite(undefined, undefined, "items.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          188
                        ]);
          case /* Star */2 :
              return setup_sprite(undefined, undefined, "items.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          16,
                          48
                        ]);
          case /* Coin */3 :
              return setup_sprite(/* tuple */[
                          3,
                          0
                        ], /* tuple */[
                          12,
                          16
                        ], "items.png", 3, 15, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          80
                        ]);
          
        }
    case /* SBlock */3 :
        var param$1 = typ[0];
        if (typeof param$1 !== "number") {
          return setup_sprite(undefined, undefined, "blocks.png", 4, 15, /* tuple */[
                      16,
                      16
                    ], /* tuple */[
                      0,
                      16
                    ]);
        }
        switch (param$1) {
          case /* QBlockUsed */0 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          32
                        ]);
          case /* Brick */1 :
              return setup_sprite(undefined, undefined, "blocks.png", 5, 10, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          0
                        ]);
          case /* UnBBlock */2 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          48
                        ]);
          case /* Cloud */3 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          64
                        ]);
          case /* Panel */4 :
              return setup_sprite(undefined, undefined, "panel.png", 3, 15, /* tuple */[
                          26,
                          26
                        ], /* tuple */[
                          0,
                          0
                        ]);
          case /* Ground */5 :
              return setup_sprite(undefined, undefined, "ground.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          32
                        ]);
          
        }
    
  }
}

function make_from_params(params, context) {
  var img = document.createElement("img");
  img.src = params.img_src;
  return {
          params: params,
          context: context,
          frame: {
            contents: 0
          },
          ticks: {
            contents: 0
          },
          img: img
        };
}

function make(spawn, dir, context) {
  var params = make_type(spawn, dir);
  return make_from_params(params, context);
}

function make_bgd(context) {
  var params = setup_sprite(undefined, undefined, "bgd-1.png", 1, 0, /* tuple */[
        512,
        256
      ], /* tuple */[
        0,
        0
      ]);
  return make_from_params(params, context);
}

function make_particle$1(ptyp, context) {
  var params = make_particle(ptyp);
  return make_from_params(params, context);
}

function transform_enemy(enemy_typ, spr, dir) {
  var params = make_enemy(/* tuple */[
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
    return ;
  } else {
    spr.ticks.contents = curr_ticks + 1 | 0;
    return ;
  }
}

export {
  setup_sprite ,
  make ,
  make_bgd ,
  make_particle$1 as make_particle,
  transform_enemy ,
  update_animation ,
  
}
/* No side effect */
