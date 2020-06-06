

import * as Block from "../../../node_modules/bs-platform/lib/es6/block.js";
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
    if (Caml_obj.caml_equal(checkloc, loclist[0][1])) {
      return true;
    }
    _loclist = loclist[1];
    continue ;
  };
}

function convert_list(lst) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  return Pervasives.$at(/* :: */[
              /* tuple */[
                h[0],
                /* tuple */[
                  h[1][0] * 16,
                  h[1][1] * 16
                ]
              ],
              /* [] */0
            ], convert_list(lst[1]));
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
        return /* QBlock */[/* Mushroom */0];
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
    var t = lst[1];
    var h = lst[0];
    if (!mem_loc(h[1], currentLst)) {
      return Pervasives.$at(/* :: */[
                  h,
                  /* [] */0
                ], avoid_overlap(t, currentLst));
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
    var t = lst[1];
    var h = lst[0];
    var cx = h[1][0];
    var cy = h[1][1];
    var pixx = blockw * 16;
    var pixy = blockh * 16;
    if (!(cx < 128 || pixx - cx < 528 || cy === 0 || pixy - cy < 48)) {
      return Pervasives.$at(/* :: */[
                  h,
                  /* [] */0
                ], trim_edges(t, blockw, blockh));
    }
    _lst = t;
    continue ;
  };
}

function generate_clouds(cbx, cby, typ, num) {
  if (num === 0) {
    return /* [] */0;
  } else {
    return Pervasives.$at(/* :: */[
                /* tuple */[
                  typ,
                  /* tuple */[
                    cbx,
                    cby
                  ]
                ],
                /* [] */0
              ], generate_clouds(cbx + 1, cby, typ, num - 1 | 0));
  }
}

function generate_coins(_block_coord) {
  while(true) {
    var block_coord = _block_coord;
    var place_coin = Random.$$int(2);
    if (!block_coord) {
      return /* [] */0;
    }
    var t = block_coord[1];
    var h = block_coord[0];
    if (place_coin === 0) {
      var xc = h[1][0];
      var yc = h[1][1];
      return Pervasives.$at(/* :: */[
                  /* tuple */[
                    0,
                    /* tuple */[
                      xc,
                      yc - 16
                    ]
                  ],
                  /* [] */0
                ], generate_coins(t));
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
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* :: */[
                    /* tuple */[
                      middle_block,
                      /* tuple */[
                        cbx + 1,
                        cby
                      ]
                    ],
                    /* :: */[
                      /* tuple */[
                        stair_typ,
                        /* tuple */[
                          cbx + 2,
                          cby
                        ]
                      ],
                      /* [] */0
                    ]
                  ]
                ];
        } else if (blockw - cbx > 1) {
          return /* :: */[
                  /* tuple */[
                    block_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* :: */[
                    /* tuple */[
                      block_typ,
                      /* tuple */[
                        cbx + 1,
                        cby
                      ]
                    ],
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  /* tuple */[
                    block_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* [] */0
                ];
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
          var four_000 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx,
              cby
            ]
          ];
          var four_001 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 1,
                cby
              ]
            ],
            /* :: */[
              /* tuple */[
                stair_typ,
                /* tuple */[
                  cbx + 2,
                  cby
                ]
              ],
              /* :: */[
                /* tuple */[
                  stair_typ,
                  /* tuple */[
                    cbx + 3,
                    cby
                  ]
                ],
                /* [] */0
              ]
            ]
          ];
          var four = /* :: */[
            four_000,
            four_001
          ];
          var three_000 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 1,
              cby - 1
            ]
          ];
          var three_001 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 2,
                cby - 1
              ]
            ],
            /* :: */[
              /* tuple */[
                stair_typ,
                /* tuple */[
                  cbx + 3,
                  cby - 1
                ]
              ],
              /* [] */0
            ]
          ];
          var three = /* :: */[
            three_000,
            three_001
          ];
          var two_000 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 2,
              cby - 2
            ]
          ];
          var two_001 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 3,
                cby - 2
              ]
            ],
            /* [] */0
          ];
          var two = /* :: */[
            two_000,
            two_001
          ];
          var one_000 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 3,
              cby - 3
            ]
          ];
          var one = /* :: */[
            one_000,
            /* [] */0
          ];
          return Pervasives.$at(four, Pervasives.$at(three, Pervasives.$at(two, one)));
        } else {
          return /* [] */0;
        }
    case 3 :
        if (stair_typ === 0 && blockh - cby > 3) {
          var three_000$1 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx,
              cby
            ]
          ];
          var three_001$1 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 1,
                cby
              ]
            ],
            /* :: */[
              /* tuple */[
                stair_typ,
                /* tuple */[
                  cbx + 2,
                  cby
                ]
              ],
              /* [] */0
            ]
          ];
          var three$1 = /* :: */[
            three_000$1,
            three_001$1
          ];
          var two_000$1 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 2,
              cby + 1
            ]
          ];
          var two_001$1 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 3,
                cby + 1
              ]
            ],
            /* [] */0
          ];
          var two$1 = /* :: */[
            two_000$1,
            two_001$1
          ];
          var one_000$1 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 5,
              cby + 2
            ]
          ];
          var one_001 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 6,
                cby + 2
              ]
            ],
            /* [] */0
          ];
          var one$1 = /* :: */[
            one_000$1,
            one_001
          ];
          return Pervasives.$at(three$1, Pervasives.$at(two$1, one$1));
        } else if (blockh - cby > 2) {
          var one_000$2 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx,
              cby
            ]
          ];
          var one_001$1 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 1,
                cby
              ]
            ],
            /* [] */0
          ];
          var one$2 = /* :: */[
            one_000$2,
            one_001$1
          ];
          var two_000$2 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 3,
              cby - 1
            ]
          ];
          var two_001$2 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 4,
                cby - 1
              ]
            ],
            /* [] */0
          ];
          var two$2 = /* :: */[
            two_000$2,
            two_001$2
          ];
          var three_000$2 = /* tuple */[
            stair_typ,
            /* tuple */[
              cbx + 4,
              cby - 2
            ]
          ];
          var three_001$2 = /* :: */[
            /* tuple */[
              stair_typ,
              /* tuple */[
                cbx + 5,
                cby - 2
              ]
            ],
            /* :: */[
              /* tuple */[
                stair_typ,
                /* tuple */[
                  cbx + 6,
                  cby - 2
                ]
              ],
              /* [] */0
            ]
          ];
          var three$2 = /* :: */[
            three_000$2,
            three_001$2
          ];
          return Pervasives.$at(one$2, Pervasives.$at(two$2, three$2));
        } else {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* [] */0
                ];
        }
    case 4 :
        if (cby + 3 - blockh === 2) {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* [] */0
                ];
        } else if (cby + 3 - blockh === 1) {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* :: */[
                    /* tuple */[
                      stair_typ,
                      /* tuple */[
                        cbx,
                        cby + 1
                      ]
                    ],
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    /* tuple */[
                      cbx,
                      cby
                    ]
                  ],
                  /* :: */[
                    /* tuple */[
                      stair_typ,
                      /* tuple */[
                        cbx,
                        cby + 1
                      ]
                    ],
                    /* :: */[
                      /* tuple */[
                        stair_typ,
                        /* tuple */[
                          cbx,
                          cby + 2
                        ]
                      ],
                      /* [] */0
                    ]
                  ]
                ];
        }
    case 5 :
        return /* :: */[
                /* tuple */[
                  3,
                  /* tuple */[
                    cbx,
                    cby
                  ]
                ],
                /* [] */0
              ];
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
    if (mem_loc(/* tuple */[
            cbx,
            cby
          ], acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = Random.$$int(30);
    if (prob < 3 && blockh - 1 === cby) {
      var enemy_000 = /* tuple */[
        prob,
        /* tuple */[
          cbx * 16,
          cby * 16
        ]
      ];
      var enemy = /* :: */[
        enemy_000,
        /* [] */0
      ];
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
    var t = block_coord[1];
    var h = block_coord[0];
    if (place_enemy === 0) {
      var xc = h[1][0];
      var yc = h[1][1];
      return Pervasives.$at(/* :: */[
                  /* tuple */[
                    enemy_typ,
                    /* tuple */[
                      xc,
                      yc - 16
                    ]
                  ],
                  /* [] */0
                ], generate_block_enemies(t));
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
    if (mem_loc(/* tuple */[
            cbx,
            cby
          ], acc) || cby === 0) {
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
  return $$Object.spawn(/* SBlock */Block.__(3, [/* Panel */4]), context, /* tuple */[
              blockw * 16 - 256,
              blockh * 16 * 2 / 3
            ]);
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
      var newacc = Pervasives.$at(acc, /* :: */[
            /* tuple */[
              4,
              /* tuple */[
                inc * 16,
                blockh * 16
              ]
            ],
            /* [] */0
          ]);
      if (skip === 7 && blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      _acc = newacc;
      _inc = inc + 1;
      continue ;
    }
    var newacc$1 = Pervasives.$at(acc, /* :: */[
          /* tuple */[
            4,
            /* tuple */[
              inc * 16,
              blockh * 16
            ]
          ],
          /* [] */0
        ]);
    _acc = newacc$1;
    _inc = inc + 1;
    continue ;
  };
}

function convert_to_block_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  var sblock_typ = choose_sblock_typ(h[0]);
  var ob = $$Object.spawn(/* SBlock */Block.__(3, [sblock_typ]), context, h[1]);
  return Pervasives.$at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_block_obj(lst[1], context));
}

function convert_to_enemy_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  var senemy_typ = choose_enemy_typ(h[0]);
  var ob = $$Object.spawn(/* SEnemy */Block.__(1, [senemy_typ]), context, h[1]);
  return Pervasives.$at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_enemy_obj(lst[1], context));
}

function convert_to_coin_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var ob = $$Object.spawn(/* SItem */Block.__(2, [/* Coin */1]), context, lst[0][1]);
  return Pervasives.$at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_coin_obj(lst[1], context));
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
  return Pervasives.$at(all_blocks, Pervasives.$at(obj_converted_enemies, Pervasives.$at(coin_objects, Pervasives.$at(obj_enemy_blocks, /* :: */[
                          obj_panel,
                          /* [] */0
                        ]))));
}

function generate(w, h, context) {
  var blockw = w / 16;
  var blockh = h / 16 - 1;
  var collide_list = generate_helper(blockw, blockh, 0, 0, context);
  var player = $$Object.spawn(/* SPlayer */Block.__(0, [
          /* SmallM */1,
          /* Standing */0
        ]), context, /* tuple */[
        100,
        224
      ]);
  return /* tuple */[
          player,
          collide_list
        ];
}

function init(param) {
  return Random.self_init(undefined);
}

export {
  init ,
  generate ,
  
}
/* No side effect */
