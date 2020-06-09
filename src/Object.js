

import * as Config from "./Config.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";
import * as Caml_primitive from "bs-platform/lib/es6/caml_primitive.js";

var idCounter = {
  contents: Pervasives.min_int
};

function setup(hasGravityOpt, speedOpt, param) {
  var hasGravity = hasGravityOpt !== undefined ? hasGravityOpt : true;
  var speed = speedOpt !== undefined ? speedOpt : 1;
  return {
          hasGravity: hasGravity,
          speed: speed
        };
}

function setVelToSpeed(obj) {
  var speed = obj.params.speed;
  var match = obj.dir;
  if (match) {
    obj.vel.x = speed;
  } else {
    obj.vel.x = -speed;
  }
  
}

function makePlayer(param) {
  return setup(undefined, Config.player_speed, undefined);
}

function makeItem(param) {
  if (param) {
    return setup(false, undefined, undefined);
  } else {
    return setup(undefined, undefined, undefined);
  }
}

function makeEnemy(param) {
  if (param >= 3) {
    return setup(undefined, 3, undefined);
  } else {
    return setup(undefined, undefined, undefined);
  }
}

function makeBlock(param) {
  return setup(false, undefined, undefined);
}

function newId(param) {
  idCounter.contents = idCounter.contents + 1 | 0;
  return idCounter.contents;
}

function make(dir, spr, params, x, y) {
  var id = newId(undefined);
  var obj = {
    params: params,
    pos: {
      x: x,
      y: y
    },
    vel: {
      x: 0.0,
      y: 0.0
    },
    id: id,
    jumping: false,
    grounded: false,
    dir: dir,
    invuln: 0,
    kill: false,
    health: 1,
    crouch: false,
    score: 0
  };
  return [
          Sprite.makeFromParams(spr),
          obj
        ];
}

function getSprite(param) {
  return param.sprite;
}

function getObj(param) {
  return param.obj;
}

function isPlayer(param) {
  if (param.objTyp.TAG) {
    return false;
  } else {
    return true;
  }
}

function isEnemy(param) {
  if (param.objTyp.TAG === /* Enemy */1) {
    return true;
  } else {
    return false;
  }
}

function equals(col1, col2) {
  return col1.obj.id === col2.obj.id;
}

function updatePlayerKeys(player, controls) {
  var lr_acc = player.vel.x * 0.2;
  switch (controls) {
    case /* CLeft */0 :
        if (!player.crouch) {
          if (player.vel.x > -player.params.speed) {
            player.vel.x = player.vel.x - (0.4 + Math.abs(lr_acc));
          }
          player.dir = /* Left */0;
          return ;
        } else {
          return ;
        }
    case /* CRight */1 :
        if (!player.crouch) {
          if (player.vel.x < player.params.speed) {
            player.vel.x = player.vel.x + (0.4 + Math.abs(lr_acc));
          }
          player.dir = /* Right */1;
          return ;
        } else {
          return ;
        }
    case /* CUp */2 :
        if (!player.jumping && player.grounded) {
          player.jumping = true;
          player.grounded = false;
          player.vel.y = Caml_primitive.caml_float_max(player.vel.y - (Config.player_jump + Math.abs(player.vel.x) * 0.25), Config.player_max_jump);
          return ;
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

function normalizePos(pos, p1, p2) {
  var match = p1.bboxOffset;
  var match$1 = p2.bboxOffset;
  var match$2 = p1.bboxSize;
  var match$3 = p2.bboxSize;
  pos.x = pos.x - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
  pos.y = pos.y - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  
}

function updatePlayer(player, keys) {
  var prev_jumping = player.jumping;
  var prev_dir = player.dir;
  var prev_vx = Math.abs(player.vel.x);
  Belt_List.forEach(keys, (function (param) {
          return updatePlayerKeys(player, param);
        }));
  var v = player.vel.x * Config.friction;
  var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
  player.vel.x = vel_damped;
  var plSize = player.health <= 1 ? /* SmallM */1 : /* BigM */0;
  var playerTyp = !prev_jumping && player.jumping ? /* Jumping */1 : (
      prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vel.x) > 0 && !player.jumping ? /* Running */2 : (
          prev_dir !== player.dir && player.jumping && prev_jumping ? /* Jumping */1 : (
              player.vel.y === 0 && player.crouch ? /* Crouching */3 : (
                  player.vel.y === 0 && player.vel.x === 0 ? /* Standing */0 : undefined
                )
            )
        )
    );
  if (playerTyp !== undefined) {
    return [
            plSize,
            Sprite.makeFromParams(Sprite.makePlayer(plSize, playerTyp, player.dir))
          ];
  }
  
}

function updateVel(obj) {
  if (obj.grounded) {
    obj.vel.y = 0;
    return ;
  } else if (obj.params.hasGravity) {
    obj.vel.y = Caml_primitive.caml_float_min(obj.vel.y + Config.gravity + Math.abs(obj.vel.y) * 0.01, Config.max_y_vel);
    return ;
  } else {
    return ;
  }
}

function updatePos(obj) {
  obj.pos.x = obj.vel.x + obj.pos.x;
  if (obj.params.hasGravity) {
    obj.pos.y = obj.vel.y + obj.pos.y;
    return ;
  }
  
}

function processObj(obj, mapy) {
  updateVel(obj);
  updatePos(obj);
  if (obj.pos.y > mapy) {
    obj.kill = true;
    return ;
  }
  
}

function collideBlock(dir, obj) {
  if (dir !== 1) {
    if (dir !== 0) {
      obj.vel.x = 0;
    } else {
      obj.vel.y = -0.001;
    }
  } else {
    obj.vel.y = 0;
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
  obj.vel.x = -obj.vel.x;
  obj.dir = obj.dir ? /* Left */0 : /* Right */1;
  
}

function evolveEnemy(player_dir, typ, spr, obj) {
  switch (typ) {
    case /* Goomba */0 :
        obj.kill = true;
        return ;
    case /* GKoopa */1 :
        var match = make(obj.dir, Sprite.makeEnemy(/* GKoopaShell */3, obj.dir), makeEnemy(/* GKoopaShell */3), obj.pos.x, obj.pos.y);
        var new_obj = match[1];
        var new_spr = match[0];
        normalizePos(new_obj.pos, spr.params, new_spr.params);
        return {
                objTyp: {
                  TAG: /* Enemy */1,
                  _0: /* GKoopaShell */3
                },
                sprite: new_spr,
                obj: new_obj
              };
    case /* RKoopa */2 :
        var match$1 = make(obj.dir, Sprite.makeEnemy(/* RKoopaShell */4, obj.dir), makeEnemy(/* RKoopaShell */4), obj.pos.x, obj.pos.y);
        return {
                objTyp: {
                  TAG: /* Enemy */1,
                  _0: /* RKoopaShell */4
                },
                sprite: match$1[0],
                obj: match$1[1]
              };
    case /* GKoopaShell */3 :
    case /* RKoopaShell */4 :
        break;
    
  }
  obj.dir = player_dir;
  if (obj.vel.x !== 0) {
    obj.vel.x = 0;
  } else {
    setVelToSpeed(obj);
  }
  
}

function revDir(o, t, s) {
  reverseLeftRight(o);
  var old_params = s.params;
  Sprite.transformEnemy(t, s, o.dir);
  return normalizePos(o.pos, old_params, s.params);
}

function decHealth(obj) {
  var health = obj.health - 1 | 0;
  if (health === 0) {
    obj.kill = true;
    return ;
  } else if (obj.invuln === 0) {
    obj.health = health;
    return ;
  } else {
    return ;
  }
}

function evolveBlock(obj) {
  decHealth(obj);
  var match = make(obj.dir, Sprite.makeBlock(/* QBlockUsed */0), makeBlock(/* QBlockUsed */0), obj.pos.x, obj.pos.y);
  return {
          objTyp: {
            TAG: /* Block */3,
            _0: /* QBlockUsed */0
          },
          sprite: match[0],
          obj: match[1]
        };
}

function spawnAbove(player_dir, obj, itemTyp) {
  var match = make(/* Left */0, Sprite.makeItem(itemTyp), makeItem(itemTyp), obj.pos.x, obj.pos.y);
  var item_objTyp = {
    TAG: /* Item */2,
    _0: itemTyp
  };
  var item_sprite = match[0];
  var item_obj = match[1];
  var item = {
    objTyp: item_objTyp,
    sprite: item_sprite,
    obj: item_obj
  };
  var item_obj$1 = getObj(item);
  item_obj$1.pos.y = item_obj$1.pos.y - getSprite(item).params.frameSize[1];
  item_obj$1.dir = player_dir ? /* Left */0 : /* Right */1;
  setVelToSpeed(item_obj$1);
  return item;
}

function getAabb(obj) {
  var spr = getSprite(obj).params;
  var obj$1 = getObj(obj);
  var match = spr.bboxOffset;
  var box = obj$1.pos.x + match[0];
  var boy = obj$1.pos.y + match[1];
  var match$1 = spr.bboxSize;
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
  if (c1.obj.kill) {
    return true;
  }
  if (c2.obj.kill) {
    return true;
  }
  var match = c1.objTyp;
  var match$1 = c2.objTyp;
  switch (match.TAG | 0) {
    case /* Player */0 :
        if (match$1.TAG === /* Enemy */1) {
          return c1.obj.invuln > 0;
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

function checkCollision(c1, c2) {
  var b1 = getAabb(c1);
  var b2 = getAabb(c2);
  var o1 = getObj(c1);
  if (colBypass(c1, c2)) {
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
      o1.pos.y = o1.pos.y + oy;
      return /* North */0;
    } else {
      o1.pos.y = o1.pos.y - oy;
      return /* South */1;
    }
  } else if (vx > 0) {
    o1.pos.x = o1.pos.x + ox;
    return /* West */3;
  } else {
    o1.pos.x = o1.pos.x - ox;
    return /* East */2;
  }
}

function kill(collid) {
  var t = collid.objTyp;
  switch (t.TAG | 0) {
    case /* Player */0 :
        return /* [] */0;
    case /* Enemy */1 :
        var o = collid.obj;
        var pos_0 = o.pos.x;
        var pos_1 = o.pos.y;
        var pos = [
          pos_0,
          pos_1
        ];
        var score = o.score > 0 ? /* :: */({
              _0: Particle.makeScore(o.score, pos),
              _1: /* [] */0
            }) : /* [] */0;
        var remains = t._0 !== 0 ? /* [] */0 : /* :: */({
              _0: Particle.make(undefined, undefined, /* GoombaSquish */0, pos),
              _1: /* [] */0
            });
        return Pervasives.$at(score, remains);
    case /* Item */2 :
        var o$1 = collid.obj;
        if (t._0) {
          return /* [] */0;
        } else {
          return /* :: */{
                  _0: Particle.makeScore(o$1.score, [
                        o$1.pos.x,
                        o$1.pos.y
                      ]),
                  _1: /* [] */0
                };
        }
    case /* Block */3 :
        var o$2 = collid.obj;
        var t$1 = t._0;
        if (typeof t$1 !== "number") {
          return /* [] */0;
        }
        if (t$1 !== 1) {
          return /* [] */0;
        }
        var pos_0$1 = o$2.pos.x;
        var pos_1$1 = o$2.pos.y;
        var pos$1 = [
          pos_0$1,
          pos_1$1
        ];
        var p1 = Particle.make([
              -5,
              -5
            ], [
              0,
              0.2
            ], /* BrickChunkL */1, pos$1);
        var p2 = Particle.make([
              -3,
              -4
            ], [
              0,
              0.2
            ], /* BrickChunkL */1, pos$1);
        var p3 = Particle.make([
              3,
              -4
            ], [
              0,
              0.2
            ], /* BrickChunkR */2, pos$1);
        var p4 = Particle.make([
              5,
              -5
            ], [
              0,
              0.2
            ], /* BrickChunkR */2, pos$1);
        return /* :: */{
                _0: p1,
                _1: /* :: */{
                  _0: p2,
                  _1: /* :: */{
                    _0: p3,
                    _1: /* :: */{
                      _0: p4,
                      _1: /* [] */0
                    }
                  }
                }
              };
    
  }
}

export {
  idCounter ,
  setup ,
  setVelToSpeed ,
  makePlayer ,
  makeItem ,
  makeEnemy ,
  makeBlock ,
  newId ,
  make ,
  getSprite ,
  getObj ,
  isPlayer ,
  isEnemy ,
  equals ,
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
/* No side effect */
