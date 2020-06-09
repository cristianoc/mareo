

import * as Load from "./Load.js";
import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as Sprite from "./Sprite.js";
import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

function convertItem(param) {
  return [
          param[0],
          (param[1] << 4),
          (param[2] << 4)
        ];
}

function memPos(x, y, _objs) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    var match = objs._0;
    if (x === match[1] && Caml_obj.caml_equal(y, match[2])) {
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

var pixx = (Config.blockw << 4);

var pixy = (Config.blockh << 4);

function trimEdge(x, y) {
  return !(x < 128 || (pixx - x | 0) < 528 || y === 0 || (pixy - y | 0) < 48);
}

function trimEdges(lst) {
  return Belt_List.keep(lst, (function (param) {
                return trimEdge(param[1], param[2]);
              }));
}

function generateGroundStairs(cbx, cby, typ, blocks) {
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx,
          cby
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 1 | 0,
            cby
          ]),
      _1: /* :: */{
        _0: convertItem([
              typ,
              cbx + 2 | 0,
              cby
            ]),
        _1: /* :: */{
          _0: convertItem([
                typ,
                cbx + 3 | 0,
                cby
              ]),
          _1: blocks.contents
        }
      }
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 1 | 0,
          cby - 1 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 2 | 0,
            cby - 1 | 0
          ]),
      _1: /* :: */{
        _0: convertItem([
              typ,
              cbx + 3 | 0,
              cby - 1 | 0
            ]),
        _1: blocks.contents
      }
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 2 | 0,
          cby - 2 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 3 | 0,
            cby - 2 | 0
          ]),
      _1: blocks.contents
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 3 | 0,
          cby - 3 | 0
        ]),
    _1: blocks.contents
  };
  
}

function generateAirupStairs(cbx, cby, typ, blocks) {
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx,
          cby
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 1 | 0,
            cby
          ]),
      _1: blocks.contents
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 3 | 0,
          cby - 1 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 4 | 0,
            cby - 1 | 0
          ]),
      _1: blocks.contents
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 4 | 0,
          cby - 2 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 5 | 0,
            cby - 2 | 0
          ]),
      _1: /* :: */{
        _0: convertItem([
              typ,
              cbx + 6 | 0,
              cby - 2 | 0
            ]),
        _1: blocks.contents
      }
    }
  };
  
}

function generateAirdownStairs(cbx, cby, typ, blocks) {
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx,
          cby
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 1 | 0,
            cby
          ]),
      _1: /* :: */{
        _0: convertItem([
              typ,
              cbx + 2 | 0,
              cby
            ]),
        _1: blocks.contents
      }
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 2 | 0,
          cby + 1 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 3 | 0,
            cby + 1 | 0
          ]),
      _1: blocks.contents
    }
  };
  blocks.contents = /* :: */{
    _0: convertItem([
          typ,
          cbx + 5 | 0,
          cby + 2 | 0
        ]),
    _1: /* :: */{
      _0: convertItem([
            typ,
            cbx + 6 | 0,
            cby + 2 | 0
          ]),
      _1: blocks.contents
    }
  };
  
}

function generateClouds(_cbx, cby, typ, _num, blocks) {
  while(true) {
    var num = _num;
    var cbx = _cbx;
    if (num === 0) {
      return ;
    }
    blocks.contents = /* :: */{
      _0: convertItem([
            typ,
            cbx,
            cby
          ]),
      _1: blocks.contents
    };
    _num = num - 1 | 0;
    _cbx = cbx + 1 | 0;
    continue ;
  };
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
                    match[2] - 16 | 0
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

function chooseBlockPattern(cbx, cby, blocks) {
  if (cbx > Config.blockw || cby > Config.blockh) {
    return ;
  }
  var stairTyp = randomStairTyp(undefined);
  var lifeBlock = Random.$$int(5) === 0;
  var middleBlock = lifeBlock ? /* QBlock */({
        _0: /* Mushroom */0
      }) : stairTyp;
  var match = Random.$$int(5);
  switch (match) {
    case 0 :
        blocks.contents = /* :: */{
          _0: convertItem([
                stairTyp,
                cbx,
                cby
              ]),
          _1: /* :: */{
            _0: convertItem([
                  middleBlock,
                  cbx + 1 | 0,
                  cby
                ]),
            _1: /* :: */{
              _0: convertItem([
                    stairTyp,
                    cbx + 2 | 0,
                    cby
                  ]),
              _1: blocks.contents
            }
          }
        };
        return ;
    case 1 :
        var numClouds = Random.$$int(5) + 5 | 0;
        if (cby < 5) {
          return generateClouds(cbx, cby, /* Cloud */3, numClouds, blocks);
        } else {
          return ;
        }
    case 2 :
        if ((Config.blockh - cby | 0) === 1) {
          return generateGroundStairs(cbx, cby, stairTyp, blocks);
        } else {
          return ;
        }
    case 3 :
        if (stairTyp === /* Brick */1 && (Config.blockh - cby | 0) > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp, blocks);
        } else if ((Config.blockh - cby | 0) > 2) {
          return generateAirupStairs(cbx, cby, stairTyp, blocks);
        } else {
          blocks.contents = /* :: */{
            _0: convertItem([
                  stairTyp,
                  cbx,
                  cby
                ]),
            _1: blocks.contents
          };
          return ;
        }
    default:
      if (((cby + 3 | 0) - Config.blockh | 0) === 2) {
        blocks.contents = /* :: */{
          _0: convertItem([
                stairTyp,
                cbx,
                cby
              ]),
          _1: blocks.contents
        };
      } else if (((cby + 3 | 0) - Config.blockh | 0) === 1) {
        blocks.contents = /* :: */{
          _0: convertItem([
                stairTyp,
                cbx,
                cby
              ]),
          _1: /* :: */{
            _0: convertItem([
                  stairTyp,
                  cbx,
                  cby + 1 | 0
                ]),
            _1: blocks.contents
          }
        };
      } else {
        blocks.contents = /* :: */{
          _0: convertItem([
                stairTyp,
                cbx,
                cby
              ]),
          _1: /* :: */{
            _0: convertItem([
                  stairTyp,
                  cbx,
                  cby + 1 | 0
                ]),
            _1: /* :: */{
              _0: convertItem([
                    stairTyp,
                    cbx,
                    cby + 2 | 0
                  ]),
              _1: blocks.contents
            }
          }
        };
      }
      return ;
  }
}

function generateEnemies(_cbx, _cby, blocks) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > (Config.blockw - 32 | 0)) {
      return /* [] */0;
    }
    if (cby > (Config.blockh - 1 | 0) || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1 | 0;
      continue ;
    }
    if (memPos(cbx, cby, blocks) || cby === 0) {
      _cby = cby + 1 | 0;
      continue ;
    }
    var isEnemy = Random.$$int(10) === 0;
    if (isEnemy && (Config.blockh - 1 | 0) === cby) {
      var enemy_0 = [
        randomEnemyTyp(undefined),
        (cbx << 4),
        (cby << 4)
      ];
      var enemy = /* :: */{
        _0: enemy_0,
        _1: /* [] */0
      };
      return Pervasives.$at(enemy, generateEnemies(cbx, cby + 1 | 0, blocks));
    }
    _cby = cby + 1 | 0;
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
                    match[2] - 16 | 0
                  ],
                  _1: /* [] */0
                }, generateBlockEnemies(t));
    }
    _blockCoord = t;
    continue ;
  };
}

function generateBlockLocs(_cbx, _cby, blocks) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if ((Config.blockw - cbx | 0) < 33) {
      return ;
    }
    if (cby > (Config.blockh - 1 | 0)) {
      _cby = 0;
      _cbx = cbx + 1 | 0;
      continue ;
    }
    if (memPos(cbx, cby, blocks.contents) || cby === 0) {
      _cby = cby + 1 | 0;
      continue ;
    }
    if (Random.$$int(20) === 0) {
      var newBlocks = {
        contents: /* [] */0
      };
      chooseBlockPattern(cbx, cby, newBlocks);
      var undupLst = removeOverlap(newBlocks.contents, blocks.contents);
      blocks.contents = Pervasives.$at(undupLst, blocks.contents);
      _cby = cby + 1 | 0;
      continue ;
    }
    _cby = cby + 1 | 0;
    continue ;
  };
}

function generatePanel(param) {
  var match = $$Object.make(/* Left */0, Sprite.makeBlock(/* Panel */4), $$Object.makeBlock(/* Panel */4), Config.blockw * 16 - 256, Config.blockh * 16 * 2 / 3);
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
              (inc << 4),
              (Config.blockh << 4)
            ],
            _1: /* [] */0
          });
      if (skip === 7 && (Config.blockw - inc | 0) > 32) {
        _inc = inc + 1 | 0;
        continue ;
      }
      _acc = newacc;
      _inc = inc + 1 | 0;
      continue ;
    }
    var newacc$1 = Pervasives.$at(acc, /* :: */{
          _0: [
            /* Ground */5,
            (inc << 4),
            (Config.blockh << 4)
          ],
          _1: /* [] */0
        });
    _acc = newacc$1;
    _inc = inc + 1 | 0;
    continue ;
  };
}

function convertToBlockObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var blockTyp = match[0];
  var match$1 = $$Object.make(/* Left */0, Sprite.makeBlock(blockTyp), $$Object.makeBlock(blockTyp), match[1], match[2]);
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
  var match$1 = $$Object.make(/* Left */0, Sprite.makeEnemy(enemyTyp, /* Left */0), $$Object.makeEnemy(enemyTyp), match[1], match[2]);
  var obj = match$1[1];
  $$Object.setVelToSpeed(obj);
  var ob_1 = match$1[0];
  var ob = {
    TAG: /* Enemy */1,
    _0: enemyTyp,
    _1: ob_1,
    _2: obj
  };
  return /* :: */{
          _0: ob,
          _1: convertToEnemyObj(lst._1, context)
        };
}

function convertToCoinObj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var match = lst._0;
  var match$1 = $$Object.make(/* Left */0, Sprite.makeItem(/* Coin */1), $$Object.makeItem(/* Coin */1), match[1], match[2]);
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

function generateHelper(param) {
  var context = Load.getContext(undefined);
  var blockLocs = {
    contents: /* [] */0
  };
  generateBlockLocs(0, 0, blockLocs);
  var blockLocs$1 = trimEdges(blockLocs.contents);
  var objConvertedBlockLocs = convertToBlockObj(blockLocs$1, context);
  var groundBlocks = generateGround(0, /* [] */0);
  var objConvertedGroundBlocks = convertToBlockObj(groundBlocks, context);
  var blockLocations = Pervasives.$at(blockLocs$1, groundBlocks);
  var allBlocks = Pervasives.$at(objConvertedBlockLocs, objConvertedGroundBlocks);
  var enemyLocs = generateEnemies(0, 0, blockLocations);
  var objConvertedEnemies = convertToEnemyObj(enemyLocs, context);
  var coinsLocs = generateCoins(blockLocs$1);
  var undupCoinLocs = trimEdges(removeOverlap(coinsLocs, blockLocs$1));
  var enemyBlockLocs = generateBlockEnemies(blockLocs$1);
  var undupEnemyBlockLocs = removeOverlap(removeOverlap(enemyBlockLocs, blockLocs$1), coinsLocs);
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
  var collideList = generateHelper(undefined);
  var match = $$Object.make(/* Left */0, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), $$Object.makePlayer(undefined), 100, 224);
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

export {
  convertItem ,
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
  generatePanel ,
  generateGround ,
  convertToBlockObj ,
  convertToEnemyObj ,
  convertToCoinObj ,
  generateHelper ,
  generate ,
  
}
/* No side effect */
