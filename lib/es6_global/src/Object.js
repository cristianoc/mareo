

import * as Block from "../../../node_modules/bs-platform/lib/es6/block.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Belt_List from "../../../node_modules/bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";
import * as Caml_option from "../../../node_modules/bs-platform/lib/es6/caml_option.js";
import * as Caml_primitive from "../../../node_modules/bs-platform/lib/es6/caml_primitive.js";

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
    return ;
  } else {
    obj.vel.x = -speed;
    return ;
  }
}

function make_type(t) {
  switch (t.tag | 0) {
    case /* SPlayer */0 :
        return setup_obj(undefined, 2.8, undefined);
    case /* SEnemy */1 :
        var param = t[0];
        if (param >= 3) {
          return setup_obj(undefined, 3, undefined);
        } else {
          return setup_obj(undefined, undefined, undefined);
        }
    case /* SItem */2 :
        var param$1 = t[0];
        if (param$1 >= 3) {
          return setup_obj(false, undefined, undefined);
        } else {
          return setup_obj(undefined, undefined, undefined);
        }
    case /* SBlock */3 :
        return setup_obj(false, undefined, undefined);
    
  }
}

function new_id(param) {
  id_counter.contents = id_counter.contents + 1 | 0;
  return id_counter.contents;
}

function make($staropt$star, $staropt$star$1, spawnable, context, param) {
  var id = $staropt$star !== undefined ? Caml_option.valFromOption($staropt$star) : undefined;
  var dir = $staropt$star$1 !== undefined ? $staropt$star$1 : /* Left */0;
  var spr = Sprite.make(spawnable, dir, context);
  var params = make_type(spawnable);
  var id$1 = id !== undefined ? id : new_id(undefined);
  var obj = {
    params: params,
    pos: {
      x: param[0],
      y: param[1]
    },
    vel: {
      x: 0.0,
      y: 0.0
    },
    id: id$1,
    jumping: false,
    grounded: false,
    dir: dir,
    invuln: 0,
    kill: false,
    health: 1,
    crouch: false,
    score: 0
  };
  return /* tuple */[
          spr,
          obj
        ];
}

function spawn(spawnable, context, param) {
  var match = make(undefined, undefined, spawnable, context, /* tuple */[
        param[0],
        param[1]
      ]);
  var obj = match[1];
  var spr = match[0];
  switch (spawnable.tag | 0) {
    case /* SPlayer */0 :
        return /* Player */Block.__(0, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SEnemy */1 :
        set_vel_to_speed(obj);
        return /* Enemy */Block.__(1, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SItem */2 :
        return /* Item */Block.__(2, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SBlock */3 :
        return /* Block */Block.__(3, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    
  }
}

function get_sprite(param) {
  return param[1];
}

function get_obj(param) {
  return param[2];
}

function is_player(param) {
  if (param.tag) {
    return false;
  } else {
    return true;
  }
}

function is_enemy(param) {
  if (param.tag === /* Enemy */1) {
    return true;
  } else {
    return false;
  }
}

function equals(col1, col2) {
  return col1[2].id === col2[2].id;
}

function normalize_pos(pos, p1, p2) {
  var match = p1.bbox_offset;
  var match$1 = p2.bbox_offset;
  var match$2 = p1.bbox_size;
  var match$3 = p2.bbox_size;
  pos.x = pos.x - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
  pos.y = pos.y - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  
}

function update_player(player, keys, context) {
  var prev_jumping = player.jumping;
  var prev_dir = player.dir;
  var prev_vx = Math.abs(player.vel.x);
  Belt_List.forEach(keys, (function (param) {
          var lr_acc = player.vel.x * 0.2;
          switch (param) {
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
        }));
  var v = player.vel.x * 0.9;
  var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
  player.vel.x = vel_damped;
  var pl_typ = player.health <= 1 ? /* SmallM */1 : /* BigM */0;
  if (!prev_jumping && player.jumping) {
    return /* tuple */[
            pl_typ,
            Sprite.make(/* SPlayer */Block.__(0, [
                    pl_typ,
                    /* Jumping */1
                  ]), player.dir, context)
          ];
  } else if (prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vel.x) > 0 && !player.jumping) {
    return /* tuple */[
            pl_typ,
            Sprite.make(/* SPlayer */Block.__(0, [
                    pl_typ,
                    /* Running */2
                  ]), player.dir, context)
          ];
  } else if (prev_dir !== player.dir && player.jumping && prev_jumping) {
    return /* tuple */[
            pl_typ,
            Sprite.make(/* SPlayer */Block.__(0, [
                    pl_typ,
                    /* Jumping */1
                  ]), player.dir, context)
          ];
  } else if (player.vel.y === 0 && player.crouch) {
    return /* tuple */[
            pl_typ,
            Sprite.make(/* SPlayer */Block.__(0, [
                    pl_typ,
                    /* Crouching */3
                  ]), player.dir, context)
          ];
  } else if (player.vel.y === 0 && player.vel.x === 0) {
    return /* tuple */[
            pl_typ,
            Sprite.make(/* SPlayer */Block.__(0, [
                    pl_typ,
                    /* Standing */0
                  ]), player.dir, context)
          ];
  } else {
    return ;
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

function normalize_origin(pos, spr) {
  var p = spr.params;
  var match = p.bbox_offset;
  var match$1 = p.bbox_size;
  pos.x = pos.x - match[0];
  pos.y = pos.y - (match[1] + match$1[1]);
  
}

function collide_block(check_xOpt, dir, obj) {
  var check_x = check_xOpt !== undefined ? check_xOpt : true;
  if (dir !== 1) {
    if (dir !== 0) {
      if (check_x) {
        obj.vel.x = 0;
        return ;
      } else {
        return ;
      }
    } else {
      obj.vel.y = -0.001;
      return ;
    }
  } else {
    obj.vel.y = 0;
    obj.grounded = true;
    obj.jumping = false;
    return ;
  }
}

function reverse_left_right(obj) {
  obj.vel.x = -obj.vel.x;
  obj.dir = obj.dir ? /* Left */0 : /* Right */1;
  
}

function evolve_enemy(player_dir, typ, spr, obj, context) {
  switch (typ) {
    case /* Goomba */0 :
        obj.kill = true;
        return ;
    case /* GKoopa */1 :
        var match = make(undefined, obj.dir, /* SEnemy */Block.__(1, [/* GKoopaShell */3]), context, /* tuple */[
              obj.pos.x,
              obj.pos.y
            ]);
        var new_obj = match[1];
        var new_spr = match[0];
        normalize_pos(new_obj.pos, spr.params, new_spr.params);
        return /* Enemy */Block.__(1, [
                  /* GKoopaShell */3,
                  new_spr,
                  new_obj
                ]);
    case /* RKoopa */2 :
        var match$1 = make(undefined, obj.dir, /* SEnemy */Block.__(1, [/* RKoopaShell */4]), context, /* tuple */[
              obj.pos.x,
              obj.pos.y
            ]);
        var new_obj$1 = match$1[1];
        var new_spr$1 = match$1[0];
        normalize_pos(new_obj$1.pos, spr.params, new_spr$1.params);
        return /* Enemy */Block.__(1, [
                  /* RKoopaShell */4,
                  new_spr$1,
                  new_obj$1
                ]);
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

function evolve_block(obj, context) {
  dec_health(obj);
  var match = make(undefined, undefined, /* SBlock */Block.__(3, [/* QBlockUsed */0]), context, /* tuple */[
        obj.pos.x,
        obj.pos.y
      ]);
  return /* Block */Block.__(3, [
            /* QBlockUsed */0,
            match[0],
            match[1]
          ]);
}

function spawn_above(player_dir, obj, typ, context) {
  var item = spawn(/* SItem */Block.__(2, [typ]), context, /* tuple */[
        obj.pos.x,
        obj.pos.y
      ]);
  var item_obj = item[2];
  item_obj.pos.y = item_obj.pos.y - item[1].params.frame_size[1];
  item_obj.dir = player_dir ? /* Left */0 : /* Right */1;
  set_vel_to_speed(item_obj);
  return item;
}

function get_aabb(obj) {
  var spr = obj[1].params;
  var obj$1 = obj[2];
  var match = spr.bbox_offset;
  var box = obj$1.pos.x + match[0];
  var boy = obj$1.pos.y + match[1];
  var match$1 = spr.bbox_size;
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
  var o1 = c1[2];
  var o2 = c2[2];
  var ctypes;
  switch (c1.tag | 0) {
    case /* Player */0 :
        ctypes = c2.tag === /* Enemy */1 ? c1[2].invuln > 0 : false;
        break;
    case /* Enemy */1 :
        ctypes = c2.tag === /* Item */2 ? true : false;
        break;
    case /* Item */2 :
        switch (c2.tag | 0) {
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
  var o1 = c1[2];
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

function kill(collid, ctx) {
  switch (collid.tag | 0) {
    case /* Player */0 :
        return /* [] */0;
    case /* Enemy */1 :
        var o = collid[2];
        var pos_000 = o.pos.x;
        var pos_001 = o.pos.y;
        var pos = /* tuple */[
          pos_000,
          pos_001
        ];
        var score = o.score > 0 ? /* :: */[
            Particle.make_score(o.score, pos, ctx),
            /* [] */0
          ] : /* [] */0;
        var remains = collid[0] !== 0 ? /* [] */0 : /* :: */[
            Particle.make(undefined, undefined, /* GoombaSquish */0, pos, ctx),
            /* [] */0
          ];
        return Pervasives.$at(score, remains);
    case /* Item */2 :
        var o$1 = collid[2];
        if (collid[0] !== 0) {
          return /* [] */0;
        } else {
          return /* :: */[
                  Particle.make_score(o$1.score, /* tuple */[
                        o$1.pos.x,
                        o$1.pos.y
                      ], ctx),
                  /* [] */0
                ];
        }
    case /* Block */3 :
        var o$2 = collid[2];
        var t = collid[0];
        if (typeof t !== "number") {
          return /* [] */0;
        }
        if (t !== 1) {
          return /* [] */0;
        }
        var pos_000$1 = o$2.pos.x;
        var pos_001$1 = o$2.pos.y;
        var pos$1 = /* tuple */[
          pos_000$1,
          pos_001$1
        ];
        var p1 = Particle.make(/* tuple */[
              -5,
              -5
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkL */1, pos$1, ctx);
        var p2 = Particle.make(/* tuple */[
              -3,
              -4
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkL */1, pos$1, ctx);
        var p3 = Particle.make(/* tuple */[
              3,
              -4
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkR */2, pos$1, ctx);
        var p4 = Particle.make(/* tuple */[
              5,
              -5
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkR */2, pos$1, ctx);
        return /* :: */[
                p1,
                /* :: */[
                  p2,
                  /* :: */[
                    p3,
                    /* :: */[
                      p4,
                      /* [] */0
                    ]
                  ]
                ]
              ];
    
  }
}

var invuln = 60;

var dampen_jump = 4;

export {
  invuln ,
  dampen_jump ,
  get_sprite ,
  get_obj ,
  spawn ,
  equals ,
  is_player ,
  is_enemy ,
  normalize_origin ,
  normalize_pos ,
  kill ,
  process_obj ,
  update_player ,
  check_collision ,
  evolve_enemy ,
  evolve_block ,
  dec_health ,
  rev_dir ,
  reverse_left_right ,
  collide_block ,
  spawn_above ,
  
}
/* No side effect */
