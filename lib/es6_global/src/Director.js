

import * as Draw from "./Draw.js";
import * as Block from "../../../node_modules/bs-platform/lib/es6/block.js";
import * as $$Object from "./Object.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Viewport from "./Viewport.js";
import * as Belt_List from "../../../node_modules/bs-platform/lib/es6/belt_List.js";
import * as Caml_int32 from "../../../node_modules/bs-platform/lib/es6/caml_int32.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";

var pressed_keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  bbox: 0
};

var collid_objs = {
  contents: /* [] */0
};

var particles = {
  contents: /* [] */0
};

var last_time = {
  contents: 0
};

function calc_fps(t0, t1) {
  var delta = (t1 - t0) / 1000;
  return 1 / delta;
}

function update_score(state, i) {
  state.score = state.score + i | 0;
  
}

function process_collision(dir, c1, c2, state) {
  var context = state.ctx;
  var exit = 0;
  var s1;
  var o1;
  var typ;
  var s2;
  var o2;
  var s1$1;
  var o1$1;
  var t2;
  var s2$1;
  var o2$1;
  var o1$2;
  var t2$1;
  var o2$2;
  switch (c1.tag | 0) {
    case /* Player */0 :
        var o1$3 = c1[2];
        var s1$2 = c1[1];
        switch (c2.tag | 0) {
          case /* Player */0 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Enemy */1 :
              var o2$3 = c2[2];
              var s2$2 = c2[1];
              var typ$1 = c2[0];
              if (dir !== 1) {
                s1$1 = s1$2;
                o1$1 = o1$3;
                t2 = typ$1;
                s2$1 = s2$2;
                o2$1 = o2$3;
                exit = 2;
              } else {
                s1 = s1$2;
                o1 = o1$3;
                typ = typ$1;
                s2 = s2$2;
                o2 = o2$3;
                exit = 1;
              }
              break;
          case /* Item */2 :
              o1$2 = o1$3;
              t2$1 = c2[0];
              o2$2 = c2[2];
              exit = 3;
              break;
          case /* Block */3 :
              var o2$4 = c2[2];
              var t = c2[0];
              if (dir !== 0) {
                var exit$1 = 0;
                if (typeof t === "number" && t === 4) {
                  Draw.game_win(state.ctx);
                  return /* tuple */[
                          undefined,
                          undefined
                        ];
                }
                exit$1 = 4;
                if (exit$1 === 4) {
                  if (dir !== 1) {
                    $$Object.collide_block(undefined, dir, o1$3);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  } else {
                    state.multiplier = 1;
                    $$Object.collide_block(undefined, dir, o1$3);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  }
                }
                
              } else {
                if (typeof t === "number") {
                  if (t !== 1) {
                    if (t !== 4) {
                      $$Object.collide_block(undefined, dir, o1$3);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    } else {
                      Draw.game_win(state.ctx);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    }
                  } else if (c1[0] === /* BigM */0) {
                    $$Object.collide_block(undefined, dir, o1$3);
                    $$Object.dec_health(o2$4);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  } else {
                    $$Object.collide_block(undefined, dir, o1$3);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  }
                }
                var updated_block = $$Object.evolve_block(o2$4, context);
                var spawned_item = $$Object.spawn_above(o1$3.dir, o2$4, t[0], context);
                $$Object.collide_block(undefined, dir, o1$3);
                return /* tuple */[
                        spawned_item,
                        updated_block
                      ];
              }
              break;
          
        }
        break;
    case /* Enemy */1 :
        var o1$4 = c1[2];
        var s1$3 = c1[1];
        var t1 = c1[0];
        switch (c2.tag | 0) {
          case /* Player */0 :
              var o1$5 = c2[2];
              var s1$4 = c2[1];
              if (dir !== 0) {
                s1$1 = s1$4;
                o1$1 = o1$5;
                t2 = t1;
                s2$1 = s1$3;
                o2$1 = o1$4;
                exit = 2;
              } else {
                s1 = s1$4;
                o1 = o1$5;
                typ = t1;
                s2 = s1$3;
                o2 = o1$4;
                exit = 1;
              }
              break;
          case /* Enemy */1 :
              var t2$2 = c2[0];
              var s2$3 = c2[1];
              var o2$5 = c2[2];
              if (t1 !== 3) {
                if (t1 < 4) {
                  if (t2$2 >= 3) {
                    if (o2$5.vel.x === 0) {
                      $$Object.rev_dir(o1$4, t1, s1$3);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.dec_health(o1$4);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    }
                  } else if (dir >= 2) {
                    $$Object.rev_dir(o1$4, t1, s1$3);
                    $$Object.rev_dir(o2$5, t2$2, s2$3);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  } else {
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  }
                }
                if (t2$2 >= 3) {
                  $$Object.dec_health(o1$4);
                  $$Object.dec_health(o2$5);
                  return /* tuple */[
                          undefined,
                          undefined
                        ];
                }
                
              } else if (t2$2 >= 3) {
                $$Object.dec_health(o1$4);
                $$Object.dec_health(o2$5);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
              if (o1$4.vel.x === 0) {
                $$Object.rev_dir(o2$5, t2$2, s2$3);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.dec_health(o2$5);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
          case /* Item */2 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              var o2$6 = c2[2];
              var t2$3 = c2[0];
              if (dir >= 2) {
                if (t1 >= 3) {
                  if (typeof t2$3 === "number") {
                    if (t2$3 !== 1) {
                      $$Object.rev_dir(o1$4, t1, s1$3);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.dec_health(o2$6);
                      $$Object.reverse_left_right(o1$4);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updated_block$1 = $$Object.evolve_block(o2$6, context);
                  var spawned_item$1 = $$Object.spawn_above(o1$4.dir, o2$6, t2$3[0], context);
                  $$Object.rev_dir(o1$4, t1, s1$3);
                  return /* tuple */[
                          updated_block$1,
                          spawned_item$1
                        ];
                }
                $$Object.rev_dir(o1$4, t1, s1$3);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
              $$Object.collide_block(undefined, dir, o1$4);
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          
        }
        break;
    case /* Item */2 :
        var o2$7 = c1[2];
        switch (c2.tag | 0) {
          case /* Player */0 :
              o1$2 = c2[2];
              t2$1 = c1[0];
              o2$2 = o2$7;
              exit = 3;
              break;
          case /* Enemy */1 :
          case /* Item */2 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              if (dir >= 2) {
                $$Object.reverse_left_right(o2$7);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.collide_block(undefined, dir, o2$7);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
          
        }
        break;
    case /* Block */3 :
        return /* tuple */[
                undefined,
                undefined
              ];
    
  }
  switch (exit) {
    case 1 :
        o1.invuln = 10;
        o1.jumping = false;
        o1.grounded = true;
        if (typ >= 3) {
          var r2 = $$Object.evolve_enemy(o1.dir, typ, s2, o2, context);
          o1.vel.y = -$$Object.dampen_jump;
          o1.pos.y = o1.pos.y - 5;
          return /* tuple */[
                  undefined,
                  r2
                ];
        }
        $$Object.dec_health(o2);
        o1.vel.y = -$$Object.dampen_jump;
        if (state.multiplier === 8) {
          update_score(state, 800);
          o2.score = 800;
          return /* tuple */[
                  undefined,
                  $$Object.evolve_enemy(o1.dir, typ, s2, o2, context)
                ];
        }
        var score = Caml_int32.imul(100, state.multiplier);
        update_score(state, score);
        o2.score = score;
        state.multiplier = (state.multiplier << 1);
        return /* tuple */[
                undefined,
                $$Object.evolve_enemy(o1.dir, typ, s2, o2, context)
              ];
    case 2 :
        if (t2 >= 3) {
          var r2$1 = o2$1.vel.x === 0 ? $$Object.evolve_enemy(o1$1.dir, t2, s2$1, o2$1, context) : ($$Object.dec_health(o1$1), o1$1.invuln = $$Object.invuln, undefined);
          return /* tuple */[
                  undefined,
                  r2$1
                ];
        }
        $$Object.dec_health(o1$1);
        o1$1.invuln = $$Object.invuln;
        return /* tuple */[
                undefined,
                undefined
              ];
    case 3 :
        if (t2$1 !== 0) {
          if (t2$1 >= 3) {
            state.coins = state.coins + 1 | 0;
            $$Object.dec_health(o2$2);
            update_score(state, 100);
            return /* tuple */[
                    undefined,
                    undefined
                  ];
          } else {
            $$Object.dec_health(o2$2);
            update_score(state, 1000);
            return /* tuple */[
                    undefined,
                    undefined
                  ];
          }
        } else {
          $$Object.dec_health(o2$2);
          if (o1$2.health === 2) {
            
          } else {
            o1$2.health = o1$2.health + 1 | 0;
          }
          o1$2.vel.x = 0;
          o1$2.vel.y = 0;
          update_score(state, 1000);
          o2$2.score = 1000;
          return /* tuple */[
                  undefined,
                  undefined
                ];
        }
    
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

function check_collisions(collid, all_collids, state) {
  if (collid.tag === /* Block */3) {
    return /* [] */0;
  }
  var broad = broad_phase(collid, all_collids, state);
  var _cs = broad;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var cs = _cs;
    if (!cs) {
      return acc;
    }
    var h = cs[0];
    var c_obj = $$Object.get_obj(collid);
    var new_objs;
    if ($$Object.equals(collid, h)) {
      new_objs = /* tuple */[
        undefined,
        undefined
      ];
    } else {
      var dir = $$Object.check_collision(collid, h);
      new_objs = dir !== undefined && $$Object.get_obj(h).id !== c_obj.id ? process_collision(dir, collid, h, state) : /* tuple */[
          undefined,
          undefined
        ];
    }
    var o = new_objs[0];
    var acc$1;
    if (o !== undefined) {
      var o2 = new_objs[1];
      acc$1 = o2 !== undefined ? /* :: */[
          o,
          /* :: */[
            o2,
            acc
          ]
        ] : /* :: */[
          o,
          acc
        ];
    } else {
      var o$1 = new_objs[1];
      acc$1 = o$1 !== undefined ? /* :: */[
          o$1,
          acc
        ] : acc;
    }
    _acc = acc$1;
    _cs = cs[1];
    continue ;
  };
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
  Draw.render(spr, /* tuple */[
        vpt_adj_xy.x,
        vpt_adj_xy.y
      ]);
  if (pressed_keys.bbox === 1) {
    Draw.render_bbox(spr, /* tuple */[
          vpt_adj_xy.x,
          vpt_adj_xy.y
        ]);
  }
  if (obj.vel.x !== 0 || !$$Object.is_enemy(collid)) {
    Sprite.update_animation(spr);
  }
  return evolved;
}

function translate_keys(param) {
  var ctrls_000 = /* tuple */[
    pressed_keys.left,
    /* CLeft */0
  ];
  var ctrls_001 = /* :: */[
    /* tuple */[
      pressed_keys.right,
      /* CRight */1
    ],
    /* :: */[
      /* tuple */[
        pressed_keys.up,
        /* CUp */2
      ],
      /* :: */[
        /* tuple */[
          pressed_keys.down,
          /* CDown */3
        ],
        /* [] */0
      ]
    ]
  ];
  var ctrls = /* :: */[
    ctrls_000,
    ctrls_001
  ];
  return Belt_List.reduce(ctrls, /* [] */0, (function (a, x) {
                if (x[0]) {
                  return /* :: */[
                          x[1],
                          a
                        ];
                } else {
                  return a;
                }
              }));
}

function run_update_collid(state, collid, all_collids) {
  if (collid.tag) {
    var obj = $$Object.get_obj(collid);
    var evolved = update_collidable(state, collid, all_collids);
    if (!obj.kill) {
      collid_objs.contents = /* :: */[
        collid,
        Pervasives.$at(collid_objs.contents, evolved)
      ];
    }
    var new_parts = obj.kill ? $$Object.kill(collid, state.ctx) : /* [] */0;
    particles.contents = Pervasives.$at(particles.contents, new_parts);
    return collid;
  }
  var o = collid[2];
  var keys = translate_keys(undefined);
  o.crouch = false;
  var match = $$Object.update_player(o, keys, state.ctx);
  var player;
  if (match !== undefined) {
    var new_spr = match[1];
    $$Object.normalize_pos(o.pos, collid[1].params, new_spr.params);
    player = /* Player */Block.__(0, [
        match[0],
        new_spr,
        o
      ]);
  } else {
    player = collid;
  }
  var evolved$1 = update_collidable(state, player, all_collids);
  collid_objs.contents = Pervasives.$at(collid_objs.contents, evolved$1);
  return player;
}

function update_loop(canvas, param, map_dim) {
  var player = param[0];
  var ctx = canvas.getContext("2d");
  var cwidth = canvas.width / 1;
  var cheight = canvas.height / 1;
  var viewport = Viewport.make(/* tuple */[
        cwidth,
        cheight
      ], map_dim);
  var state = {
    bgd: Sprite.make_bgd(ctx),
    ctx: ctx,
    vpt: Viewport.update(viewport, $$Object.get_obj(player).pos),
    map: map_dim[1],
    score: 0,
    coins: 0,
    multiplier: 1,
    game_over: false
  };
  state.ctx.scale(1, 1);
  var update_helper = function (time, state, player, objs, parts) {
    if (state.game_over === true) {
      return Draw.game_win(state.ctx);
    }
    collid_objs.contents = /* [] */0;
    particles.contents = /* [] */0;
    var fps = calc_fps(last_time.contents, time);
    last_time.contents = time;
    Draw.clear_canvas(canvas);
    var vpos_x_int = state.vpt.pos.x / 5 | 0;
    var bgd_width = state.bgd.params.frame_size[0] | 0;
    Draw.draw_bgd(state.bgd, Caml_int32.mod_(vpos_x_int, bgd_width));
    var player$1 = run_update_collid(state, player, objs);
    if ($$Object.get_obj(player$1).kill === true) {
      return Draw.game_loss(state.ctx);
    }
    var state$1 = {
      bgd: state.bgd,
      ctx: state.ctx,
      vpt: Viewport.update(state.vpt, $$Object.get_obj(player$1).pos),
      map: state.map,
      score: state.score,
      coins: state.coins,
      multiplier: state.multiplier,
      game_over: state.game_over
    };
    Belt_List.forEach(objs, (function (obj) {
            run_update_collid(state$1, obj, objs);
            
          }));
    Belt_List.forEach(parts, (function (part) {
            Particle.$$process(part);
            var x = part.pos.x - state$1.vpt.pos.x;
            var y = part.pos.y - state$1.vpt.pos.y;
            Draw.render(part.params.sprite, /* tuple */[
                  x,
                  y
                ]);
            if (!part.kill) {
              particles.contents = /* :: */[
                part,
                particles.contents
              ];
              return ;
            }
            
          }));
    Draw.fps(canvas, fps);
    Draw.hud(canvas, state$1.score, state$1.coins);
    requestAnimationFrame((function (t) {
            return update_helper(t, state$1, player$1, collid_objs.contents, particles.contents);
          }));
    
  };
  return update_helper(0, state, player, param[1], /* [] */0);
}

function keydown(evt) {
  var match = evt.keyCode;
  if (match >= 41) {
    switch (match) {
      case 65 :
          pressed_keys.left = true;
          break;
      case 66 :
          pressed_keys.bbox = (pressed_keys.bbox + 1 | 0) % 2;
          break;
      case 68 :
          pressed_keys.right = true;
          break;
      case 83 :
          pressed_keys.down = true;
          break;
      case 67 :
      case 69 :
      case 70 :
      case 71 :
      case 72 :
      case 73 :
      case 74 :
      case 75 :
      case 76 :
      case 77 :
      case 78 :
      case 79 :
      case 80 :
      case 81 :
      case 82 :
      case 84 :
      case 85 :
      case 86 :
          break;
      case 87 :
          pressed_keys.up = true;
          break;
      default:
        
    }
  } else if (match >= 32) {
    switch (match - 32 | 0) {
      case 1 :
      case 2 :
      case 3 :
      case 4 :
          break;
      case 5 :
          pressed_keys.left = true;
          break;
      case 0 :
      case 6 :
          pressed_keys.up = true;
          break;
      case 7 :
          pressed_keys.right = true;
          break;
      case 8 :
          pressed_keys.down = true;
          break;
      
    }
  }
  return true;
}

function keyup(evt) {
  var match = evt.keyCode;
  if (match >= 68) {
    if (match !== 83) {
      if (match !== 87) {
        if (match >= 69) {
          
        } else {
          pressed_keys.right = false;
        }
      } else {
        pressed_keys.up = false;
      }
    } else {
      pressed_keys.down = false;
    }
  } else if (match >= 41) {
    if (match !== 65) {
      
    } else {
      pressed_keys.left = false;
    }
  } else if (match >= 32) {
    switch (match - 32 | 0) {
      case 1 :
      case 2 :
      case 3 :
      case 4 :
          break;
      case 5 :
          pressed_keys.left = false;
          break;
      case 0 :
      case 6 :
          pressed_keys.up = false;
          break;
      case 7 :
          pressed_keys.right = false;
          break;
      case 8 :
          pressed_keys.down = false;
          break;
      
    }
  }
  return true;
}

export {
  update_loop ,
  keydown ,
  keyup ,
  
}
/* No side effect */