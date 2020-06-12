

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
    var r2 = $$Object.evolveEnemy(o1.dir, typ, s2, o2);
    o1.vel.y = -Config.dampen_jump;
    o1.pos.y = o1.pos.y - 5;
    return [
            undefined,
            r2
          ];
  }
  $$Object.decHealth(o2);
  o1.vel.y = -Config.dampen_jump;
  if (state.multiplier === 8) {
    update_score(state, 800);
    o2.score = 800;
    return [
            undefined,
            $$Object.evolveEnemy(o1.dir, typ, s2, o2)
          ];
  }
  var score = Math.imul(100, state.multiplier);
  update_score(state, score);
  o2.score = score;
  state.multiplier = (state.multiplier << 1);
  return [
          undefined,
          $$Object.evolveEnemy(o1.dir, typ, s2, o2)
        ];
}

function enemyAttackPlayer(o1, t2, s2, o2) {
  if (t2 >= 3) {
    var r2 = o2.vel.x === 0 ? $$Object.evolveEnemy(o1.dir, t2, s2, o2) : ($$Object.decHealth(o1), o1.invuln = Config.invuln, undefined);
    return [
            undefined,
            r2
          ];
  }
  $$Object.decHealth(o1);
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
          $$Object.revDir(o1, t1, s1);
          return [
                  undefined,
                  undefined
                ];
        } else {
          $$Object.decHealth(o1);
          return [
                  undefined,
                  undefined
                ];
        }
      } else if (dir >= 2) {
        $$Object.revDir(o1, t1, s1);
        $$Object.revDir(o2, t2, s2);
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
      $$Object.decHealth(o1);
      $$Object.decHealth(o2);
      return [
              undefined,
              undefined
            ];
    }
    
  } else if (t2 >= 3) {
    $$Object.decHealth(o1);
    $$Object.decHealth(o2);
    return [
            undefined,
            undefined
          ];
  }
  if (o1.vel.x === 0) {
    $$Object.revDir(o2, t2, s2);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.decHealth(o2);
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
  var t1 = c1.objTyp;
  switch (t1.TAG | 0) {
    case /* Player */0 :
        var t = c2.objTyp;
        var o1$1 = c1.obj;
        switch (t.TAG | 0) {
          case /* Player */0 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Enemy */1 :
              var o2$1 = c2.obj;
              var s2 = c2.sprite;
              var typ = t._0;
              if (dir !== 1) {
                return enemyAttackPlayer(o1$1, typ, s2, o2$1);
              } else {
                return playerAttackEnemy(o1$1, typ, s2, o2$1, state);
              }
          case /* Item */2 :
              o1 = o1$1;
              t2 = t._0;
              o2 = c2.obj;
              break;
          case /* Block */3 :
              var o2$2 = c2.obj;
              var t$1 = t._0;
              if (dir !== 0) {
                var exit = 0;
                if (typeof t$1 === "number" && t$1 === 4) {
                  state.status = /* Won */1;
                  return [
                          undefined,
                          undefined
                        ];
                }
                exit = 2;
                if (exit === 2) {
                  if (dir !== 1) {
                    $$Object.collideBlock(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    state.multiplier = 1;
                    $$Object.collideBlock(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  }
                }
                
              } else {
                if (typeof t$1 === "number") {
                  if (t$1 !== 1) {
                    if (t$1 !== 4) {
                      $$Object.collideBlock(dir, o1$1);
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
                  } else if (t1._0 === /* BigM */0) {
                    $$Object.collideBlock(dir, o1$1);
                    $$Object.decHealth(o2$2);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    $$Object.collideBlock(dir, o1$1);
                    return [
                            undefined,
                            undefined
                          ];
                  }
                }
                var updated_block = $$Object.evolveBlock(o2$2);
                var spawned_item = $$Object.spawnAbove(o1$1.dir, o2$2, t$1._0);
                $$Object.collideBlock(dir, o1$1);
                return [
                        spawned_item,
                        updated_block
                      ];
              }
              break;
          
        }
        break;
    case /* Enemy */1 :
        var t2$1 = c2.objTyp;
        var o1$2 = c1.obj;
        var s1 = c1.sprite;
        var t1$1 = t1._0;
        switch (t2$1.TAG | 0) {
          case /* Player */0 :
              var o1$3 = c2.obj;
              if (dir !== 0) {
                return enemyAttackPlayer(o1$3, t1$1, s1, o1$2);
              } else {
                return playerAttackEnemy(o1$3, t1$1, s1, o1$2, state);
              }
          case /* Enemy */1 :
              return col_enemy_enemy(t1$1, s1, o1$2, t2$1._0, c2.sprite, c2.obj, dir);
          case /* Item */2 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              var o2$3 = c2.obj;
              var t2$2 = t2$1._0;
              if (dir >= 2) {
                if (t1$1 >= 3) {
                  if (typeof t2$2 === "number") {
                    if (t2$2 !== 1) {
                      $$Object.revDir(o1$2, t1$1, s1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.decHealth(o2$3);
                      $$Object.reverseLeftRight(o1$2);
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updated_block$1 = $$Object.evolveBlock(o2$3);
                  var spawned_item$1 = $$Object.spawnAbove(o1$2.dir, o2$3, t2$2._0);
                  $$Object.revDir(o1$2, t1$1, s1);
                  return [
                          updated_block$1,
                          spawned_item$1
                        ];
                }
                $$Object.revDir(o1$2, t1$1, s1);
                return [
                        undefined,
                        undefined
                      ];
              }
              $$Object.collideBlock(dir, o1$2);
              return [
                      undefined,
                      undefined
                    ];
          
        }
    case /* Item */2 :
        var o2$4 = c1.obj;
        switch (c2.objTyp.TAG | 0) {
          case /* Player */0 :
              o1 = c2.obj;
              t2 = t1._0;
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
                $$Object.reverseLeftRight(o2$4);
                return [
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.collideBlock(dir, o2$4);
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
    $$Object.decHealth(o2);
    update_score(state, 100);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.decHealth(o2);
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

function viewportFilter(state, obj, collid) {
  if (Viewport.inViewport(state.vpt, obj.pos) || $$Object.isPlayer(collid)) {
    return true;
  } else {
    return Viewport.outOfViewportBelow(state.vpt, obj.pos.y);
  }
}

function broadPhase(collid, allCollids, state) {
  return Belt_List.keep(allCollids, (function (_c) {
                return viewportFilter(state, collid.obj, collid);
              }));
}

function narrowPhase(c, cs, state) {
  var _cs = cs;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var cs$1 = _cs;
    if (!cs$1) {
      return acc;
    }
    var h = cs$1._0;
    var new_objs;
    if ($$Object.equals(c, h)) {
      new_objs = [
        undefined,
        undefined
      ];
    } else {
      var dir = $$Object.checkCollision(c, h);
      new_objs = dir !== undefined && h.obj.id !== c.obj.id ? process_collision(dir, c, h, state) : [
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

function checkCollisions(collid, all_collids, state) {
  var match = collid.objTyp;
  if (match.TAG === /* Block */3) {
    return /* [] */0;
  }
  var broad = broadPhase(collid, all_collids, state);
  return narrowPhase(collid, broad, state);
}

function updateCollidable(state, collid, all_collids) {
  var obj = collid.obj;
  var spr = collid.sprite;
  obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
  if (!(!obj.kill && viewportFilter(state, obj, collid))) {
    return /* [] */0;
  }
  obj.grounded = false;
  $$Object.processObj(obj, state.map);
  var evolved = checkCollisions(collid, all_collids, state);
  var vpt_adj_xy = Viewport.fromCoord(state.vpt, obj.pos);
  Draw.render(spr, vpt_adj_xy.x, vpt_adj_xy.y);
  if (Keys.check_bbox_enabled(undefined)) {
    Draw.renderBbox(spr, vpt_adj_xy.x, vpt_adj_xy.y);
  }
  if (obj.vel.x !== 0 || !$$Object.isEnemy(collid)) {
    Sprite.updateAnimation(spr);
  }
  return evolved;
}

function runUpdateCollid(state, collid, all_collids) {
  var match = collid.objTyp;
  if (match.TAG) {
    var obj = collid.obj;
    var evolved = updateCollidable(state, collid, all_collids);
    if (!obj.kill) {
      collid_objs.contents = /* :: */{
        _0: collid,
        _1: Pervasives.$at(evolved, collid_objs.contents)
      };
    }
    var new_parts = obj.kill ? $$Object.kill(collid) : /* [] */0;
    particles.contents = Pervasives.$at(new_parts, particles.contents);
    return collid;
  }
  var o = collid.obj;
  var n = match._1;
  var keys = Keys.translate_keys(n);
  o.crouch = false;
  var match$1 = $$Object.updatePlayer(o, keys);
  var player;
  if (match$1 !== undefined) {
    var new_spr = match$1[1];
    $$Object.normalizePos(o.pos, collid.sprite.params, new_spr.params);
    player = {
      objTyp: {
        TAG: /* Player */0,
        _0: match$1[0],
        _1: n
      },
      sprite: new_spr,
      obj: collid.obj
    };
  } else {
    player = collid;
  }
  var evolved$1 = updateCollidable(state, player, all_collids);
  collid_objs.contents = Pervasives.$at(evolved$1, collid_objs.contents);
  return player;
}

function runUpdateParticle(state, part) {
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
  var player1 = param[0];
  var viewport = Viewport.make(Load.getCanvasSizeScaled(undefined), Config.mapDim);
  var state = {
    bgd: Sprite.makeBgd(undefined),
    vpt: Viewport.update(viewport, player1.obj.pos),
    map: Config.mapDim[1],
    score: 0,
    coins: 0,
    multiplier: 1,
    status: /* Playing */0
  };
  var updateHelper = function (time, state, player1, player2, objs, parts) {
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
                return updateHelper(t, state, player1, player2, collid_objs.contents, particles.contents);
              });
          return ;
        }
        var match = Generator.generate(undefined);
        return updateLoop([
                    match[0],
                    match[1],
                    match[2]
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
    var player1$1 = runUpdateCollid(state, player1, /* :: */{
          _0: player2,
          _1: objs
        });
    var player2$1 = runUpdateCollid(state, player2, /* :: */{
          _0: player1$1,
          _1: objs
        });
    if (player1$1.obj.kill === true) {
      var match$1 = state.status;
      if (typeof match$1 === "number") {
        state.status = /* Lost */{
          _0: time
        };
      }
      
    }
    var state$1 = {
      bgd: state.bgd,
      vpt: Viewport.update(state.vpt, player1$1.obj.pos),
      map: state.map,
      score: state.score,
      coins: state.coins,
      multiplier: state.multiplier,
      status: state.status
    };
    Belt_List.forEach(objs, (function (obj) {
            return runUpdateCollid(state$1, obj, objs);
          }));
    Belt_List.forEach(parts, (function (part) {
            return runUpdateParticle(state$1, part);
          }));
    Draw.fps(fps);
    Draw.hud(state$1.score, state$1.coins);
    requestAnimationFrame(function (t) {
          return updateHelper(t, state$1, player1$1, player2$1, collid_objs.contents, particles.contents);
        });
    
  };
  return updateHelper(0, state, player1, param[1], param[2], /* [] */0);
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
  viewportFilter ,
  broadPhase ,
  narrowPhase ,
  checkCollisions ,
  updateCollidable ,
  runUpdateCollid ,
  runUpdateParticle ,
  updateLoop ,
  
}
/* Object Not a pure module */
