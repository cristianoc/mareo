

import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";
import * as Caml_primitive from "bs-platform/lib/es6/caml_primitive.js";

var id_counter = {
  contents: Pervasives.min_int
};

function setup_obj(has_gravityOpt, speedOpt, param) {
  var has_gravity = has_gravityOpt !== undefined ? has_gravityOpt : true;
  var speed = speedOpt !== undefined ? speedOpt : 1;
  return {
          has_gravity: has_gravity,
          speed: speed
        };
}

function set_vel_to_speed(obj) {
  var speed = obj.params.speed;
  var match = obj.dir;
  if (match) {
    obj.vel.x = speed;
  } else {
    obj.vel.x = -speed;
  }
  
}

function make_player(param) {
  return setup_obj(undefined, 2.8, undefined);
}

function make_item(param) {
  if (param) {
    return setup_obj(false, undefined, undefined);
  } else {
    return setup_obj(undefined, undefined, undefined);
  }
}

function make_enemy(param) {
  if (param >= 3) {
    return setup_obj(undefined, 3, undefined);
  } else {
    return setup_obj(undefined, undefined, undefined);
  }
}

function make_block(param) {
  return setup_obj(false, undefined, undefined);
}

function new_id(param) {
  id_counter.contents = id_counter.contents + 1 | 0;
  return id_counter.contents;
}

function make(dirOpt, spr, params, x, y) {
  var dir = dirOpt !== undefined ? dirOpt : /* Left */0;
  var id = new_id(undefined);
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
          spr,
          obj
        ];
}

function get_sprite(param) {
  return param._1;
}

function get_obj(param) {
  return param._2;
}

function is_player(param) {
  if (param.TAG) {
    return false;
  } else {
    return true;
  }
}

function is_enemy(param) {
  if (param.TAG === /* Enemy */1) {
    return true;
  } else {
    return false;
  }
}

function equals(col1, col2) {
  return col1._2.id === col2._2.id;
}

function update_player_keys(player, controls) {
  var lr_acc = player.vel.x * 0.2;
  switch (controls) {
    case /* CLeft */0 :
        if (!player.crouch) {
          if (player.vel.x > -player.params.speed) {
            player.vel.x = player.vel.x - (0.4 - lr_acc);
          }
          player.dir = /* Left */0;
          return ;
        } else {
          return ;
        }
    case /* CRight */1 :
        if (!player.crouch) {
          if (player.vel.x < player.params.speed) {
            player.vel.x = player.vel.x + (0.4 + lr_acc);
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
          player.vel.y = Caml_primitive.caml_float_max(player.vel.y - (5.7 + Math.abs(player.vel.x) * 0.25), -6);
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

function normalize_pos(pos, p1, p2) {
  var match = p1.bboxOffset;
  var match$1 = p2.bboxOffset;
  var match$2 = p1.bboxSize;
  var match$3 = p2.bboxSize;
  pos.x = pos.x - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
  pos.y = pos.y - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  
}

function update_player(player, keys) {
  var prev_jumping = player.jumping;
  var prev_dir = player.dir;
  var prev_vx = Math.abs(player.vel.x);
  Belt_List.forEach(keys, (function (param) {
          return update_player_keys(player, param);
        }));
  var v = player.vel.x * 0.9;
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
            Sprite.make_from_params(Sprite.make_player(plSize, [
                      playerTyp,
                      player.dir
                    ]))
          ];
  }
  
}

function update_vel(obj) {
  if (obj.grounded) {
    obj.vel.y = 0;
    return ;
  } else if (obj.params.has_gravity) {
    obj.vel.y = Caml_primitive.caml_float_min(obj.vel.y + 0.2 + Math.abs(obj.vel.y) * 0.01, 4.5);
    return ;
  } else {
    return ;
  }
}

function update_pos(obj) {
  obj.pos.x = obj.vel.x + obj.pos.x;
  if (obj.params.has_gravity) {
    obj.pos.y = obj.vel.y + obj.pos.y;
    return ;
  }
  
}

function process_obj(obj, mapy) {
  update_vel(obj);
  update_pos(obj);
  if (obj.pos.y > mapy) {
    obj.kill = true;
    return ;
  }
  
}

function collide_block(dir, obj) {
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

function opposite_dir(dir) {
  if (dir) {
    return /* Left */0;
  } else {
    return /* Right */1;
  }
}

function reverse_left_right(obj) {
  obj.vel.x = -obj.vel.x;
  obj.dir = obj.dir ? /* Left */0 : /* Right */1;
  
}

function evolve_enemy(player_dir, typ, spr, obj) {
  switch (typ) {
    case /* Goomba */0 :
        obj.kill = true;
        return ;
    case /* GKoopa */1 :
        var match = make(obj.dir, Sprite.make_from_params(Sprite.make_enemy([
                      /* GKoopaShell */3,
                      obj.dir
                    ])), make_enemy(/* GKoopaShell */3), obj.pos.x, obj.pos.y);
        var new_obj = match[1];
        var new_spr = match[0];
        normalize_pos(new_obj.pos, spr.params, new_spr.params);
        return {
                TAG: /* Enemy */1,
                _0: /* GKoopaShell */3,
                _1: new_spr,
                _2: new_obj
              };
    case /* RKoopa */2 :
        var match$1 = make(obj.dir, Sprite.make_from_params(Sprite.make_enemy([
                      /* RKoopaShell */4,
                      obj.dir
                    ])), make_enemy(/* RKoopaShell */4), obj.pos.x, obj.pos.y);
        return {
                TAG: /* Enemy */1,
                _0: /* RKoopaShell */4,
                _1: match$1[0],
                _2: match$1[1]
              };
    case /* GKoopaShell */3 :
    case /* RKoopaShell */4 :
        break;
    
  }
  obj.dir = player_dir;
  if (obj.vel.x !== 0) {
    obj.vel.x = 0;
  } else {
    set_vel_to_speed(obj);
  }
  
}

function rev_dir(o, t, s) {
  reverse_left_right(o);
  var old_params = s.params;
  Sprite.transform_enemy(t, s, o.dir);
  return normalize_pos(o.pos, old_params, s.params);
}

function dec_health(obj) {
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

function evolve_block(obj) {
  dec_health(obj);
  var match = make(obj.dir, Sprite.make_from_params(Sprite.make_block(/* QBlockUsed */0)), make_block(/* QBlockUsed */0), obj.pos.x, obj.pos.y);
  return {
          TAG: /* Block */3,
          _0: /* QBlockUsed */0,
          _1: match[0],
          _2: match[1]
        };
}

function spawn_above(player_dir, obj, itemTyp) {
  var match = make(undefined, Sprite.make_from_params(Sprite.make_item(itemTyp)), make_item(itemTyp), obj.pos.x, obj.pos.y);
  var obj$1 = match[1];
  var spr = match[0];
  var item = {
    TAG: /* Item */2,
    _0: itemTyp,
    _1: spr,
    _2: obj$1
  };
  obj$1.pos.y = obj$1.pos.y - spr.params.frameSize[1];
  obj$1.dir = player_dir ? /* Left */0 : /* Right */1;
  set_vel_to_speed(obj$1);
  return item;
}

function get_aabb(obj) {
  var spr = obj._1.params;
  var obj$1 = obj._2;
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

function col_bypass(c1, c2) {
  var o1 = c1._2;
  var o2 = c2._2;
  var ctypes;
  switch (c1.TAG | 0) {
    case /* Player */0 :
        ctypes = c2.TAG === /* Enemy */1 ? c1._2.invuln > 0 : false;
        break;
    case /* Enemy */1 :
        ctypes = c2.TAG === /* Item */2 ? true : false;
        break;
    case /* Item */2 :
        switch (c2.TAG | 0) {
          case /* Enemy */1 :
          case /* Item */2 :
              ctypes = true;
              break;
          case /* Player */0 :
          case /* Block */3 :
              ctypes = false;
              break;
          
        }
        break;
    case /* Block */3 :
        ctypes = false;
        break;
    
  }
  if (o1.kill || o2.kill) {
    return true;
  } else {
    return ctypes;
  }
}

function check_collision(c1, c2) {
  var b1 = get_aabb(c1);
  var b2 = get_aabb(c2);
  var o1 = c1._2;
  if (col_bypass(c1, c2)) {
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
  if (ox >= oy) {
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
  switch (collid.TAG | 0) {
    case /* Player */0 :
        return /* [] */0;
    case /* Enemy */1 :
        var o = collid._2;
        var pos_0 = o.pos.x;
        var pos_1 = o.pos.y;
        var pos = [
          pos_0,
          pos_1
        ];
        var score = o.score > 0 ? /* :: */({
              _0: Particle.make_score(o.score, pos),
              _1: /* [] */0
            }) : /* [] */0;
        var remains = collid._0 !== 0 ? /* [] */0 : /* :: */({
              _0: Particle.make(undefined, undefined, /* GoombaSquish */0, pos),
              _1: /* [] */0
            });
        return Pervasives.$at(score, remains);
    case /* Item */2 :
        var o$1 = collid._2;
        if (collid._0) {
          return /* [] */0;
        } else {
          return /* :: */{
                  _0: Particle.make_score(o$1.score, [
                        o$1.pos.x,
                        o$1.pos.y
                      ]),
                  _1: /* [] */0
                };
        }
    case /* Block */3 :
        var o$2 = collid._2;
        var t = collid._0;
        if (typeof t !== "number") {
          return /* [] */0;
        }
        if (t !== 1) {
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

var friction = 0.9;

var gravity = 0.2;

var max_y_vel = 4.5;

var player_speed = 2.8;

var player_jump = 5.7;

var player_max_jump = -6;

var dampen_jump = 4;

var invuln = 60;

export {
  friction ,
  gravity ,
  max_y_vel ,
  player_speed ,
  player_jump ,
  player_max_jump ,
  dampen_jump ,
  invuln ,
  id_counter ,
  setup_obj ,
  set_vel_to_speed ,
  make_player ,
  make_item ,
  make_enemy ,
  make_block ,
  new_id ,
  make ,
  get_sprite ,
  get_obj ,
  is_player ,
  is_enemy ,
  equals ,
  update_player_keys ,
  normalize_pos ,
  update_player ,
  update_vel ,
  update_pos ,
  process_obj ,
  collide_block ,
  opposite_dir ,
  reverse_left_right ,
  evolve_enemy ,
  rev_dir ,
  dec_health ,
  evolve_block ,
  spawn_above ,
  get_aabb ,
  col_bypass ,
  check_collision ,
  kill ,
  
}
/* No side effect */
