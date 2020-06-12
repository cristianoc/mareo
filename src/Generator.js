

import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as Sprite from "./Sprite.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";

function memPos(_objs, x, y) {
  while(true) {
    var objs = _objs;
    if (!objs) {
      return false;
    }
    var match = objs._0.pos;
    var px = match.x;
    var py = match.y;
    if (x === px && y === py) {
      return true;
    }
    _objs = objs._1;
    continue ;
  };
}

var pixx = Config.blockw * 16;

var pixy = Config.blockh * 16;

function trimEdge(x, y) {
  return !(x < 128 || pixx - x < 528 || y === 0 || pixy - y < 48);
}

function convertCoinToObj(param) {
  return $$Object.make(/* Left */0, {
              TAG: /* Item */2,
              _0: /* Coin */1
            }, Sprite.makeItem(/* Coin */1), $$Object.makeItem(/* Coin */1), param[1], param[2]);
}

function addCoins(objects, x, y0) {
  var y = y0 - 16;
  if (Random.bool(undefined) && trimEdge(x, y) && !memPos(objects.contents, x, y)) {
    objects.contents = /* :: */{
      _0: convertCoinToObj([
            /* QBlock */{
              _0: /* Coin */1
            },
            x,
            y
          ]),
      _1: objects.contents
    };
    return ;
  }
  
}

function convertEnemyToObj(param) {
  var enemyTyp = param[0];
  var obj = $$Object.make(/* Left */0, {
        TAG: /* Enemy */1,
        _0: enemyTyp
      }, Sprite.makeEnemy(enemyTyp, /* Left */0), $$Object.makeEnemy(enemyTyp), param[1], param[2]);
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

function addEnemyOnBlock(objects, x, y) {
  var placeEnemy = Random.$$int(Config.enemyDensity);
  if (placeEnemy === 0 && !memPos(objects.contents, x, y - 16)) {
    objects.contents = /* :: */{
      _0: convertEnemyToObj([
            randomEnemyTyp(undefined),
            x,
            y - 16
          ]),
      _1: objects.contents
    };
    return ;
  }
  
}

function addBlock(objects, blockTyp, xBlock, yBlock) {
  var x = xBlock * 16;
  var y = yBlock * 16;
  if (!(!memPos(objects.contents, x, y) && trimEdge(x, y))) {
    return ;
  }
  var obj = $$Object.make(/* Left */0, {
        TAG: /* Block */3,
        _0: blockTyp
      }, Sprite.makeParams(blockTyp), $$Object.makeBlock(blockTyp), x, y);
  objects.contents = /* :: */{
    _0: obj,
    _1: objects.contents
  };
  addCoins(objects, x, y);
  return addEnemyOnBlock(objects, x, y);
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

function generateEnemiesOnGround(objects, _cbx, _cby) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > Config.blockw - 32) {
      return ;
    }
    if (cby > Config.blockh - 1 || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (cby === 0 || Config.blockh - 1 !== cby || Random.$$int(10) !== 0) {
      _cby = cby + 1;
      continue ;
    }
    objects.contents = /* :: */{
      _0: convertEnemyToObj([
            randomEnemyTyp(undefined),
            cbx * 16,
            cby * 16
          ]),
      _1: objects.contents
    };
    _cby = cby + 1;
    continue ;
  };
}

function generateBlocks(objects, _cbx, _cby) {
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
    if (memPos(objects.contents, cbx, cby) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    if (Random.$$int(20) === 0) {
      chooseBlockPattern(cbx, cby, objects);
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  };
}

function generatePanel(param) {
  return $$Object.make(/* Left */0, {
              TAG: /* Block */3,
              _0: /* Panel */4
            }, Sprite.makeParams(/* Panel */4), $$Object.makeBlock(/* Panel */4), Config.blockw * 16 - 256, Config.blockh * 16 * 2 / 3);
}

function convertBlockToObj(param) {
  var blockTyp = param[0];
  return $$Object.make(/* Left */0, {
              TAG: /* Block */3,
              _0: blockTyp
            }, Sprite.makeParams(blockTyp), $$Object.makeBlock(blockTyp), param[1], param[2]);
}

function generateGround(objects, _inc) {
  while(true) {
    var inc = _inc;
    if (inc > Config.blockw) {
      return ;
    }
    if (inc > 10) {
      var skip = Random.$$int(10);
      if (skip === 7 && Config.blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      objects.contents = /* :: */{
        _0: convertBlockToObj([
              /* Ground */5,
              inc * 16,
              Config.blockh * 16
            ]),
        _1: objects.contents
      };
      _inc = inc + 1;
      continue ;
    }
    objects.contents = /* :: */{
      _0: convertBlockToObj([
            /* Ground */5,
            inc * 16,
            Config.blockh * 16
          ]),
      _1: objects.contents
    };
    _inc = inc + 1;
    continue ;
  };
}

function generateHelper(param) {
  var objects = {
    contents: /* [] */0
  };
  generateBlocks(objects, 0, 0);
  generateGround(objects, 0);
  generateEnemiesOnGround(objects, 0, 0);
  var panel = generatePanel(undefined);
  return /* :: */{
          _0: panel,
          _1: objects.contents
        };
}

function generate(param) {
  var initial = performance.now();
  var collideList = generateHelper(undefined);
  var player1 = $$Object.make(/* Left */0, {
        TAG: /* Player */0,
        _0: /* SmallM */1,
        _1: /* One */0
      }, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), $$Object.makePlayer(undefined), 100, 224);
  var player2 = $$Object.make(/* Left */0, {
        TAG: /* Player */0,
        _0: /* SmallM */1,
        _1: /* Two */1
      }, Sprite.makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), $$Object.makePlayer(undefined), 120, 224);
  var elapsed = performance.now() - initial;
  console.log("generated", Belt_List.length(collideList), "objects in " + (elapsed.toString() + " milliseconds"));
  return [
          player1,
          player2,
          collideList
        ];
}

export {
  memPos ,
  pixx ,
  pixy ,
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
