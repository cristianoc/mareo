

import * as Draw from "./Draw.js";
import * as Keys from "./Keys.js";
import * as Load from "./Load.js";
import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Viewport from "./Viewport.js";
import * as Belt_List from "bs-platform/lib/es6/belt_List.js";
import * as Generator from "./Generator.js";
import * as Caml_int32 from "bs-platform/lib/es6/caml_int32.js";
import * as Pervasives from "bs-platform/lib/es6/pervasives.js";

var collid_objs = {
  contents: /* [] */0
};

var particles = {
  contents: /* [] */0
};

var lastTime = {
  contents: 0
};

var initialTime = {
  contents: 0
};

function calcFps(param) {
  var t0 = lastTime.contents;
  var time = performance.now();
  lastTime.contents = time;
  if (t0 === 0) {
    initialTime.contents = time;
    return 0;
  }
  var delta = (time - t0) / 1000;
  if (time - initialTime.contents < 1000.0) {
    return 0;
  } else {
    return 1 / delta;
  }
}

function update_score(state, i) {
  state.score = state.score + i | 0;
  
}

function playerAttackEnemy(o1, typ, s2, o2, state) {
  o1.invuln = 10;
  o1.jumping = false;
  o1.grounded = true;
  if (typ >= 3) {
    var r2 = $$Object.evolve_enemy(o1.dir, typ, s2, o2);
    o1.vel.y = -Config.dampen_jump;
    o1.pos.y = o1.pos.y - 5;
    return [
            undefined,
            r2
          ];
  }
  $$Object.dec_health(o2);
  o1.vel.y = -Config.dampen_jump;
  if (state.multiplier === 8) {
    update_score(state, 800);
    o2.score = 800;
    return [
            undefined,
            $$Object.evolve_enemy(o1.dir, typ, s2, o2)
          ];
  }
  var score = Math.imul(100, state.multiplier);
  update_score(state, score);
  o2.score = score;
  state.multiplier = (state.multiplier << 1);
  return [
          undefined,
          $$Object.evolve_enemy(o1.dir, typ, s2, o2)
        ];
}

function enemyAttackPlayer(o1, t2, s2, o2) {
  if (t2 >= 3) {
    var r2 = o2.vel.x === 0 ? $$Object.evolve_enemy(o1.dir, t2, s2, o2) : ($$Object.dec_health(o1), o1.invuln = Config.invuln, undefined);
    return [
            undefined,
            r2
          ];
  }
  $$Object.dec_health(o1);
  o1.invuln = Config.invuln;
  return [
          undefined,
          undefined
        ];
}

function col_enemy_enemy(t1, s1, o1, t2, s2, o2, dir) {
  if (t1 !== 3) {
    if (t1 < 4) {
      if (t2 >= 3) {
        if (o2.vel.x === 0) {
          $$Object.rev_dir(o1, t1, s1);
          return [
                  undefined,
                  undefined
                ];
        } else {
          $$Object.dec_health(o1);
          return [
                  undefined,
                  undefined
                ];
        }
      } else if (dir >= 2) {
        $$Object.rev_dir(o1, t1, s1);
        $$Object.rev_dir(o2, t2, s2);
        return [
                undefined,
                undefined
              ];
      } else {
        return [
                undefined,
                undefined
              ];
      }
    }
    if (t2 >= 3) {
      $$Object.dec_health(o1);
      $$Object.dec_health(o2);
      return [
              undefined,
              undefined
            ];
    }
    
  } else if (t2 >= 3) {
    $$Object.dec_health(o1);
    $$Object.dec_health(o2);
    return [
            undefined,
            undefined
          ];
  }
  if (o1.vel.x === 0) {
    $$Object.rev_dir(o2, t2, s2);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.dec_health(o2);
    return [
            undefined,
            undefined
          ];
  }
}

function process_collision(dir, c1, c2, state) {
  var o1;
  var t2;
  var o2;
  switch (c1.TAG | 0) {
    case /* Player */0 :
        var o1$1 = c1._2;
        switch (c2.TAG | 0) {
          case /* Player */0 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Enemy */1 :
              var o2$1 = c2._2;
              var s2 = c2._1;
              var typ = c2._0;
              if (dir !== 1) {
                return enemyAttackPlayer(o1$1, typ, s2, o2$1);
              } else {
                return playerAttackEnemy(o1$1, typ, s2, o2$1, state);
              }
          case /* Item */2 :
              o1 = o1$1;
              t2 = c2._0;
              o2 = c2._2;
              break;
          case /* Block */3 :
              var o2$2 = c2._2;
              var t = c2._0;
              if (dir !== 0) {
                var exit = 0;
                if (typeof t === "number" && t === 4) {
                  state.status = /* Won */1;
                  return [
                          undefined,
                          undefined
                        ];
                }
                exit = 2;
                if (exit === 2) {
                  if (dir !== 1) {
                    $$Object.collide_block(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    state.multiplier = 1;
                    $$Object.collide_block(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  }
                }
                
              } else {
                if (typeof t === "number") {
                  if (t !== 1) {
                    if (t !== 4) {
                      $$Object.collide_block(dir, o1$1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      state.status = /* Won */1;
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  } else if (c1._0 === /* BigM */0) {
                    $$Object.collide_block(dir, o1$1);
                    $$Object.dec_health(o2$2);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    $$Object.collide_block(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  }
                }
                var updated_block = $$Object.evolve_block(o2$2);
                var spawned_item = $$Object.spawn_above(o1$1.dir, o2$2, t._0);
                $$Object.collide_block(dir, o1$1);
                return [
                        spawned_item,
                        updated_block
                      ];
              }
              break;
          
        }
        break;
    case /* Enemy */1 :
        var o1$2 = c1._2;
        var s1 = c1._1;
        var t1 = c1._0;
        switch (c2.TAG | 0) {
          case /* Player */0 :
              var o1$3 = c2._2;
              if (dir !== 0) {
                return enemyAttackPlayer(o1$3, t1, s1, o1$2);
              } else {
                return playerAttackEnemy(o1$3, t1, s1, o1$2, state);
              }
          case /* Enemy */1 :
              return col_enemy_enemy(t1, s1, o1$2, c2._0, c2._1, c2._2, dir);
          case /* Item */2 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              var o2$3 = c2._2;
              var t2$1 = c2._0;
              if (dir >= 2) {
                if (t1 >= 3) {
                  if (typeof t2$1 === "number") {
                    if (t2$1 !== 1) {
                      $$Object.rev_dir(o1$2, t1, s1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.dec_health(o2$3);
                      $$Object.reverse_left_right(o1$2);
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updated_block$1 = $$Object.evolve_block(o2$3);
                  var spawned_item$1 = $$Object.spawn_above(o1$2.dir, o2$3, t2$1._0);
                  $$Object.rev_dir(o1$2, t1, s1);
                  return [
                          updated_block$1,
                          spawned_item$1
                        ];
                }
                $$Object.rev_dir(o1$2, t1, s1);
                return [
                        undefined,
                        undefined
                      ];
              }
              $$Object.collide_block(dir, o1$2);
              return [
                      undefined,
                      undefined
                    ];
          
        }
    case /* Item */2 :
        var o2$4 = c1._2;
        switch (c2.TAG | 0) {
          case /* Player */0 :
              o1 = c2._2;
              t2 = c1._0;
              o2 = o2$4;
              break;
          case /* Enemy */1 :
          case /* Item */2 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              if (dir >= 2) {
                $$Object.reverse_left_right(o2$4);
                return [
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.collide_block(dir, o2$4);
                return [
                        undefined,
                        undefined
                      ];
              }
          
        }
        break;
    case /* Block */3 :
        return [
                undefined,
                undefined
              ];
    
  }
  if (t2) {
    state.coins = state.coins + 1 | 0;
    $$Object.dec_health(o2);
    update_score(state, 100);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.dec_health(o2);
    if (o1.health === 2) {
      
    } else {
      o1.health = o1.health + 1 | 0;
    }
    o1.vel.x = 0;
    o1.vel.y = 0;
    update_score(state, 1000);
    o2.score = 1000;
    return [
            undefined,
            undefined
          ];
  }
}

function broad_phase(collid, all_collids, state) {
  var obj = $$Object.get_obj(collid);
  return Belt_List.keep(all_collids, (function (_c) {
                if (Viewport.in_viewport(state.vpt, obj.pos) || $$Object.is_player(collid)) {
                  return true;
                } else {
                  return Viewport.out_of_viewport_below(state.vpt, obj.pos.y);
                }
              }));
}

function narrow_phase(c, cs, state) {
  var _cs = cs;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var cs$1 = _cs;
    if (!cs$1) {
      return acc;
    }
    var h = cs$1._0;
    var c_obj = $$Object.get_obj(c);
    var new_objs;
    if ($$Object.equals(c, h)) {
      new_objs = [
        undefined,
        undefined
      ];
    } else {
      var dir = $$Object.check_collision(c, h);
      new_objs = dir !== undefined && $$Object.get_obj(h).id !== c_obj.id ? process_collision(dir, c, h, state) : [
          undefined,
          undefined
        ];
    }
    var o = new_objs[0];
    var acc$1;
    if (o !== undefined) {
      var o2 = new_objs[1];
      acc$1 = o2 !== undefined ? /* :: */({
            _0: o,
            _1: /* :: */{
              _0: o2,
              _1: acc
            }
          }) : /* :: */({
            _0: o,
            _1: acc
          });
    } else {
      var o$1 = new_objs[1];
      acc$1 = o$1 !== undefined ? /* :: */({
            _0: o$1,
            _1: acc
          }) : acc;
    }
    _acc = acc$1;
    _cs = cs$1._1;
    continue ;
  };
}

function check_collisions(collid, all_collids, state) {
  if (collid.TAG === /* Block */3) {
    return /* [] */0;
  }
  var broad = broad_phase(collid, all_collids, state);
  return narrow_phase(collid, broad, state);
}

function update_collidable(state, collid, all_collids) {
  var obj = $$Object.get_obj(collid);
  var spr = $$Object.get_sprite(collid);
  obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
  var viewport_filter = Viewport.in_viewport(state.vpt, obj.pos) || $$Object.is_player(collid) || Viewport.out_of_viewport_below(state.vpt, obj.pos.y);
  if (!(!obj.kill && viewport_filter)) {
    return /* [] */0;
  }
  obj.grounded = false;
  $$Object.process_obj(obj, state.map);
  var evolved = check_collisions(collid, all_collids, state);
  var vpt_adj_xy = Viewport.coord_to_viewport(state.vpt, obj.pos);
  Draw.render(spr, vpt_adj_xy.x, vpt_adj_xy.y);
  if (Keys.check_bbox_enabled(undefined)) {
    Draw.renderBbox(spr, vpt_adj_xy.x, vpt_adj_xy.y);
  }
  if (obj.vel.x !== 0 || !$$Object.is_enemy(collid)) {
    Sprite.update_animation(spr);
  }
  return evolved;
}

function run_update_collid(state, collid, all_collids) {
  if (collid.TAG) {
    var obj = $$Object.get_obj(collid);
    var evolved = update_collidable(state, collid, all_collids);
    if (!obj.kill) {
      collid_objs.contents = /* :: */{
        _0: collid,
        _1: Pervasives.$at(collid_objs.contents, evolved)
      };
    }
    var new_parts = obj.kill ? $$Object.kill(collid) : /* [] */0;
    particles.contents = Pervasives.$at(particles.contents, new_parts);
    return collid;
  }
  var o = collid._2;
  var keys = Keys.translate_keys(undefined);
  o.crouch = false;
  var match = $$Object.update_player(o, keys);
  var player;
  if (match !== undefined) {
    var new_spr = match[1];
    $$Object.normalize_pos(o.pos, collid._1.params, new_spr.params);
    player = {
      TAG: /* Player */0,
      _0: match[0],
      _1: new_spr,
      _2: o
    };
  } else {
    player = collid;
  }
  var evolved$1 = update_collidable(state, player, all_collids);
  collid_objs.contents = Pervasives.$at(collid_objs.contents, evolved$1);
  return player;
}

function run_update_particle(state, part) {
  Particle.$$process(part);
  var x = part.pos.x - Viewport.getPos(state.vpt).x;
  var y = part.pos.y - Viewport.getPos(state.vpt).y;
  Draw.render(part.params.sprite, x, y);
  if (!part.kill) {
    particles.contents = /* :: */{
      _0: part,
      _1: particles.contents
    };
    return ;
  }
  
}

function updateLoop(param) {
  var player = param[0];
  var canvas = Load.getCanvas(undefined);
  var cwidth = canvas.width / Config.scale;
  var cheight = canvas.height / Config.scale;
  var viewport = Viewport.make([
        cwidth,
        cheight
      ], Config.mapDim);
  var state = {
    bgd: Sprite.make_bgd(undefined),
    vpt: Viewport.update(viewport, $$Object.get_obj(player).pos),
    map: Config.mapDim[1],
    score: 0,
    coins: 0,
    multiplier: 1,
    status: /* Playing */0
  };
  Load.getContext(undefined).scale(Config.scale, Config.scale);
  var updateHelper = function (time, state, player, objs, parts) {
    var t = state.status;
    if (typeof t === "number") {
      if (t !== 0) {
        return Draw.gameWon(undefined);
      }
      
    } else {
      var t$1 = t._0;
      if (time - t$1 > Config.delayWhenLost) {
        var timeToStart = Config.restartAfter - ((time - t$1 | 0) / 1000 | 0) | 0;
        if (timeToStart > 0) {
          Draw.gameLost(timeToStart);
          requestAnimationFrame(function (t) {
                return updateHelper(t, state, player, collid_objs.contents, particles.contents);
              });
          return ;
        }
        var match = Generator.generate(undefined);
        return updateLoop([
                    match[0],
                    match[1]
                  ]);
      }
      
    }
    var fps = calcFps(undefined);
    collid_objs.contents = /* [] */0;
    particles.contents = /* [] */0;
    Draw.clearCanvas(undefined);
    var vpos_x_int = Viewport.getPos(state.vpt).x / 5 | 0;
    var bgd_width = state.bgd.params.frameSize[0] | 0;
    Draw.drawBgd(state.bgd, Caml_int32.mod_(vpos_x_int, bgd_width));
    var player$1 = run_update_collid(state, player, objs);
    if ($$Object.get_obj(player$1).kill === true) {
      var match$1 = state.status;
      if (typeof match$1 === "number") {
        state.status = /* Lost */{
          _0: time
        };
      }
      
    }
    var state$1 = {
      bgd: state.bgd,
      vpt: Viewport.update(state.vpt, $$Object.get_obj(player$1).pos),
      map: state.map,
      score: state.score,
      coins: state.coins,
      multiplier: state.multiplier,
      status: state.status
    };
    Belt_List.forEach(objs, (function (obj) {
            return run_update_collid(state$1, obj, objs);
          }));
    Belt_List.forEach(parts, (function (part) {
            return run_update_particle(state$1, part);
          }));
    Draw.fps(fps);
    Draw.hud(state$1.score, state$1.coins);
    requestAnimationFrame(function (t) {
          return updateHelper(t, state$1, player$1, collid_objs.contents, particles.contents);
        });
    
  };
  return updateHelper(0, state, player, param[1], /* [] */0);
}

export {
  collid_objs ,
  particles ,
  lastTime ,
  initialTime ,
  calcFps ,
  update_score ,
  playerAttackEnemy ,
  enemyAttackPlayer ,
  col_enemy_enemy ,
  process_collision ,
  broad_phase ,
  narrow_phase ,
  check_collisions ,
  update_collidable ,
  run_update_collid ,
  run_update_particle ,
  updateLoop ,
  
}
/* No side effect */
