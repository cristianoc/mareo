

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

var collidObjs = {
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

function updateScore(state, i) {
  state.score = state.score + i | 0;
  
}

function playerAttackEnemy(o1, typ, s2, o2, state) {
  o1.invuln = 10;
  o1.jumping = false;
  o1.grounded = true;
  if (typ >= 3) {
    var r2 = $$Object.evolveEnemy(o1.dir, typ, s2, o2);
    o1.vy = -Config.dampenJump;
    o1.py = o1.py - 5;
    return [
            undefined,
            r2
          ];
  }
  $$Object.decHealth(o2);
  o1.vy = -Config.dampenJump;
  if (state.multiplier === 8) {
    updateScore(state, 800);
    o2.score = 800;
    return [
            undefined,
            $$Object.evolveEnemy(o1.dir, typ, s2, o2)
          ];
  }
  var score = Math.imul(100, state.multiplier);
  updateScore(state, score);
  o2.score = score;
  state.multiplier = (state.multiplier << 1);
  return [
          undefined,
          $$Object.evolveEnemy(o1.dir, typ, s2, o2)
        ];
}

function enemyAttackPlayer(o1, t2, s2, o2) {
  if (t2 >= 3) {
    var r2 = o2.vx === 0 ? $$Object.evolveEnemy(o1.dir, t2, s2, o2) : ($$Object.decHealth(o1), o1.invuln = Config.invuln, undefined);
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

function collEnemyEnemy(t1, s1, o1, t2, s2, o2, dir) {
  if (t1 !== 3) {
    if (t1 < 4) {
      if (t2 >= 3) {
        if (o2.vx === 0) {
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
  if (o1.vx === 0) {
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

function processCollision(dir, c1, c2, state) {
  var t2;
  var t1 = c1.objTyp;
  switch (t1.TAG | 0) {
    case /* Player */0 :
        var t = c2.objTyp;
        switch (t.TAG | 0) {
          case /* Player */0 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Enemy */1 :
              var typ = t._0;
              var s2 = c2.sprite;
              if (dir !== 1) {
                return enemyAttackPlayer(c1, typ, s2, c2);
              } else {
                return playerAttackEnemy(c1, typ, s2, c2, state);
              }
          case /* Item */2 :
              t2 = t._0;
              break;
          case /* Block */3 :
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
                    $$Object.collideBlock(dir, c1);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    state.multiplier = 1;
                    $$Object.collideBlock(dir, c1);
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
                      $$Object.collideBlock(dir, c1);
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
                    $$Object.collideBlock(dir, c1);
                    $$Object.decHealth(c2);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    $$Object.collideBlock(dir, c1);
                    return [
                            undefined,
                            undefined
                          ];
                  }
                }
                var updatedBlock = $$Object.evolveBlock(c2);
                var spawnedItem = $$Object.spawnAbove(c1.dir, c2, t$1._0);
                $$Object.collideBlock(dir, c1);
                return [
                        spawnedItem,
                        updatedBlock
                      ];
              }
              break;
          
        }
        break;
    case /* Enemy */1 :
        var t1$1 = t1._0;
        var s1 = c1.sprite;
        var t2$1 = c2.objTyp;
        switch (t2$1.TAG | 0) {
          case /* Player */0 :
              if (dir !== 0) {
                return enemyAttackPlayer(c1, t1$1, s1, c2);
              } else {
                return playerAttackEnemy(c1, t1$1, s1, c2, state);
              }
          case /* Enemy */1 :
              var s2$1 = c2.sprite;
              return collEnemyEnemy(t1$1, s1, c1, t2$1._0, s2$1, c2, dir);
          case /* Item */2 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              var t2$2 = t2$1._0;
              if (dir >= 2) {
                if (t1$1 >= 3) {
                  if (typeof t2$2 === "number") {
                    if (t2$2 !== 1) {
                      $$Object.revDir(c1, t1$1, s1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.decHealth(c2);
                      $$Object.reverseLeftRight(c1);
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updatedBlock$1 = $$Object.evolveBlock(c2);
                  var spawnedItem$1 = $$Object.spawnAbove(c1.dir, c2, t2$2._0);
                  $$Object.revDir(c1, t1$1, s1);
                  return [
                          updatedBlock$1,
                          spawnedItem$1
                        ];
                }
                $$Object.revDir(c1, t1$1, s1);
                return [
                        undefined,
                        undefined
                      ];
              }
              $$Object.collideBlock(dir, c1);
              return [
                      undefined,
                      undefined
                    ];
          
        }
    case /* Item */2 :
        var match = c2.objTyp;
        switch (match.TAG | 0) {
          case /* Player */0 :
              t2 = t1._0;
              break;
          case /* Enemy */1 :
          case /* Item */2 :
              return [
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              if (dir >= 2) {
                $$Object.reverseLeftRight(c1);
                return [
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.collideBlock(dir, c1);
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
    $$Object.decHealth(c2);
    updateScore(state, 100);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.decHealth(c2);
    if (c1.health === 2) {
      
    } else {
      c1.health = c1.health + 1 | 0;
    }
    c1.vx = 0;
    c1.vy = 0;
    updateScore(state, 1000);
    c2.score = 1000;
    return [
            undefined,
            undefined
          ];
  }
}

function viewportFilter(obj, state) {
  if (Viewport.inViewport(state.vpt, obj.px, obj.py) || $$Object.isPlayer(obj)) {
    return true;
  } else {
    return Viewport.outOfViewportBelow(state.vpt, obj.py);
  }
}

function broadPhase(obj, allCollids, state) {
  return Belt_List.keep(allCollids, (function (_c) {
                return viewportFilter(obj, state);
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
    var newObjs;
    if ($$Object.equals(c, h)) {
      newObjs = [
        undefined,
        undefined
      ];
    } else {
      var dir = $$Object.checkCollision(c, h);
      newObjs = dir !== undefined && h.id !== c.id ? processCollision(dir, c, h, state) : [
          undefined,
          undefined
        ];
    }
    var o = newObjs[0];
    var acc$1;
    if (o !== undefined) {
      var o2 = newObjs[1];
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
      var o$1 = newObjs[1];
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

function checkCollisions(obj, allCollids, state) {
  var match = obj.objTyp;
  if (match.TAG === /* Block */3) {
    return /* [] */0;
  }
  var broad = broadPhase(obj, allCollids, state);
  return narrowPhase(obj, broad, state);
}

function updateCollidable(state, obj, allCollids) {
  var spr = obj.sprite;
  obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
  if (!(!obj.kill && viewportFilter(obj, state))) {
    return /* [] */0;
  }
  obj.grounded = false;
  $$Object.processObj(obj, state.map);
  var evolved = checkCollisions(obj, allCollids, state);
  var vptAdjXy = Viewport.fromCoord(state.vpt, obj.px, obj.py);
  Draw.render(spr, vptAdjXy.x, vptAdjXy.y);
  if (Keys.checkBboxEnabled(undefined)) {
    Draw.renderBbox(spr, vptAdjXy.x, vptAdjXy.y);
  }
  if (obj.vx !== 0 || !$$Object.isEnemy(obj)) {
    Sprite.updateAnimation(spr);
  }
  return evolved;
}

function updateOnCollid(state, obj, allCollids) {
  var match = obj.objTyp;
  if (match.TAG) {
    var evolved = updateCollidable(state, obj, allCollids);
    if (!obj.kill) {
      collidObjs.contents = /* :: */{
        _0: obj,
        _1: Pervasives.$at(evolved, collidObjs.contents)
      };
    }
    var newParts = obj.kill ? $$Object.kill(obj) : /* [] */0;
    particles.contents = Pervasives.$at(newParts, particles.contents);
    return ;
  }
  var n = match._1;
  var keys = Keys.translateKeys(n);
  obj.crouch = false;
  var match$1 = $$Object.updatePlayer(obj, keys);
  if (match$1 !== undefined) {
    var newSpr = match$1[1];
    $$Object.normalizePos(obj, obj.sprite.params, newSpr.params);
    obj.objTyp = {
      TAG: /* Player */0,
      _0: match$1[0],
      _1: n
    };
    obj.sprite = newSpr;
  }
  var evolved$1 = updateCollidable(state, obj, allCollids);
  collidObjs.contents = Pervasives.$at(evolved$1, collidObjs.contents);
  
}

function updateParticle(state, part) {
  Particle.$$process(part);
  var x = part.px - Viewport.getPos(state.vpt).x;
  var y = part.py - Viewport.getPos(state.vpt).y;
  Draw.render(part.params.sprite, x, y);
  if (!part.kill) {
    particles.contents = /* :: */{
      _0: part,
      _1: particles.contents
    };
    return ;
  }
  
}

function updateLoop(player1, player2, objs) {
  var viewport = Viewport.make(Load.getCanvasSizeScaled(undefined), Config.mapDim);
  var state = {
    bgd: Sprite.makeBgd(undefined),
    vpt: Viewport.update(viewport, player1.px, player1.py),
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
                return updateHelper(t, state, player1, player2, collidObjs.contents, particles.contents);
              });
          return ;
        }
        var match = Generator.generate(undefined);
        return updateLoop(match[0], match[1], match[2]);
      }
      
    }
    var fps = calcFps(undefined);
    collidObjs.contents = /* [] */0;
    particles.contents = /* [] */0;
    Draw.clearCanvas(undefined);
    var vposXInt = Viewport.getPos(state.vpt).x / 5 | 0;
    var bgdWidth = state.bgd.params.frameSize[0] | 0;
    Draw.drawBgd(state.bgd, Caml_int32.mod_(vposXInt, bgdWidth));
    updateOnCollid(state, player1, /* :: */{
          _0: player2,
          _1: objs
        });
    updateOnCollid(state, player2, /* :: */{
          _0: player1,
          _1: objs
        });
    if (player1.kill === true) {
      var match$1 = state.status;
      if (typeof match$1 === "number") {
        state.status = /* Lost */{
          _0: time
        };
      }
      
    }
    var state$1 = {
      bgd: state.bgd,
      vpt: Viewport.update(state.vpt, player1.px, player1.py),
      map: state.map,
      score: state.score,
      coins: state.coins,
      multiplier: state.multiplier,
      status: state.status
    };
    Belt_List.forEach(objs, (function (obj) {
            return updateOnCollid(state$1, obj, objs);
          }));
    Belt_List.forEach(parts, (function (part) {
            return updateParticle(state$1, part);
          }));
    Draw.fps(fps);
    Draw.hud(state$1.score, state$1.coins);
    requestAnimationFrame(function (t) {
          return updateHelper(t, state$1, player1, player2, collidObjs.contents, particles.contents);
        });
    
  };
  return updateHelper(0, state, player1, player2, objs, /* [] */0);
}

export {
  collidObjs ,
  particles ,
  lastTime ,
  initialTime ,
  calcFps ,
  updateScore ,
  playerAttackEnemy ,
  enemyAttackPlayer ,
  collEnemyEnemy ,
  processCollision ,
  viewportFilter ,
  broadPhase ,
  narrowPhase ,
  checkCollisions ,
  updateCollidable ,
  updateOnCollid ,
  updateParticle ,
  updateLoop ,
  
}
/* Object Not a pure module */
