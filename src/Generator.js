

import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "rescript/lib/es6/random.js";
import * as Sprite from "./Sprite.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";

function memPos(_objs, x, y) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    var match = objs.hd;
    var px = match.px;
    var py = match.py;
    if (x === px && y === py) {
      return true;
    }
    _objs = objs.tl;
    continue ;
  };
}

function trimEdge(x, y, level) {
  var pixx = Config.blockw(level) * 16;
  var pixy = Config.blockh(level) * 16;
  return !(x < 128 || pixx - x < 528 || y === 0 || pixy - y < 48);
}

function convertCoinToObj(param) {
  return $$Object.make(false, undefined, undefined, {
              TAG: /* Item */2,
              _0: /* Coin */1
            }, Sprite.makeItem(/* Coin */1), param[1], param[2]);
}

function addCoins(objects, x, y0, level) {
  var y = y0 - 16;
  if (Random.bool(undefined) && trimEdge(x, y, level) && !memPos(objects.contents, x, y)) {
    objects.contents = {
      hd: convertCoinToObj([
            /* QBlock */{
              _0: /* Coin */1
            },
            x,
            y
          ]),
      tl: objects.contents
    };
    return ;
  }
  
}

function convertEnemyToObj(param) {
  var enemyTyp = param[0];
  var obj = $$Object.make(undefined, undefined, undefined, {
        TAG: /* Enemy */1,
        _0: enemyTyp
      }, Sprite.makeEnemy(enemyTyp, /* Left */0), param[1], param[2]);
  $$Object.setVelToSpeed(obj);
  return obj;
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

function addEnemyOnBlock(objects, x, y, level) {
  var placeEnemy = Random.$$int(Config.enemyDensity(level));
  if (placeEnemy === 0 && !memPos(objects.contents, x, y - 16)) {
    objects.contents = {
      hd: convertEnemyToObj([
            randomEnemyTyp(undefined),
            x,
            y - 16
          ]),
      tl: objects.contents
    };
    return ;
  }
  
}

function addBlock(objects, blockTyp, xBlock, yBlock, level) {
  var x = xBlock * 16;
  var y = yBlock * 16;
  if (!(!memPos(objects.contents, x, y) && trimEdge(x, y, level))) {
    return ;
  }
  var obj = $$Object.make(undefined, undefined, undefined, {
        TAG: /* Block */3,
        _0: blockTyp
      }, Sprite.makeBlock(blockTyp), x, y);
  objects.contents = {
    hd: obj,
    tl: objects.contents
  };
  addCoins(objects, x, y, level);
  return addEnemyOnBlock(objects, x, y, level);
}

function generateGroundStairs(cbx, cby, typ, blocks, level) {
  addBlock(blocks, typ, cbx, cby, level);
  addBlock(blocks, typ, cbx + 1, cby, level);
  addBlock(blocks, typ, cbx + 2, cby, level);
  addBlock(blocks, typ, cbx + 3, cby, level);
  addBlock(blocks, typ, cbx + 1, cby - 1, level);
  addBlock(blocks, typ, cbx + 2, cby - 1, level);
  addBlock(blocks, typ, cbx + 3, cby - 1, level);
  addBlock(blocks, typ, cbx + 2, cby - 2, level);
  addBlock(blocks, typ, cbx + 3, cby - 2, level);
  return addBlock(blocks, typ, cbx + 3, cby - 3, level);
}

function generateAirupStairs(cbx, cby, typ, blocks, level) {
  addBlock(blocks, typ, cbx, cby, level);
  addBlock(blocks, typ, cbx + 1, cby, level);
  addBlock(blocks, typ, cbx + 3, cby - 1, level);
  addBlock(blocks, typ, cbx + 4, cby - 1, level);
  addBlock(blocks, typ, cbx + 4, cby - 2, level);
  addBlock(blocks, typ, cbx + 5, cby - 2, level);
  return addBlock(blocks, typ, cbx + 6, cby - 2, level);
}

function generateAirdownStairs(cbx, cby, typ, blocks, level) {
  addBlock(blocks, typ, cbx, cby, level);
  addBlock(blocks, typ, cbx + 1, cby, level);
  addBlock(blocks, typ, cbx + 2, cby, level);
  addBlock(blocks, typ, cbx + 2, cby + 1, level);
  addBlock(blocks, typ, cbx + 3, cby + 1, level);
  addBlock(blocks, typ, cbx + 5, cby + 2, level);
  return addBlock(blocks, typ, cbx + 6, cby + 2, level);
}

function generateClouds(_cbx, cby, typ, _num, blocks, level) {
  while(true) {
    var num = _num;
    var cbx = _cbx;
    if (num === 0) {
      return ;
    }
    addBlock(blocks, typ, cbx, cby, level);
    _num = num - 1 | 0;
    _cbx = cbx + 1;
    continue ;
  };
}

function randomStairTyp(param) {
  if (Random.bool(undefined)) {
    return /* UnBBlock */2;
  } else {
    return /* Brick */1;
  }
}

function chooseBlockPattern(cbx, cby, blocks, level) {
  if (cbx > Config.blockw(level) || cby > Config.blockh(level)) {
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
        addBlock(blocks, stairTyp, cbx, cby, level);
        addBlock(blocks, middleBlock, cbx + 1, cby, level);
        return addBlock(blocks, stairTyp, cbx + 2, cby, level);
    case 1 :
        var numClouds = Random.$$int(5) + 5 | 0;
        if (cby < 5) {
          return generateClouds(cbx, cby, /* Cloud */3, numClouds, blocks, level);
        } else {
          return ;
        }
    case 2 :
        if (Config.blockh(level) - cby === 1) {
          return generateGroundStairs(cbx, cby, stairTyp, blocks, level);
        } else {
          return ;
        }
    case 3 :
        if (stairTyp === /* Brick */1 && Config.blockh(level) - cby > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp, blocks, level);
        } else if (Config.blockh(level) - cby > 2) {
          return generateAirupStairs(cbx, cby, stairTyp, blocks, level);
        } else {
          return addBlock(blocks, stairTyp, cbx, cby, level);
        }
    default:
      if (cby + 3 - Config.blockh(level) === 2) {
        return addBlock(blocks, stairTyp, cbx, cby, level);
      } else if (cby + 3 - Config.blockh(level) === 1) {
        addBlock(blocks, stairTyp, cbx, cby, level);
        return addBlock(blocks, stairTyp, cbx, cby + 1, level);
      } else {
        addBlock(blocks, stairTyp, cbx, cby, level);
        addBlock(blocks, stairTyp, cbx, cby + 1, level);
        return addBlock(blocks, stairTyp, cbx, cby + 2, level);
      }
  }
}

function generateEnemiesOnGround(objects, _cbx, _cby, level) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > Config.blockw(level) - 32) {
      return ;
    }
    if (cby > Config.blockh(level) - 1 || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (cby === 0 || Config.blockh(level) - 1 !== cby || Random.$$int(10) !== 0) {
      _cby = cby + 1;
      continue ;
    }
    objects.contents = {
      hd: convertEnemyToObj([
            randomEnemyTyp(undefined),
            cbx * 16,
            cby * 16
          ]),
      tl: objects.contents
    };
    _cby = cby + 1;
    continue ;
  };
}

function generateBlocks(objects, _cbx, _cby, level) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (Config.blockw(level) - cbx < 33) {
      return ;
    }
    if (cby > Config.blockh(level) - 1) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (memPos(objects.contents, cbx, cby) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    if (Random.$$int(20) === 0) {
      chooseBlockPattern(cbx, cby, objects, level);
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  };
}

function generatePanel(level) {
  return $$Object.make(undefined, undefined, undefined, {
              TAG: /* Block */3,
              _0: /* Panel */4
            }, Sprite.makeBlock(/* Panel */4), Config.blockw(level) * 16 - 256, Config.blockh(level) * 16 * 2 / 3);
}

function convertBlockToObj(param) {
  var blockTyp = param[0];
  return $$Object.make(undefined, undefined, undefined, {
              TAG: /* Block */3,
              _0: blockTyp
            }, Sprite.makeBlock(blockTyp), param[1], param[2]);
}

function generateGround(objects, _inc, level) {
  while(true) {
    var inc = _inc;
    if (inc > Config.blockw(level)) {
      return ;
    }
    if (inc > 10) {
      var skip = Random.$$int(10);
      if (skip === 7 && Config.blockw(level) - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      objects.contents = {
        hd: convertBlockToObj([
              /* Ground */5,
              inc * 16,
              Config.blockh(level) * 16
            ]),
        tl: objects.contents
      };
      _inc = inc + 1;
      continue ;
    }
    objects.contents = {
      hd: convertBlockToObj([
            /* Ground */5,
            inc * 16,
            Config.blockh(level) * 16
          ]),
      tl: objects.contents
    };
    _inc = inc + 1;
    continue ;
  };
}

function generateHelper(level) {
  var objects = {
    contents: /* [] */0
  };
  generateBlocks(objects, 0, 0, level);
  generateGround(objects, 0, level);
  generateEnemiesOnGround(objects, 0, 0, level);
  var panel = generatePanel(level);
  return {
          hd: panel,
          tl: objects.contents
        };
}

function generate(level) {
  Random.init(Config.randomSeed(level));
  var initial = performance.now();
  var objects = generateHelper(level);
  var player1 = $$Object.make(undefined, undefined, undefined, {
        TAG: /* Player */0,
        _0: /* SmallM */1,
        _1: /* One */0
      }, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0, /* One */0), 100, 224);
  var player2 = $$Object.make(undefined, undefined, undefined, {
        TAG: /* Player */0,
        _0: /* SmallM */1,
        _1: /* Two */1
      }, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0, /* Two */1), 120, 224);
  var elapsed = performance.now() - initial;
  console.log("generated", Belt_List.length(objects), "objects in " + (elapsed.toString() + " milliseconds"));
  return [
          player1,
          player2,
          objects
        ];
}

export {
  memPos ,
  trimEdge ,
  convertCoinToObj ,
  addCoins ,
  convertEnemyToObj ,
  randomEnemyTyp ,
  addEnemyOnBlock ,
  addBlock ,
  generateGroundStairs ,
  generateAirupStairs ,
  generateAirdownStairs ,
  generateClouds ,
  randomStairTyp ,
  chooseBlockPattern ,
  generateEnemiesOnGround ,
  generateBlocks ,
  generatePanel ,
  convertBlockToObj ,
  generateGround ,
  generateHelper ,
  generate ,
  
}
/* Object Not a pure module */
