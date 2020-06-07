

import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

function convertList(lst) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var pos = match[1];
  return Pervasives.$at(/* :: */{
              _0: [
                match[0],
                {
                  x: pos.x * 16,
                  y: pos.y * 16
                }
              ],
              _1: /* [] */0
            }, convertList(lst._1));
}

function memPos(checkpos, _objs) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    if (Caml_obj.caml_equal(checkpos, objs._0[1])) {
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
    if (!memPos(h[1], currentObjs)) {
      return /* :: */{
              _0: h,
              _1: removeOverlap(t, currentObjs)
            };
    }
    _lst = t;
    continue ;
  };
}

function trimEdges(_lst, blockw, blockh) {
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
                }, trimEdges(t, blockw, blockh));
    }
    _lst = t;
    continue ;
  };
}

function generateGroundStairs(cbx, cby, typ) {
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

function generateAirupStairs(cbx, cby, typ) {
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

function generateAirdownStairs(cbx, cby, typ) {
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

function generateClouds(cbx, cby, typ, num) {
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
    var pos = blocks._0[1];
    if (placeCoin === 0) {
      var xc = pos.x;
      var yc = pos.y;
      return Pervasives.$at(/* :: */{
                  _0: [
                    /* QBlock */{
                      _0: /* Coin */1
                    },
                    {
                      x: xc,
                      y: yc - 16
                    }
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

function chooseBlockPattern(blockw, blockh, cbx, cby, prob) {
  if (cbx > blockw || cby > blockh) {
    return /* [] */0;
  }
  var stairTyp = randomStairTyp(undefined);
  var lifeBlockChance = Random.$$int(5);
  var middleBlock = lifeBlockChance === 0 ? /* QBlock */({
        _0: /* Mushroom */0
      }) : stairTyp;
  switch (prob) {
    case 0 :
        return /* :: */{
                _0: [
                  stairTyp,
                  {
                    x: cbx,
                    y: cby
                  }
                ],
                _1: /* :: */{
                  _0: [
                    middleBlock,
                    {
                      x: cbx + 1,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      stairTyp,
                      {
                        x: cbx + 2,
                        y: cby
                      }
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
        if (blockh - cby === 1) {
          return generateGroundStairs(cbx, cby, stairTyp);
        } else {
          return /* [] */0;
        }
    case 3 :
        if (stairTyp === /* Brick */1 && blockh - cby > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp);
        } else if (blockh - cby > 2) {
          return generateAirupStairs(cbx, cby, stairTyp);
        } else {
          return /* :: */{
                  _0: [
                    stairTyp,
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
                    stairTyp,
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
                    stairTyp,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      stairTyp,
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
                    stairTyp,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  _1: /* :: */{
                    _0: [
                      stairTyp,
                      {
                        x: cbx,
                        y: cby + 1
                      }
                    ],
                    _1: /* :: */{
                      _0: [
                        stairTyp,
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
    default:
      return Pervasives.failwith("Shouldn't reach here");
  }
}

function generateEnemies(blockw, blockh, _cbx, _cby, blocks) {
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
    if (memPos({
            x: cbx,
            y: cby
          }, blocks) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var isEnemy = Random.$$int(10) === 0;
    if (isEnemy && blockh - 1 === cby) {
      var enemy_0 = [
        randomEnemyTyp(undefined),
        {
          x: cbx * 16,
          y: cby * 16
        }
      ];
      var enemy = /* :: */{
        _0: enemy_0,
        _1: /* [] */0
      };
      return Pervasives.$at(enemy, generateEnemies(blockw, blockh, cbx, cby + 1, blocks));
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
    var h = blockCoord._0;
    if (placeEnemy === 0) {
      var xc = h[1].x;
      var yc = h[1].y;
      return Pervasives.$at(/* :: */{
                  _0: [
                    randomEnemyTyp(undefined),
                    {
                      x: xc,
                      y: yc - 16
                    }
                  ],
                  _1: /* [] */0
                }, generateBlockEnemies(t));
    }
    _blockCoord = t;
    continue ;
  };
}

function generateBlockLocs(blockw, blockh, _cbx, _cby, _acc) {
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
    if (memPos({
            x: cbx,
            y: cby
          }, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = Random.$$int(100);
    if (prob < 5) {
      var newacc = chooseBlockPattern(blockw, blockh, cbx, cby, prob);
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

function generatePanel(blockw, blockh) {
  return $$Object.spawn({
              TAG: /* SBlock */3,
              _0: /* Panel */4
            }, {
              x: blockw * 16 - 256,
              y: blockh * 16 * 2 / 3
            });
}

function generateGround(blockw, blockh, _inc, _acc) {
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
              /* Ground */5,
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
            /* Ground */5,
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

function convertToBlockObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var ob = $$Object.spawn({
        TAG: /* SBlock */3,
        _0: match[0]
      }, match[1]);
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
  var ob = $$Object.spawn({
        TAG: /* SEnemy */1,
        _0: match[0]
      }, match[1]);
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convertToEnemyObj(lst._1, context));
}

function convertToCoinObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var ob = $$Object.spawn({
        TAG: /* SItem */2,
        _0: /* Coin */1
      }, lst._0[1]);
  return Pervasives.$at(/* :: */{
              _0: ob,
              _1: /* [] */0
            }, convertToCoinObj(lst._1, context));
}

function generateHelper(blockw, blockh, context) {
  var blockLocs = generateBlockLocs(blockw, blockh, 0, 0, /* [] */0);
  var convertedBlockLocs = trimEdges(convertList(blockLocs), blockw, blockh);
  var objConvertedBlockLocs = convertToBlockObj(convertedBlockLocs, context);
  var groundBlocks = generateGround(blockw, blockh, 0, /* [] */0);
  var objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  var blockLocations = Pervasives.$at(blockLocs, groundBlocks);
  var allBlocks = Pervasives.$at(objConvertedBlockLocs, objConvertedGroundBlocks);
  var enemyLocs = generateEnemies(blockw, blockh, 0, 0, blockLocations);
  var objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  var coinsLocs = generateCoins(convertedBlockLocs);
  var undupCoinLocs = trimEdges(removeOverlap(coinsLocs, convertedBlockLocs), blockw, blockh);
  var enemyBlockLocs = generateBlockEnemies(convertedBlockLocs);
  var undupEnemyBlockLocs = removeOverlap(removeOverlap(enemyBlockLocs, convertedBlockLocs), coinsLocs);
  var objEnemyBlocks = convertToEnemyObj(undupEnemyBlockLocs, context);
  var coinObjects = convertToCoinObj(undupCoinLocs, context);
  var objPanel = generatePanel(blockw, blockh);
  return Pervasives.$at(allBlocks, Pervasives.$at(objConvertedEnemies, Pervasives.$at(coinObjects, Pervasives.$at(objEnemyBlocks, /* :: */{
                          _0: objPanel,
                          _1: /* [] */0
                        }))));
}

function generate(context) {
  var blockw = Config.levelWidth / 16;
  var blockh = Config.levelHeight / 16 - 1;
  var collideList = generateHelper(blockw, blockh, context);
  var player = $$Object.spawn({
        TAG: /* SPlayer */0,
        _0: /* SmallM */1,
        _1: /* Standing */0
      }, {
        x: 100,
        y: 224
      });
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
