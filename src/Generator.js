

import * as Load from "./Load.js";
import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as Sprite from "./Sprite.js";
import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

function convertList(lst) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  return Pervasives.$at(/* :: */{
              _0: [
                match[0],
                match[1] * 16,
                match[2] * 16
              ],
              _1: /* [] */0
            }, convertList(lst._1));
}

function memPos(x, y, _objs) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    var match = objs._0;
    if (Caml_obj.caml_equal(x, match[1]) && Caml_obj.caml_equal(y, match[2])) {
      return true;
    }
    _objs = objs._1;
    continue ;
  };
}

function removeOverlap(_lst, currentObjs) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst._1;
    var h = lst._0;
    if (!memPos(h[1], h[2], currentObjs)) {
      return /* :: */{
              _0: h,
              _1: removeOverlap(t, currentObjs)
            };
    }
    _lst = t;
    continue ;
  };
}

var pixx = Config.blockw * 16;

var pixy = Config.blockh * 16;

function trimEdge(x, y) {
  return !(x < 128 || pixx - x < 528 || y === 0 || pixy - y < 48);
}

function trimEdges(lst) {
  return Belt_List.keep(lst, (function (param) {
                return trimEdge(param[1], param[2]);
              }));
}

function generateGroundStairs(cbx, cby, typ) {
  var four_0 = [
    typ,
    cbx,
    cby
  ];
  var four_1 = /* :: */{
    _0: [
      typ,
      cbx + 1,
      cby
    ],
    _1: /* :: */{
      _0: [
        typ,
        cbx + 2,
        cby
      ],
      _1: /* :: */{
        _0: [
          typ,
          cbx + 3,
          cby
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
    cbx + 1,
    cby - 1
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      cbx + 2,
      cby - 1
    ],
    _1: /* :: */{
      _0: [
        typ,
        cbx + 3,
        cby - 1
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
    cbx + 2,
    cby - 2
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      cbx + 3,
      cby - 2
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var one_0 = [
    typ,
    cbx + 3,
    cby - 3
  ];
  var one = /* :: */{
    _0: one_0,
    _1: /* [] */0
  };
  return Pervasives.$at(four, Pervasives.$at(three, Pervasives.$at(two, one)));
}

function generateAirupStairs(cbx, cby, typ) {
  var one_0 = [
    typ,
    cbx,
    cby
  ];
  var one_1 = /* :: */{
    _0: [
      typ,
      cbx + 1,
      cby
    ],
    _1: /* [] */0
  };
  var one = /* :: */{
    _0: one_0,
    _1: one_1
  };
  var two_0 = [
    typ,
    cbx + 3,
    cby - 1
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      cbx + 4,
      cby - 1
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var three_0 = [
    typ,
    cbx + 4,
    cby - 2
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      cbx + 5,
      cby - 2
    ],
    _1: /* :: */{
      _0: [
        typ,
        cbx + 6,
        cby - 2
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

function generateAirdownStairs(cbx, cby, typ) {
  var three_0 = [
    typ,
    cbx,
    cby
  ];
  var three_1 = /* :: */{
    _0: [
      typ,
      cbx + 1,
      cby
    ],
    _1: /* :: */{
      _0: [
        typ,
        cbx + 2,
        cby
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
    cbx + 2,
    cby + 1
  ];
  var two_1 = /* :: */{
    _0: [
      typ,
      cbx + 3,
      cby + 1
    ],
    _1: /* [] */0
  };
  var two = /* :: */{
    _0: two_0,
    _1: two_1
  };
  var one_0 = [
    typ,
    cbx + 5,
    cby + 2
  ];
  var one_1 = /* :: */{
    _0: [
      typ,
      cbx + 6,
      cby + 2
    ],
    _1: /* [] */0
  };
  var one = /* :: */{
    _0: one_0,
    _1: one_1
  };
  return Pervasives.$at(three, Pervasives.$at(two, one));
}

function generateClouds(cbx, cby, typ, num) {
  if (num === 0) {
    return /* [] */0;
  } else {
    return Pervasives.$at(/* :: */{
                _0: [
                  typ,
                  cbx,
                  cby
                ],
                _1: /* [] */0
              }, generateClouds(cbx + 1, cby, typ, num - 1 | 0));
  }
}

function generateCoins(_blocks) {
  while(true) {
    var blocks = _blocks;
    var placeCoin = Random.$$int(2);
    if (!blocks) {
      return /* [] */0;
    }
    var t = blocks._1;
    var match = blocks._0;
    if (placeCoin === 0) {
      return Pervasives.$at(/* :: */{
                  _0: [
                    /* QBlock */{
                      _0: /* Coin */1
                    },
                    match[1],
                    match[2] - 16
                  ],
                  _1: /* [] */0
                }, generateCoins(t));
    }
    _blocks = t;
    continue ;
  };
}

function randomEnemyTyp(param) {
  var match = Random.$$int(3);
  if (match !== 0) {
    if (match !== 1) {
      return /* Goomba */0;
    } else {
      return /* GKoopa */1;
    }
  } else {
    return /* RKoopa */2;
  }
}

function randomStairTyp(param) {
  if (Random.bool(undefined)) {
    return /* UnBBlock */2;
  } else {
    return /* Brick */1;
  }
}

function chooseBlockPattern(cbx, cby) {
  if (cbx > Config.blockw || cby > Config.blockh) {
    return /* [] */0;
  }
  var stairTyp = randomStairTyp(undefined);
  var lifeBlock = Random.$$int(5) === 0;
  var middleBlock = lifeBlock ? /* QBlock */({
        _0: /* Mushroom */0
      }) : stairTyp;
  var match = Random.$$int(5);
  switch (match) {
    case 0 :
        return /* :: */{
                _0: [
                  stairTyp,
                  cbx,
                  cby
                ],
                _1: /* :: */{
                  _0: [
                    middleBlock,
                    cbx + 1,
                    cby
                  ],
                  _1: /* :: */{
                    _0: [
                      stairTyp,
                      cbx + 2,
                      cby
                    ],
                    _1: /* [] */0
                  }
                }
              };
    case 1 :
        var numClouds = Random.$$int(5) + 5 | 0;
        if (cby < 5) {
          return generateClouds(cbx, cby, /* Cloud */3, numClouds);
        } else {
          return /* [] */0;
        }
    case 2 :
        if (Config.blockh - cby === 1) {
          return generateGroundStairs(cbx, cby, stairTyp);
        } else {
          return /* [] */0;
        }
    case 3 :
        if (stairTyp === /* Brick */1 && Config.blockh - cby > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp);
        } else if (Config.blockh - cby > 2) {
          return generateAirupStairs(cbx, cby, stairTyp);
        } else {
          return /* :: */{
                  _0: [
                    stairTyp,
                    cbx,
                    cby
                  ],
                  _1: /* [] */0
                };
        }
    default:
      if (cby + 3 - Config.blockh === 2) {
        return /* :: */{
                _0: [
                  stairTyp,
                  cbx,
                  cby
                ],
                _1: /* [] */0
              };
      } else if (cby + 3 - Config.blockh === 1) {
        return /* :: */{
                _0: [
                  stairTyp,
                  cbx,
                  cby
                ],
                _1: /* :: */{
                  _0: [
                    stairTyp,
                    cbx,
                    cby + 1
                  ],
                  _1: /* [] */0
                }
              };
      } else {
        return /* :: */{
                _0: [
                  stairTyp,
                  cbx,
                  cby
                ],
                _1: /* :: */{
                  _0: [
                    stairTyp,
                    cbx,
                    cby + 1
                  ],
                  _1: /* :: */{
                    _0: [
                      stairTyp,
                      cbx,
                      cby + 2
                    ],
                    _1: /* [] */0
                  }
                }
              };
      }
  }
}

function generateEnemies(_cbx, _cby, blocks) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > Config.blockw - 32) {
      return /* [] */0;
    }
    if (cby > Config.blockh - 1 || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (memPos(cbx, cby, blocks) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var isEnemy = Random.$$int(10) === 0;
    if (isEnemy && Config.blockh - 1 === cby) {
      var enemy_0 = [
        randomEnemyTyp(undefined),
        cbx * 16,
        cby * 16
      ];
      var enemy = /* :: */{
        _0: enemy_0,
        _1: /* [] */0
      };
      return Pervasives.$at(enemy, generateEnemies(cbx, cby + 1, blocks));
    }
    _cby = cby + 1;
    continue ;
  };
}

function generateBlockEnemies(_blockCoord) {
  while(true) {
    var blockCoord = _blockCoord;
    var placeEnemy = Random.$$int(20);
    if (!blockCoord) {
      return /* [] */0;
    }
    var t = blockCoord._1;
    var match = blockCoord._0;
    if (placeEnemy === 0) {
      return Pervasives.$at(/* :: */{
                  _0: [
                    randomEnemyTyp(undefined),
                    match[1],
                    match[2] - 16
                  ],
                  _1: /* [] */0
                }, generateBlockEnemies(t));
    }
    _blockCoord = t;
    continue ;
  };
}

function generateBlockLocs(_cbx, _cby, _acc) {
  while(true) {
    var acc = _acc;
    var cby = _cby;
    var cbx = _cbx;
    if (Config.blockw - cbx < 33) {
      return acc;
    }
    if (cby > Config.blockh - 1) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (memPos(cbx, cby, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    if (Random.$$int(20) === 0) {
      var newacc = chooseBlockPattern(cbx, cby);
      var undupLst = removeOverlap(newacc, acc);
      var calledAcc = Pervasives.$at(acc, undupLst);
      _acc = calledAcc;
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  };
}

function makeTypeToremove(spawnable, dir) {
  switch (spawnable.TAG | 0) {
    case /* SPlayer */0 :
        return Sprite.make_player(spawnable._0, [
                    spawnable._1,
                    dir
                  ]);
    case /* SEnemy */1 :
        return Sprite.make_enemy([
                    spawnable._0,
                    dir
                  ]);
    case /* SItem */2 :
        return Sprite.make_item(spawnable._0);
    case /* SBlock */3 :
        return Sprite.make_block(spawnable._0);
    
  }
}

function maketoRemove0(spawnable, dir) {
  return Sprite.make_from_params(makeTypeToremove(spawnable, dir));
}

function makeTypeToremove$1(t) {
  switch (t.TAG | 0) {
    case /* SPlayer */0 :
        return $$Object.make_player(undefined);
    case /* SEnemy */1 :
        return $$Object.make_enemy(t._0);
    case /* SItem */2 :
        return $$Object.make_item(t._0);
    case /* SBlock */3 :
        return $$Object.make_block(t._0);
    
  }
}

function generatePanel(param) {
  var match = $$Object.make(/* Left */0, maketoRemove0({
            TAG: /* SBlock */3,
            _0: /* Panel */4
          }, /* Left */0), $$Object.make_block(/* Panel */4), Config.blockw * 16 - 256, Config.blockh * 16 * 2 / 3);
  return {
          TAG: /* Block */3,
          _0: /* Panel */4,
          _1: match[0],
          _2: match[1]
        };
}

function generateGround(_inc, _acc) {
  while(true) {
    var acc = _acc;
    var inc = _inc;
    if (inc > Config.blockw) {
      return acc;
    }
    if (inc > 10) {
      var skip = Random.$$int(10);
      var newacc = Pervasives.$at(acc, /* :: */{
            _0: [
              /* Ground */5,
              inc * 16,
              Config.blockh * 16
            ],
            _1: /* [] */0
          });
      if (skip === 7 && Config.blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      _acc = newacc;
      _inc = inc + 1;
      continue ;
    }
    var newacc$1 = Pervasives.$at(acc, /* :: */{
          _0: [
            /* Ground */5,
            inc * 16,
            Config.blockh * 16
          ],
          _1: /* [] */0
        });
    _acc = newacc$1;
    _inc = inc + 1;
    continue ;
  };
}

function convertToBlockObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var blockTyp = match[0];
  var match$1 = $$Object.make(/* Left */0, maketoRemove0({
            TAG: /* SBlock */3,
            _0: blockTyp
          }, /* Left */0), makeTypeToremove$1({
            TAG: /* SBlock */3,
            _0: blockTyp
          }), match[1], match[2]);
  var ob_1 = match$1[0];
  var ob_2 = match$1[1];
  var ob = {
    TAG: /* Block */3,
    _0: blockTyp,
    _1: ob_1,
    _2: ob_2
  };
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convertToBlockObj(lst._1, context));
}

function convertToEnemyObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var enemyTyp = match[0];
  var match$1 = $$Object.make(/* Left */0, maketoRemove0({
            TAG: /* SEnemy */1,
            _0: enemyTyp
          }, /* Left */0), makeTypeToremove$1({
            TAG: /* SEnemy */1,
            _0: enemyTyp
          }), match[1], match[2]);
  var obj = match$1[1];
  $$Object.set_vel_to_speed(obj);
  var ob_1 = match$1[0];
  var ob = {
    TAG: /* Enemy */1,
    _0: enemyTyp,
    _1: ob_1,
    _2: obj
  };
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convertToEnemyObj(lst._1, context));
}

function convertToCoinObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var match$1 = $$Object.make(/* Left */0, maketoRemove0({
            TAG: /* SItem */2,
            _0: /* Coin */1
          }, /* Left */0), $$Object.make_item(/* Coin */1), match[1], match[2]);
  var ob_1 = match$1[0];
  var ob_2 = match$1[1];
  var ob = {
    TAG: /* Item */2,
    _0: /* Coin */1,
    _1: ob_1,
    _2: ob_2
  };
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convertToCoinObj(lst._1, context));
}

function generateHelper(context) {
  var blockLocs = trimEdges(convertList(generateBlockLocs(0, 0, /* [] */0)));
  var objConvertedBlockLocs = convertToBlockObj(blockLocs, context);
  var groundBlocks = generateGround(0, /* [] */0);
  var objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  var blockLocations = Pervasives.$at(blockLocs, groundBlocks);
  var allBlocks = Pervasives.$at(objConvertedBlockLocs, objConvertedGroundBlocks);
  var enemyLocs = generateEnemies(0, 0, blockLocations);
  var objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  var coinsLocs = generateCoins(blockLocs);
  var undupCoinLocs = trimEdges(removeOverlap(coinsLocs, blockLocs));
  var enemyBlockLocs = generateBlockEnemies(blockLocs);
  var undupEnemyBlockLocs = removeOverlap(removeOverlap(enemyBlockLocs, blockLocs), coinsLocs);
  var objEnemyBlocks = convertToEnemyObj(undupEnemyBlockLocs, context);
  var coinObjects = convertToCoinObj(undupCoinLocs, context);
  var objPanel = generatePanel(undefined);
  return Pervasives.$at(allBlocks, Pervasives.$at(objConvertedEnemies, Pervasives.$at(coinObjects, Pervasives.$at(objEnemyBlocks, /* :: */{
                          _0: objPanel,
                          _1: /* [] */0
                        }))));
}

function generate(param) {
  var initial = performance.now();
  var collideList = generateHelper(Load.getContext(undefined));
  var match = $$Object.make(/* Left */0, maketoRemove0({
            TAG: /* SPlayer */0,
            _0: /* SmallM */1,
            _1: /* Standing */0
          }, /* Left */0), makeTypeToremove$1({
            TAG: /* SPlayer */0,
            _0: /* SmallM */1,
            _1: /* Standing */0
          }), 100, 224);
  var player_1 = match[0];
  var player_2 = match[1];
  var player = {
    TAG: /* Player */0,
    _0: /* SmallM */1,
    _1: player_1,
    _2: player_2
  };
  var elapsed = performance.now() - initial;
  console.log("generated", Belt_List.length(collideList), "objects in " + (elapsed.toString() + " milliseconds"));
  return [
          player,
          collideList
        ];
}

function init(param) {
  return Random.self_init(undefined);
}

export {
  convertList ,
  memPos ,
  removeOverlap ,
  pixx ,
  pixy ,
  trimEdge ,
  trimEdges ,
  generateGroundStairs ,
  generateAirupStairs ,
  generateAirdownStairs ,
  generateClouds ,
  generateCoins ,
  randomEnemyTyp ,
  randomStairTyp ,
  chooseBlockPattern ,
  generateEnemies ,
  generateBlockEnemies ,
  generateBlockLocs ,
  maketoRemove0 ,
  makeTypeToremove$1 as makeTypeToremove,
  generatePanel ,
  generateGround ,
  convertToBlockObj ,
  convertToEnemyObj ,
  convertToCoinObj ,
  generateHelper ,
  generate ,
  init ,
  
}
/* No side effect */
