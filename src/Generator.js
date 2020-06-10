

import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as Sprite from "./Sprite.js";
import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

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

function memPos2(x, y, _objs) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    var match = objs._0.obj.pos;
    var px = match.x;
    var py = match.y;
    if (x === px && y === py) {
      return true;
    }
    _objs = objs._1;
    continue ;
  };
}

function removeOverlap2(_lst, currentObjs) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst._1;
    var h = lst._0;
    if (!memPos2(h[1], h[2], currentObjs)) {
      return /* :: */{
              _0: h,
              _1: removeOverlap2(t, currentObjs)
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

function addBlock(blocks, blockTyp, x, y) {
  if (!(!memPos2(x * 16, y * 16, blocks.contents) && trimEdge(x * 16, y * 16))) {
    return ;
  }
  var match = $$Object.make(/* Left */0, Sprite.makeParams(blockTyp), $$Object.makeBlock(blockTyp), x * 16, y * 16);
  blocks.contents = /* :: */{
    _0: {
      objTyp: {
        TAG: /* Block */3,
        _0: blockTyp
      },
      sprite: match[0],
      obj: match[1]
    },
    _1: blocks.contents
  };
  
}

function generateGroundStairs(cbx, cby, typ, blocks) {
  addBlock(blocks, typ, cbx, cby);
  addBlock(blocks, typ, cbx + 1, cby);
  addBlock(blocks, typ, cbx + 2, cby);
  addBlock(blocks, typ, cbx + 3, cby);
  addBlock(blocks, typ, cbx + 1, cby - 1);
  addBlock(blocks, typ, cbx + 2, cby - 1);
  addBlock(blocks, typ, cbx + 3, cby - 1);
  addBlock(blocks, typ, cbx + 2, cby - 2);
  addBlock(blocks, typ, cbx + 3, cby - 2);
  return addBlock(blocks, typ, cbx + 3, cby - 3);
}

function generateAirupStairs(cbx, cby, typ, blocks) {
  addBlock(blocks, typ, cbx, cby);
  addBlock(blocks, typ, cbx + 1, cby);
  addBlock(blocks, typ, cbx + 3, cby - 1);
  addBlock(blocks, typ, cbx + 4, cby - 1);
  addBlock(blocks, typ, cbx + 4, cby - 2);
  addBlock(blocks, typ, cbx + 5, cby - 2);
  return addBlock(blocks, typ, cbx + 6, cby - 2);
}

function generateAirdownStairs(cbx, cby, typ, blocks) {
  addBlock(blocks, typ, cbx, cby);
  addBlock(blocks, typ, cbx + 1, cby);
  addBlock(blocks, typ, cbx + 2, cby);
  addBlock(blocks, typ, cbx + 2, cby + 1);
  addBlock(blocks, typ, cbx + 3, cby + 1);
  addBlock(blocks, typ, cbx + 5, cby + 2);
  return addBlock(blocks, typ, cbx + 6, cby + 2);
}

function generateClouds(_cbx, cby, typ, _num, blocks) {
  while(true) {
    var num = _num;
    var cbx = _cbx;
    if (num === 0) {
      return ;
    }
    addBlock(blocks, typ, cbx, cby);
    _num = num - 1 | 0;
    _cbx = cbx + 1;
    continue ;
  };
}

function convertCoinToObj(param) {
  var match = $$Object.make(/* Left */0, Sprite.makeItem(/* Coin */1), $$Object.makeItem(/* Coin */1), param[1], param[2]);
  return {
          objTyp: {
            TAG: /* Item */2,
            _0: /* Coin */1
          },
          sprite: match[0],
          obj: match[1]
        };
}

function convertCoinsToObj(lst) {
  return Belt_List.map(lst, convertCoinToObj);
}

function generateCoins(_blocks) {
  while(true) {
    var blocks = _blocks;
    if (!blocks) {
      return /* [] */0;
    }
    var match = blocks._0.obj.pos;
    var x = match.x;
    var y = match.y;
    var t = blocks._1;
    var y$1 = y - 16;
    if (Random.bool(undefined) && trimEdge(x, y$1) && !memPos2(x, y$1, blocks)) {
      return /* :: */{
              _0: convertCoinToObj([
                    /* QBlock */{
                      _0: /* Coin */1
                    },
                    x,
                    y$1
                  ]),
              _1: generateCoins(t)
            };
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
        addBlock(blocks, stairTyp, cbx, cby);
        addBlock(blocks, middleBlock, cbx + 1, cby);
        return addBlock(blocks, stairTyp, cbx + 2, cby);
    case 1 :
        var numClouds = Random.$$int(5) + 5 | 0;
        if (cby < 5) {
          return generateClouds(cbx, cby, /* Cloud */3, numClouds, blocks);
        } else {
          return ;
        }
    case 2 :
        if (Config.blockh - cby === 1) {
          return generateGroundStairs(cbx, cby, stairTyp, blocks);
        } else {
          return ;
        }
    case 3 :
        if (stairTyp === /* Brick */1 && Config.blockh - cby > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp, blocks);
        } else if (Config.blockh - cby > 2) {
          return generateAirupStairs(cbx, cby, stairTyp, blocks);
        } else {
          return addBlock(blocks, stairTyp, cbx, cby);
        }
    default:
      if (cby + 3 - Config.blockh === 2) {
        return addBlock(blocks, stairTyp, cbx, cby);
      } else if (cby + 3 - Config.blockh === 1) {
        addBlock(blocks, stairTyp, cbx, cby);
        return addBlock(blocks, stairTyp, cbx, cby + 1);
      } else {
        addBlock(blocks, stairTyp, cbx, cby);
        addBlock(blocks, stairTyp, cbx, cby + 1);
        return addBlock(blocks, stairTyp, cbx, cby + 2);
      }
  }
}

function convertEnemyToObj(param) {
  var enemyTyp = param[0];
  var match = $$Object.make(/* Left */0, Sprite.makeEnemy(enemyTyp, /* Left */0), $$Object.makeEnemy(enemyTyp), param[1], param[2]);
  var obj = match[1];
  $$Object.setVelToSpeed(obj);
  return {
          objTyp: {
            TAG: /* Enemy */1,
            _0: enemyTyp
          },
          sprite: match[0],
          obj: obj
        };
}

function convertToEnemiesToObj(lst) {
  return Belt_List.map(lst, convertEnemyToObj);
}

function generateEnemies(_cbx, _cby, notOverlappingWith) {
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
    if (memPos2(cbx, cby, notOverlappingWith) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var isEnemy = Random.$$int(10) === 0;
    if (isEnemy && Config.blockh - 1 === cby) {
      return /* :: */{
              _0: convertEnemyToObj([
                    randomEnemyTyp(undefined),
                    cbx * 16,
                    cby * 16
                  ]),
              _1: generateEnemies(cbx, cby + 1, notOverlappingWith)
            };
    }
    _cby = cby + 1;
    continue ;
  };
}

function generateBlockEnemies(_blocks, coinBlocks) {
  while(true) {
    var blocks = _blocks;
    var placeEnemy = Random.$$int(20);
    if (!blocks) {
      return /* [] */0;
    }
    var match = blocks._0.obj.pos;
    var x = match.x;
    var y = match.y;
    var t = blocks._1;
    if (placeEnemy === 0 && !memPos2(x, y, blocks) && !memPos2(x, y, coinBlocks)) {
      return /* :: */{
              _0: convertEnemyToObj([
                    randomEnemyTyp(undefined),
                    x,
                    y - 16
                  ]),
              _1: generateBlockEnemies(t, coinBlocks)
            };
    }
    _blocks = t;
    continue ;
  };
}

function generateBlockLocs(_cbx, _cby, blocks) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (Config.blockw - cbx < 33) {
      return ;
    }
    if (cby > Config.blockh - 1) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (memPos2(cbx, cby, blocks.contents) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    if (Random.$$int(20) === 0) {
      chooseBlockPattern(cbx, cby, blocks);
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  };
}

function generatePanel(param) {
  var match = $$Object.make(/* Left */0, Sprite.makeParams(/* Panel */4), $$Object.makeBlock(/* Panel */4), Config.blockw * 16 - 256, Config.blockh * 16 * 2 / 3);
  return {
          objTyp: {
            TAG: /* Block */3,
            _0: /* Panel */4
          },
          sprite: match[0],
          obj: match[1]
        };
}

function convertBlockToObj(param) {
  var blockTyp = param[0];
  var match = $$Object.make(/* Left */0, Sprite.makeParams(blockTyp), $$Object.makeBlock(blockTyp), param[1], param[2]);
  return {
          objTyp: {
            TAG: /* Block */3,
            _0: blockTyp
          },
          sprite: match[0],
          obj: match[1]
        };
}

function convertBlocksToObj(lst) {
  return Belt_List.map(lst, convertBlockToObj);
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
      if (skip === 7 && Config.blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      _acc = /* :: */{
        _0: convertBlockToObj([
              /* Ground */5,
              inc * 16,
              Config.blockh * 16
            ]),
        _1: acc
      };
      _inc = inc + 1;
      continue ;
    }
    _acc = /* :: */{
      _0: convertBlockToObj([
            /* Ground */5,
            inc * 16,
            Config.blockh * 16
          ]),
      _1: acc
    };
    _inc = inc + 1;
    continue ;
  };
}

function generateHelper(param) {
  var blockLocs = {
    contents: /* [] */0
  };
  generateBlockLocs(0, 0, blockLocs);
  var blocks = blockLocs.contents;
  var groundBlocks = generateGround(0, /* [] */0);
  var allBlocks = Pervasives.$at(blocks, groundBlocks);
  var objConvertedEnemies = generateEnemies(0, 0, allBlocks);
  var coinBlocks = generateCoins(blocks);
  var objEnemyBlocks = generateBlockEnemies(groundBlocks, coinBlocks);
  var objPanel = generatePanel(undefined);
  return Pervasives.$at(allBlocks, Pervasives.$at(objConvertedEnemies, Pervasives.$at(coinBlocks, Pervasives.$at(objEnemyBlocks, /* :: */{
                          _0: objPanel,
                          _1: /* [] */0
                        }))));
}

function generate(param) {
  var initial = performance.now();
  var collideList = generateHelper(undefined);
  var match = $$Object.make(/* Left */0, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), $$Object.makePlayer(undefined), 100, 224);
  var player_objTyp = {
    TAG: /* Player */0,
    _0: /* SmallM */1
  };
  var player_sprite = match[0];
  var player_obj = match[1];
  var player = {
    objTyp: player_objTyp,
    sprite: player_sprite,
    obj: player_obj
  };
  var elapsed = performance.now() - initial;
  console.log("generated", Belt_List.length(collideList), "objects in " + (elapsed.toString() + " milliseconds"));
  return [
          player,
          collideList
        ];
}

export {
  memPos ,
  removeOverlap ,
  memPos2 ,
  removeOverlap2 ,
  pixx ,
  pixy ,
  trimEdge ,
  trimEdges ,
  addBlock ,
  generateGroundStairs ,
  generateAirupStairs ,
  generateAirdownStairs ,
  generateClouds ,
  convertCoinToObj ,
  convertCoinsToObj ,
  generateCoins ,
  randomEnemyTyp ,
  randomStairTyp ,
  chooseBlockPattern ,
  convertEnemyToObj ,
  convertToEnemiesToObj ,
  generateEnemies ,
  generateBlockEnemies ,
  generateBlockLocs ,
  generatePanel ,
  convertBlockToObj ,
  convertBlocksToObj ,
  generateGround ,
  generateHelper ,
  generate ,
  
}
/* Object Not a pure module */
