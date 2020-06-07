

import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "../../../node_modules/bs-platform/lib/es6/random.js";
import * as Caml_obj from "../../../node_modules/bs-platform/lib/es6/caml_obj.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";

function mem_loc(checkloc, _loclist) {
  while(true) {
    var loclist = _loclist;
    if (!loclist) {
      return false;
    }
    if (Caml_obj.caml_equal(checkloc, loclist._0[1])) {
      return true;
    }
    _loclist = loclist._1;
    continue ;
  };
}

function convert_list(lst) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst._0;
  return Pervasives.$at(/* :: */{
              _0: [
                h[0],
                {
                  x: h[1].x * 16,
                  y: h[1].y * 16
                }
              ],
              _1: /* [] */0
            }, convert_list(lst._1));
}

function choose_enemy_typ(typ) {
  switch (typ) {
    case 0 :
        return /* RKoopa */2;
    case 1 :
        return /* GKoopa */1;
    case 2 :
        return /* Goomba */0;
    default:
      return Pervasives.failwith("Shouldn't reach here");
  }
}

function choose_sblock_typ(typ) {
  switch (typ) {
    case 0 :
        return /* Brick */1;
    case 1 :
        return /* UnBBlock */2;
    case 2 :
        return /* Cloud */3;
    case 3 :
        return /* QBlock */{
                _0: /* Mushroom */0
              };
    case 4 :
        return /* Ground */5;
    default:
      return Pervasives.failwith("Shouldn't reach here");
  }
}

function avoid_overlap(_lst, currentLst) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst._1;
    var h = lst._0;
    if (!mem_loc(h[1], currentLst)) {
      return Pervasives.$at(/* :: */{
                  _0: h,
                  _1: /* [] */0
                }, avoid_overlap(t, currentLst));
    }
    _lst = t;
    continue ;
  };
}

function trim_edges(_lst, blockw, blockh) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst._1;
    var h = lst._0;
    var cx = h[1].x;
    var cy = h[1].y;
    var pixx = blockw * 16;
    var pixy = blockh * 16;
    if (!(cx < 128 || pixx - cx < 528 || cy === 0 || pixy - cy < 48)) {
      return Pervasives.$at(/* :: */{
                  _0: h,
                  _1: /* [] */0
                }, trim_edges(t, blockw, blockh));
    }
    _lst = t;
    continue ;
  };
}

function generate_ground_stairs(cbx, cby, typ) {
  var four_0 = [
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var four_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    _1: /* :: */{
      _0: [
        typ,
        {
          x: cbx + 2,
          y: cby
        }
      ],
      _1: /* :: */{
        _0: [
          typ,
          {
            x: cbx + 3,
            y: cby
          }
        ],
        _1: /* [] */0
      }
    }
  };
  var four = /* :: */{
    _0: four_0,
    _1: four_1
  };
  var three_0 = [
    typ,
    {
      x: cbx + 1,
      y: cby - 1
    }
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 2,
        y: cby - 1
      }
    ],
    _1: /* :: */{
      _0: [
        typ,
        {
          x: cbx + 3,
          y: cby - 1
        }
      ],
      _1: /* [] */0
    }
  };
  var three = /* :: */{
    _0: three_0,
    _1: three_1
  };
  var two_0 = [
    typ,
    {
      x: cbx + 2,
      y: cby - 2
    }
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 3,
        y: cby - 2
      }
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var one_0 = [
    typ,
    {
      x: cbx + 3,
      y: cby - 3
    }
  ];
  var one = /* :: */{
    _0: one_0,
    _1: /* [] */0
  };
  return Pervasives.$at(four, Pervasives.$at(three, Pervasives.$at(two, one)));
}

function generate_airup_stairs(cbx, cby, typ) {
  var one_0 = [
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var one_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    _1: /* [] */0
  };
  var one = /* :: */{
    _0: one_0,
    _1: one_1
  };
  var two_0 = [
    typ,
    {
      x: cbx + 3,
      y: cby - 1
    }
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 4,
        y: cby - 1
      }
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var three_0 = [
    typ,
    {
      x: cbx + 4,
      y: cby - 2
    }
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 5,
        y: cby - 2
      }
    ],
    _1: /* :: */{
      _0: [
        typ,
        {
          x: cbx + 6,
          y: cby - 2
        }
      ],
      _1: /* [] */0
    }
  };
  var three = /* :: */{
    _0: three_0,
    _1: three_1
  };
  return Pervasives.$at(one, Pervasives.$at(two, three));
}

function generate_airdown_stairs(cbx, cby, typ) {
  var three_0 = [
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    _1: /* :: */{
      _0: [
        typ,
        {
          x: cbx + 2,
          y: cby
        }
      ],
      _1: /* [] */0
    }
  };
  var three = /* :: */{
    _0: three_0,
    _1: three_1
  };
  var two_0 = [
    typ,
    {
      x: cbx + 2,
      y: cby + 1
    }
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 3,
        y: cby + 1
      }
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var one_0 = [
    typ,
    {
      x: cbx + 5,
      y: cby + 2
    }
  ];
  var one_1 = /* :: */{
    _0: [
      typ,
      {
        x: cbx + 6,
        y: cby + 2
      }
    ],
    _1: /* [] */0
  };
  var one = /* :: */{
    _0: one_0,
    _1: one_1
  };
  return Pervasives.$at(three, Pervasives.$at(two, one));
}

function generate_clouds(cbx, cby, typ, num) {
  if (num === 0) {
    return /* [] */0;
  } else {
    return Pervasives.$at(/* :: */{
                _0: [
                  typ,
                  {
                    x: cbx,
                    y: cby
                  }
                ],
                _1: /* [] */0
              }, generate_clouds(cbx + 1, cby, typ, num - 1 | 0));
  }
}

function generate_coins(_block_coord) {
  while(true) {
    var block_coord = _block_coord;
    var place_coin = Random.$$int(2);
    if (!block_coord) {
      return /* [] */0;
    }
    var t = block_coord._1;
    var h = block_coord._0;
    if (place_coin === 0) {
      var xc = h[1].x;
      var yc = h[1].y;
      return Pervasives.$at(/* :: */{
                  _0: [
                    0,
                    {
                      x: xc,
                      y: yc - 16
                    }
                  ],
                  _1: /* [] */0
                }, generate_coins(t));
    }
    _block_coord = t;
    continue ;
  };
}

function choose_block_pattern(blockw, blockh, cbx, cby, prob) {
  if (cbx > blockw || cby > blockh) {
    return /* [] */0;
  }
  var block_typ = Random.$$int(4);
  var stair_typ = Random.$$int(2);
  var life_block_chance = Random.$$int(5);
  var middle_block = life_block_chance === 0 ? 3 : stair_typ;
  switch (prob) {
    case 0 :
        if (blockw - cbx > 2) {
          return /* :: */{
                  _0: [
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      middle_block,
                      {
                        x: cbx + 1,
                        y: cby
                      }
                    ],
                    _1: /* :: */{
                      _0: [
                        stair_typ,
                        {
                          x: cbx + 2,
                          y: cby
                        }
                      ],
                      _1: /* [] */0
                    }
                  }
                };
        } else if (blockw - cbx > 1) {
          return /* :: */{
                  _0: [
                    block_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      block_typ,
                      {
                        x: cbx + 1,
                        y: cby
                      }
                    ],
                    _1: /* [] */0
                  }
                };
        } else {
          return /* :: */{
                  _0: [
                    block_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* [] */0
                };
        }
    case 1 :
        var num_clouds = Random.$$int(5) + 5 | 0;
        if (cby < 5) {
          return generate_clouds(cbx, cby, 2, num_clouds);
        } else {
          return /* [] */0;
        }
    case 2 :
        if (blockh - cby === 1) {
          return generate_ground_stairs(cbx, cby, stair_typ);
        } else {
          return /* [] */0;
        }
    case 3 :
        if (stair_typ === 0 && blockh - cby > 3) {
          return generate_airdown_stairs(cbx, cby, stair_typ);
        } else if (blockh - cby > 2) {
          return generate_airup_stairs(cbx, cby, stair_typ);
        } else {
          return /* :: */{
                  _0: [
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* [] */0
                };
        }
    case 4 :
        if (cby + 3 - blockh === 2) {
          return /* :: */{
                  _0: [
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* [] */0
                };
        } else if (cby + 3 - blockh === 1) {
          return /* :: */{
                  _0: [
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      stair_typ,
                      {
                        x: cbx,
                        y: cby + 1
                      }
                    ],
                    _1: /* [] */0
                  }
                };
        } else {
          return /* :: */{
                  _0: [
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      stair_typ,
                      {
                        x: cbx,
                        y: cby + 1
                      }
                    ],
                    _1: /* :: */{
                      _0: [
                        stair_typ,
                        {
                          x: cbx,
                          y: cby + 2
                        }
                      ],
                      _1: /* [] */0
                    }
                  }
                };
        }
    case 5 :
        return /* :: */{
                _0: [
                  3,
                  {
                    x: cbx,
                    y: cby
                  }
                ],
                _1: /* [] */0
              };
    default:
      return Pervasives.failwith("Shouldn't reach here");
  }
}

function generate_enemies(blockw, blockh, _cbx, _cby, acc) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > blockw - 32) {
      return /* [] */0;
    }
    if (cby > blockh - 1 || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (mem_loc({
            x: cbx,
            y: cby
          }, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = Random.$$int(30);
    if (prob < 3 && blockh - 1 === cby) {
      var enemy_0 = [
        prob,
        {
          x: cbx * 16,
          y: cby * 16
        }
      ];
      var enemy = /* :: */{
        _0: enemy_0,
        _1: /* [] */0
      };
      return Pervasives.$at(enemy, generate_enemies(blockw, blockh, cbx, cby + 1, acc));
    }
    _cby = cby + 1;
    continue ;
  };
}

function generate_block_enemies(_block_coord) {
  while(true) {
    var block_coord = _block_coord;
    var place_enemy = Random.$$int(20);
    var enemy_typ = Random.$$int(3);
    if (!block_coord) {
      return /* [] */0;
    }
    var t = block_coord._1;
    var h = block_coord._0;
    if (place_enemy === 0) {
      var xc = h[1].x;
      var yc = h[1].y;
      return Pervasives.$at(/* :: */{
                  _0: [
                    enemy_typ,
                    {
                      x: xc,
                      y: yc - 16
                    }
                  ],
                  _1: /* [] */0
                }, generate_block_enemies(t));
    }
    _block_coord = t;
    continue ;
  };
}

function generate_block_locs(blockw, blockh, _cbx, _cby, _acc) {
  while(true) {
    var acc = _acc;
    var cby = _cby;
    var cbx = _cbx;
    if (blockw - cbx < 33) {
      return acc;
    }
    if (cby > blockh - 1) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (mem_loc({
            x: cbx,
            y: cby
          }, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = Random.$$int(100);
    if (prob < 5) {
      var newacc = choose_block_pattern(blockw, blockh, cbx, cby, prob);
      var undup_lst = avoid_overlap(newacc, acc);
      var called_acc = Pervasives.$at(acc, undup_lst);
      _acc = called_acc;
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  };
}

function generate_panel(context, blockw, blockh) {
  return $$Object.spawn({
              TAG: /* SBlock */3,
              _0: /* Panel */4
            }, context, {
              x: blockw * 16 - 256,
              y: blockh * 16 * 2 / 3
            });
}

function generate_ground(blockw, blockh, _inc, _acc) {
  while(true) {
    var acc = _acc;
    var inc = _inc;
    if (inc > blockw) {
      return acc;
    }
    if (inc > 10) {
      var skip = Random.$$int(10);
      var newacc = Pervasives.$at(acc, /* :: */{
            _0: [
              4,
              {
                x: inc * 16,
                y: blockh * 16
              }
            ],
            _1: /* [] */0
          });
      if (skip === 7 && blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      _acc = newacc;
      _inc = inc + 1;
      continue ;
    }
    var newacc$1 = Pervasives.$at(acc, /* :: */{
          _0: [
            4,
            {
              x: inc * 16,
              y: blockh * 16
            }
          ],
          _1: /* [] */0
        });
    _acc = newacc$1;
    _inc = inc + 1;
    continue ;
  };
}

function convert_to_block_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst._0;
  var sblock_typ = choose_sblock_typ(h[0]);
  var ob = $$Object.spawn({
        TAG: /* SBlock */3,
        _0: sblock_typ
      }, context, h[1]);
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convert_to_block_obj(lst._1, context));
}

function convert_to_enemy_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst._0;
  var senemy_typ = choose_enemy_typ(h[0]);
  var ob = $$Object.spawn({
        TAG: /* SEnemy */1,
        _0: senemy_typ
      }, context, h[1]);
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convert_to_enemy_obj(lst._1, context));
}

function convert_to_coin_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var ob = $$Object.spawn({
        TAG: /* SItem */2,
        _0: /* Coin */1
      }, context, lst._0[1]);
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convert_to_coin_obj(lst._1, context));
}

function generate_helper(blockw, blockh, _cx, _cy, context) {
  var block_locs = generate_block_locs(blockw, blockh, 0, 0, /* [] */0);
  var converted_block_locs = trim_edges(convert_list(block_locs), blockw, blockh);
  var obj_converted_block_locs = convert_to_block_obj(converted_block_locs, context);
  var ground_blocks = generate_ground(blockw, blockh, 0, /* [] */0);
  var obj_converted_ground_blocks = convert_to_block_obj(ground_blocks, context);
  var block_locations = Pervasives.$at(block_locs, ground_blocks);
  var all_blocks = Pervasives.$at(obj_converted_block_locs, obj_converted_ground_blocks);
  var enemy_locs = generate_enemies(blockw, blockh, 0, 0, block_locations);
  var obj_converted_enemies = convert_to_enemy_obj(enemy_locs, context);
  var coin_locs = generate_coins(converted_block_locs);
  var undup_coin_locs = trim_edges(avoid_overlap(coin_locs, converted_block_locs), blockw, blockh);
  var converted_block_coin_locs = Pervasives.$at(converted_block_locs, coin_locs);
  var enemy_block_locs = generate_block_enemies(converted_block_locs);
  var undup_enemy_block_locs = avoid_overlap(enemy_block_locs, converted_block_coin_locs);
  var obj_enemy_blocks = convert_to_enemy_obj(undup_enemy_block_locs, context);
  var coin_objects = convert_to_coin_obj(undup_coin_locs, context);
  var obj_panel = generate_panel(context, blockw, blockh);
  return Pervasives.$at(all_blocks, Pervasives.$at(obj_converted_enemies, Pervasives.$at(coin_objects, Pervasives.$at(obj_enemy_blocks, /* :: */{
                          _0: obj_panel,
                          _1: /* [] */0
                        }))));
}

function generate(context) {
  var blockw = Config.levelWidth / 16;
  var blockh = Config.levelHeight / 16 - 1;
  var collide_list = generate_helper(blockw, blockh, 0, 0, context);
  var player = $$Object.spawn({
        TAG: /* SPlayer */0,
        _0: /* SmallM */1,
        _1: /* Standing */0
      }, context, {
        x: 100,
        y: 224
      });
  return [
          player,
          collide_list
        ];
}

function init(param) {
  return Random.self_init(undefined);
}

export {
  mem_loc ,
  convert_list ,
  choose_enemy_typ ,
  choose_sblock_typ ,
  avoid_overlap ,
  trim_edges ,
  generate_ground_stairs ,
  generate_airup_stairs ,
  generate_airdown_stairs ,
  generate_clouds ,
  generate_coins ,
  choose_block_pattern ,
  generate_enemies ,
  generate_block_enemies ,
  generate_block_locs ,
  generate_panel ,
  generate_ground ,
  convert_to_block_obj ,
  convert_to_enemy_obj ,
  convert_to_coin_obj ,
  generate_helper ,
  generate ,
  init ,
  
}
/* No side effect */
