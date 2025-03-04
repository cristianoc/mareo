

import * as Caml from "rescript/lib/es6/caml.js";
import * as Config from "./Config.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as Pervasives from "rescript/lib/es6/pervasives.js";

var idCounter = {
  contents: Pervasives.min_int
};

function setVelToSpeed(obj) {
  var speed = obj.speed;
  var match = obj.dir;
  if (match) {
    obj.vx = speed;
  } else {
    obj.vx = -speed;
  }
  
}

function makePlayer(o) {
  o.speed = Config.playerSpeed;
  
}

function makeItem(o, t) {
  if (t) {
    o.hasGravity = false;
    return ;
  }
  
}

function makeEnemy(o, t) {
  if (t >= 3) {
    o.speed = 3;
    return ;
  }
  
}

function makeBlock(o, t) {
  o.hasGravity = false;
  
}

function newId(param) {
  idCounter.contents = idCounter.contents + 1 | 0;
  return idCounter.contents;
}

function make(hasGravityOpt, speedOpt, dirOpt, objTyp, spriteParams, px, py) {
  var hasGravity = hasGravityOpt !== undefined ? hasGravityOpt : true;
  var speed = speedOpt !== undefined ? speedOpt : 1.0;
  var dir = dirOpt !== undefined ? dirOpt : /* Left */0;
  var newObj = {
    objTyp: objTyp,
    sprite: Sprite.makeFromParams(spriteParams),
    hasGravity: hasGravity,
    speed: speed,
    id: newId(undefined),
    px: px,
    py: py,
    vx: 0.0,
    vy: 0.0,
    jumping: false,
    grounded: false,
    dir: dir,
    invuln: 0,
    kill: false,
    health: 1,
    crouch: false,
    score: 0
  };
  switch (objTyp.TAG | 0) {
    case /* Player */0 :
        newObj.speed = Config.playerSpeed;
        break;
    case /* Enemy */1 :
        makeEnemy(newObj, objTyp._0);
        break;
    case /* Item */2 :
        makeItem(newObj, objTyp._0);
        break;
    case /* Block */3 :
        newObj.hasGravity = false;
        break;
    
  }
  return newObj;
}

function isPlayer(x) {
  var match = x.objTyp;
  if (match.TAG === /* Player */0) {
    return true;
  } else {
    return false;
  }
}

function isEnemy(x) {
  var match = x.objTyp;
  if (match.TAG === /* Enemy */1) {
    return true;
  } else {
    return false;
  }
}

function equals(col1, col2) {
  return col1.id === col2.id;
}

function jump(player) {
  player.jumping = true;
  player.grounded = false;
  player.vy = Caml.caml_float_max(player.vy - (Config.playerJump + Math.abs(player.vx) * 0.25), Config.playerMaxJump);
  
}

function updatePlayerKeys(player, controls) {
  var lr_acc = player.vx * 0.2;
  switch (controls) {
    case /* CLeft */0 :
        if (!player.crouch) {
          if (player.vx > -player.speed) {
            player.vx = player.vx - (0.4 + Math.abs(lr_acc));
          }
          player.dir = /* Left */0;
          return ;
        } else {
          return ;
        }
    case /* CRight */1 :
        if (!player.crouch) {
          if (player.vx < player.speed) {
            player.vx = player.vx + (0.4 + Math.abs(lr_acc));
          }
          player.dir = /* Right */1;
          return ;
        } else {
          return ;
        }
    case /* CUp */2 :
        if (!player.jumping && player.grounded) {
          return jump(player);
        } else {
          return ;
        }
    case /* CDown */3 :
        if (!player.jumping && player.grounded) {
          player.crouch = true;
          return ;
        } else {
          return ;
        }
    
  }
}

function normalizePos(o, p1, p2) {
  var match = p1.bboxOffset;
  var match$1 = p2.bboxOffset;
  var match$2 = p1.bboxSize;
  var match$3 = p2.bboxSize;
  o.px = o.px - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
  o.py = o.py - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  
}

function updatePlayer(player, playerNum, keys) {
  var prev_jumping = player.jumping;
  var prev_dir = player.dir;
  var prev_vx = Math.abs(player.vx);
  Belt_List.forEach(keys, (function (param) {
          return updatePlayerKeys(player, param);
        }));
  var v = player.vx * Config.friction;
  var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
  player.vx = vel_damped;
  var plSize = player.health <= 1 ? /* SmallM */1 : /* BigM */0;
  var playerTyp = !prev_jumping && player.jumping ? /* Jumping */1 : (
      prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vx) > 0 && !player.jumping ? /* Running */2 : (
          prev_dir !== player.dir && player.jumping && prev_jumping ? /* Jumping */1 : (
              player.vy === 0 && player.crouch ? /* Crouching */3 : (
                  player.vy === 0 && player.vx === 0 ? /* Standing */0 : undefined
                )
            )
        )
    );
  if (playerTyp === undefined) {
    return ;
  }
  var newSprite = Sprite.makeFromParams(Sprite.makePlayer(plSize, playerTyp, player.dir, playerNum));
  normalizePos(player, player.sprite.params, newSprite.params);
  player.objTyp = {
    TAG: /* Player */0,
    _0: plSize,
    _1: playerNum
  };
  player.sprite = newSprite;
  
}

function updateVel(obj) {
  if (obj.grounded) {
    obj.vy = 0;
    return ;
  } else if (obj.hasGravity) {
    obj.vy = Caml.caml_float_min(obj.vy + Config.gravity + Math.abs(obj.vy) * 0.01, Config.maxYVel);
    return ;
  } else {
    return ;
  }
}

function updatePos(obj) {
  obj.px = obj.vx + obj.px;
  if (obj.hasGravity) {
    obj.py = obj.vy + obj.py;
    return ;
  }
  
}

function processObj(obj, level) {
  updateVel(obj);
  updatePos(obj);
  if (obj.py > Config.levelHeight(level)) {
    obj.kill = true;
    return ;
  }
  
}

function collideBlock(dir, obj) {
  if (dir !== 1) {
    if (dir !== 0) {
      obj.vx = 0;
    } else {
      obj.vy = -0.001;
    }
  } else {
    obj.vy = 0;
    obj.grounded = true;
    obj.jumping = false;
  }
  
}

function oppositeDir(dir) {
  if (dir) {
    return /* Left */0;
  } else {
    return /* Right */1;
  }
}

function reverseLeftRight(obj) {
  obj.vx = -obj.vx;
  obj.dir = obj.dir ? /* Left */0 : /* Right */1;
  
}

function evolveEnemy(player_dir, typ, spr, obj) {
  switch (typ) {
    case /* Goomba */0 :
        obj.kill = true;
        return ;
    case /* GKoopa */1 :
        var newObj = make(undefined, 3, obj.dir, {
              TAG: /* Enemy */1,
              _0: /* GKoopaShell */3
            }, Sprite.makeEnemy(/* GKoopaShell */3, obj.dir), obj.px, obj.py);
        normalizePos(newObj, spr.params, newObj.sprite.params);
        return newObj;
    case /* RKoopa */2 :
        return make(undefined, 3, obj.dir, {
                    TAG: /* Enemy */1,
                    _0: /* RKoopaShell */4
                  }, Sprite.makeEnemy(/* RKoopaShell */4, obj.dir), obj.px, obj.py);
    case /* GKoopaShell */3 :
    case /* RKoopaShell */4 :
        break;
    
  }
  obj.dir = player_dir;
  if (obj.vx !== 0) {
    obj.vx = 0;
  } else {
    setVelToSpeed(obj);
  }
  
}

function revDir(o, t, s) {
  reverseLeftRight(o);
  var old_params = s.params;
  Sprite.transformEnemy(t, s, o.dir);
  return normalizePos(o, old_params, s.params);
}

function decHealth(obj) {
  var health = obj.health - 1 | 0;
  if (health === 0) {
    obj.kill = true;
  } else if (obj.invuln === 0) {
    obj.health = health;
  }
  if (isPlayer(obj)) {
    return jump(obj);
  }
  
}

function evolveBlock(obj) {
  decHealth(obj);
  return make(false, undefined, obj.dir, {
              TAG: /* Block */3,
              _0: /* QBlockUsed */0
            }, Sprite.makeBlock(/* QBlockUsed */0), obj.px, obj.py);
}

function spawnAbove(player_dir, obj, itemTyp) {
  var item = make(itemTyp !== /* Coin */1, undefined, /* Left */0, {
        TAG: /* Item */2,
        _0: itemTyp
      }, Sprite.makeItem(itemTyp), obj.px, obj.py);
  item.py = item.py - item.sprite.params.frameSize[1];
  item.dir = player_dir ? /* Left */0 : /* Right */1;
  setVelToSpeed(item);
  return item;
}

function getAabb(obj) {
  var sprParams = obj.sprite.params;
  var match = sprParams.bboxOffset;
  var box = obj.px + match[0];
  var boy = obj.py + match[1];
  var match$1 = sprParams.bboxSize;
  var sy = match$1[1];
  var sx = match$1[0];
  return {
          center: {
            x: box + sx / 2,
            y: boy + sy / 2
          },
          half: {
            x: sx / 2,
            y: sy / 2
          }
        };
}

function colBypass(c1, c2) {
  if (c1.kill) {
    return true;
  }
  if (c2.kill) {
    return true;
  }
  var match = c1.objTyp;
  var match$1 = c2.objTyp;
  switch (match.TAG | 0) {
    case /* Player */0 :
        if (match$1.TAG === /* Enemy */1) {
          return c1.invuln > 0;
        } else {
          return false;
        }
    case /* Enemy */1 :
        if (match$1.TAG === /* Item */2) {
          return true;
        } else {
          return false;
        }
    case /* Item */2 :
        switch (match$1.TAG | 0) {
          case /* Enemy */1 :
          case /* Item */2 :
              return true;
          case /* Player */0 :
          case /* Block */3 :
              return false;
          
        }
    case /* Block */3 :
        return false;
    
  }
}

function checkCollision(o1, o2) {
  var b1 = getAabb(o1);
  var b2 = getAabb(o2);
  if (colBypass(o1, o2)) {
    return ;
  }
  var vx = b1.center.x - b2.center.x;
  var vy = b1.center.y - b2.center.y;
  var hwidths = b1.half.x + b2.half.x;
  var hheights = b1.half.y + b2.half.y;
  if (!(Math.abs(vx) < hwidths && Math.abs(vy) < hheights)) {
    return ;
  }
  var ox = hwidths - Math.abs(vx);
  var oy = hheights - Math.abs(vy);
  if (ox + 0.2 > oy) {
    if (vy > 0) {
      o1.py = o1.py + oy;
      return /* North */0;
    } else {
      o1.py = o1.py - oy;
      return /* South */1;
    }
  } else if (vx > 0) {
    o1.px = o1.px + ox;
    return /* West */3;
  } else {
    o1.px = o1.px - ox;
    return /* East */2;
  }
}

function kill(obj) {
  var t = obj.objTyp;
  switch (t.TAG | 0) {
    case /* Player */0 :
        return /* [] */0;
    case /* Enemy */1 :
        var score = obj.score > 0 ? ({
              hd: Particle.makeScore(obj.score, obj.px)(obj.py),
              tl: /* [] */0
            }) : /* [] */0;
        var remains = t._0 !== 0 ? /* [] */0 : ({
              hd: Particle.make(undefined, undefined, /* GoombaSquish */0, obj.px, obj.py),
              tl: /* [] */0
            });
        return Pervasives.$at(score, remains);
    case /* Item */2 :
        if (t._0) {
          return /* [] */0;
        } else {
          return {
                  hd: Particle.makeScore(obj.score, obj.px)(obj.py),
                  tl: /* [] */0
                };
        }
    case /* Block */3 :
        if (t._0 !== 1) {
          return /* [] */0;
        }
        var p1 = Particle.make([
              -5,
              -5
            ], [
              0,
              0.2
            ], /* BrickChunkL */1, obj.px, obj.py);
        var p2 = Particle.make([
              -3,
              -4
            ], [
              0,
              0.2
            ], /* BrickChunkL */1, obj.px, obj.py);
        var p3 = Particle.make([
              3,
              -4
            ], [
              0,
              0.2
            ], /* BrickChunkR */2, obj.px, obj.py);
        var p4 = Particle.make([
              5,
              -5
            ], [
              0,
              0.2
            ], /* BrickChunkR */2, obj.px, obj.py);
        return {
                hd: p1,
                tl: {
                  hd: p2,
                  tl: {
                    hd: p3,
                    tl: {
                      hd: p4,
                      tl: /* [] */0
                    }
                  }
                }
              };
    
  }
}

export {
  idCounter ,
  setVelToSpeed ,
  makePlayer ,
  makeItem ,
  makeEnemy ,
  makeBlock ,
  newId ,
  make ,
  isPlayer ,
  isEnemy ,
  equals ,
  jump ,
  updatePlayerKeys ,
  normalizePos ,
  updatePlayer ,
  updateVel ,
  updatePos ,
  processObj ,
  collideBlock ,
  oppositeDir ,
  reverseLeftRight ,
  evolveEnemy ,
  revDir ,
  decHealth ,
  evolveBlock ,
  spawnAbove ,
  getAabb ,
  colBypass ,
  checkCollision ,
  kill ,
  
}
/* Sprite Not a pure module */
