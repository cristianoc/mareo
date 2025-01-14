

import * as Draw from "./Draw.js";
import * as Keys from "./Keys.js";
import * as Load from "./Load.js";
import * as Config from "./Config.js";
import * as $$Object from "./Object.js";
import * as Sprite from "./Sprite.js";
import * as Particle from "./Particle.js";
import * as Viewport from "./Viewport.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as Generator from "./Generator.js";
import * as Caml_int32 from "rescript/lib/es6/caml_int32.js";
import * as Pervasives from "rescript/lib/es6/pervasives.js";

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

function playerAttackEnemy(o1, enemyTyp, s2, o2, state) {
  o1.invuln = 10;
  o1.jumping = false;
  o1.grounded = true;
  if (enemyTyp >= 3) {
    var r2 = $$Object.evolveEnemy(o1.dir, enemyTyp, s2, o2);
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
            $$Object.evolveEnemy(o1.dir, enemyTyp, s2, o2)
          ];
  }
  var score = Math.imul(100, state.multiplier);
  updateScore(state, score);
  o2.score = score;
  state.multiplier = (state.multiplier << 1);
  return [
          undefined,
          $$Object.evolveEnemy(o1.dir, enemyTyp, s2, o2)
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

function processCollision(dir, obj1, obj2, state) {
  var t2;
  var t1 = obj1.objTyp;
  switch (t1.TAG | 0) {
    case /* Player */0 :
        var t = obj2.objTyp;
        switch (t.TAG | 0) {
          case /* Player */0 :
              if (dir >= 2) {
                obj2.vx = obj2.vx + obj1.vx;
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
          case /* Enemy */1 :
              var typ = t._0;
              var s2 = obj2.sprite;
              if (dir !== 1) {
                return enemyAttackPlayer(obj1, typ, s2, obj2);
              } else {
                return playerAttackEnemy(obj1, typ, s2, obj2, state);
              }
          case /* Item */2 :
              t2 = t._0;
              break;
          case /* Block */3 :
              var t$1 = t._0;
              if (dir !== 0) {
                if (t$1 === 4) {
                  state.status = /* Finished */{
                    levelResult: /* Won */0,
                    finishTime: performance.now()
                  };
                  return [
                          undefined,
                          undefined
                        ];
                } else if (dir !== 1) {
                  $$Object.collideBlock(dir, obj1);
                  return [
                          undefined,
                          undefined
                        ];
                } else {
                  state.multiplier = 1;
                  $$Object.collideBlock(dir, obj1);
                  return [
                          undefined,
                          undefined
                        ];
                }
              }
              if (typeof t$1 === "number") {
                if (t$1 !== 1) {
                  if (t$1 !== 4) {
                    $$Object.collideBlock(dir, obj1);
                    return [
                            undefined,
                            undefined
                          ];
                  } else {
                    state.status = /* Finished */{
                      levelResult: /* Won */0,
                      finishTime: performance.now()
                    };
                    return [
                            undefined,
                            undefined
                          ];
                  }
                } else if (t1._0 === /* BigM */0) {
                  $$Object.collideBlock(dir, obj1);
                  $$Object.decHealth(obj2);
                  return [
                          undefined,
                          undefined
                        ];
                } else {
                  $$Object.collideBlock(dir, obj1);
                  return [
                          undefined,
                          undefined
                        ];
                }
              }
              var updatedBlock = $$Object.evolveBlock(obj2);
              var spawnedItem = $$Object.spawnAbove(obj1.dir, obj2, t$1._0);
              $$Object.collideBlock(dir, obj1);
              return [
                      spawnedItem,
                      updatedBlock
                    ];
          
        }
        break;
    case /* Enemy */1 :
        var t1$1 = t1._0;
        var s1 = obj1.sprite;
        var t2$1 = obj2.objTyp;
        switch (t2$1.TAG | 0) {
          case /* Player */0 :
              if (dir !== 0) {
                return enemyAttackPlayer(obj1, t1$1, s1, obj2);
              } else {
                return playerAttackEnemy(obj1, t1$1, s1, obj2, state);
              }
          case /* Enemy */1 :
              var s2$1 = obj2.sprite;
              return collEnemyEnemy(t1$1, s1, obj1, t2$1._0, s2$1, obj2, dir);
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
                      $$Object.revDir(obj1, t1$1, s1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      $$Object.decHealth(obj2);
                      $$Object.reverseLeftRight(obj1);
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updatedBlock$1 = $$Object.evolveBlock(obj2);
                  var spawnedItem$1 = $$Object.spawnAbove(obj1.dir, obj2, t2$2._0);
                  $$Object.revDir(obj1, t1$1, s1);
                  return [
                          updatedBlock$1,
                          spawnedItem$1
                        ];
                }
                $$Object.revDir(obj1, t1$1, s1);
                return [
                        undefined,
                        undefined
                      ];
              }
              $$Object.collideBlock(dir, obj1);
              return [
                      undefined,
                      undefined
                    ];
          
        }
    case /* Item */2 :
        var match = obj2.objTyp;
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
                $$Object.reverseLeftRight(obj1);
                return [
                        undefined,
                        undefined
                      ];
              } else {
                $$Object.collideBlock(dir, obj1);
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
    $$Object.decHealth(obj2);
    updateScore(state, 100);
    return [
            undefined,
            undefined
          ];
  } else {
    $$Object.decHealth(obj2);
    if (obj1.health === 2) {
      
    } else {
      obj1.health = obj1.health + 1 | 0;
    }
    obj1.vx = 0;
    obj1.vy = 0;
    updateScore(state, 1000);
    obj2.score = 1000;
    return [
            undefined,
            undefined
          ];
  }
}

function viewportFilter(obj, state) {
  if (Viewport.inViewport(state.viewport, obj.px, obj.py) || $$Object.isPlayer(obj)) {
    return true;
  } else {
    return Viewport.outOfViewportBelow(state.viewport, obj.py);
  }
}

function broadPhase(allCollids, state) {
  return Belt_List.keep(allCollids, (function (o) {
                return viewportFilter(o, state);
              }));
}

function narrowPhase(obj, cs, state) {
  var _cs = cs;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var cs$1 = _cs;
    if (!cs$1) {
      return acc;
    }
    var h = cs$1.hd;
    var newObjs;
    if ($$Object.equals(obj, h)) {
      newObjs = [
        undefined,
        undefined
      ];
    } else {
      var dir = $$Object.checkCollision(obj, h);
      newObjs = dir !== undefined && h.id !== obj.id ? processCollision(dir, obj, h, state) : [
          undefined,
          undefined
        ];
    }
    var o = newObjs[0];
    var acc$1;
    if (o !== undefined) {
      var o2 = newObjs[1];
      acc$1 = o2 !== undefined ? ({
            hd: o,
            tl: {
              hd: o2,
              tl: acc
            }
          }) : ({
            hd: o,
            tl: acc
          });
    } else {
      var o$1 = newObjs[1];
      acc$1 = o$1 !== undefined ? ({
            hd: o$1,
            tl: acc
          }) : acc;
    }
    _acc = acc$1;
    _cs = cs$1.tl;
    continue ;
  };
}

function checkCollisions(obj, state, objects) {
  var match = obj.objTyp;
  if (match.TAG === /* Block */3) {
    return /* [] */0;
  }
  var broad = broadPhase(objects, state);
  return narrowPhase(obj, broad, state);
}

function updateObject0(obj, state, objects, level) {
  var spr = obj.sprite;
  obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
  if (!((!obj.kill || $$Object.isPlayer(obj)) && viewportFilter(obj, state))) {
    return /* [] */0;
  }
  obj.grounded = false;
  $$Object.processObj(obj, level);
  var evolved = checkCollisions(obj, state, objects);
  var vptAdjXy = Viewport.fromCoord(state.viewport, obj.px, obj.py);
  Draw.render(spr, vptAdjXy.x, vptAdjXy.y);
  if (Keys.checkBboxEnabled(undefined)) {
    Draw.renderBbox(spr, vptAdjXy.x, vptAdjXy.y);
  }
  if (obj.vx !== 0 || !$$Object.isEnemy(obj)) {
    Sprite.updateAnimation(spr);
  }
  return evolved;
}

function updateObject(obj, state, objects, level) {
  var match = obj.objTyp;
  if (match.TAG === /* Player */0) {
    var n = match._1;
    var keys = Keys.translateKeys(n);
    obj.crouch = false;
    $$Object.updatePlayer(obj, n, keys);
    var evolved = updateObject0(obj, state, objects, level);
    collidObjs.contents = Pervasives.$at(evolved, collidObjs.contents);
    return ;
  }
  var evolved$1 = updateObject0(obj, state, objects, level);
  if (!obj.kill) {
    collidObjs.contents = {
      hd: obj,
      tl: Pervasives.$at(evolved$1, collidObjs.contents)
    };
  }
  var newParts = obj.kill ? $$Object.kill(obj) : /* [] */0;
  particles.contents = Pervasives.$at(newParts, particles.contents);
  
}

function updateParticle(state, part) {
  Particle.$$process(part);
  var x = part.px - state.viewport.px;
  var y = part.py - state.viewport.py;
  Draw.render(part.params.sprite, x, y);
  if (!part.kill) {
    particles.contents = {
      hd: part,
      tl: particles.contents
    };
    return ;
  }
  
}

function updateLoop(player1, player2, level, objects) {
  var viewport = Viewport.make(Load.getCanvasSizeScaled(undefined), Config.mapDim(level));
  Viewport.update(viewport, player1.px, player1.py);
  var state = {
    bgd: Sprite.makeBgd(undefined),
    coins: 0,
    level: level,
    multiplier: 1,
    score: 0,
    status: /* Playing */0,
    viewport: viewport
  };
  var updateHelper = function (objects, parts) {
    var match = state.status;
    var exit = 0;
    if (match) {
      var finishTime = match.finishTime;
      if (performance.now() - finishTime > Config.delayWhenFinished) {
        var levelResult = match.levelResult;
        var timeToStart = Config.restartAfter - (performance.now() - finishTime) / 1000;
        if (timeToStart > 0) {
          Draw.levelFinished(levelResult, String(state.level), String(timeToStart | 0));
          requestAnimationFrame(function (param) {
                return updateHelper(collidObjs.contents, particles.contents);
              });
          return ;
        }
        var level$1 = levelResult === /* Won */0 ? level + 1 | 0 : level;
        var match$1 = Generator.generate(level$1);
        return updateLoop(match$1[0], match$1[1], level$1, match$1[2]);
      }
      exit = 1;
    } else {
      exit = 1;
    }
    if (exit === 1) {
      var fps = calcFps(undefined);
      collidObjs.contents = /* [] */0;
      particles.contents = /* [] */0;
      Draw.clearCanvas(undefined);
      var vposXInt = state.viewport.px / 5 | 0;
      var bgdWidth = state.bgd.params.frameSize[0] | 0;
      Draw.drawBgd(state.bgd, Caml_int32.mod_(vposXInt, bgdWidth));
      updateObject(player1, state, {
            hd: player2,
            tl: objects
          }, level);
      updateObject(player2, state, {
            hd: player1,
            tl: objects
          }, level);
      if (player1.kill === true) {
        var match$2 = state.status;
        var exit$1 = 0;
        if (!(match$2 && match$2.levelResult)) {
          exit$1 = 2;
        }
        if (exit$1 === 2) {
          state.status = /* Finished */{
            levelResult: /* Lost */1,
            finishTime: performance.now()
          };
        }
        
      }
      Viewport.update(state.viewport, player1.px, player1.py);
      Belt_List.forEach(objects, (function (obj) {
              return updateObject(obj, state, objects, level);
            }));
      Belt_List.forEach(parts, (function (part) {
              return updateParticle(state, part);
            }));
      Draw.fps(fps);
      Draw.scoreAndCoins(state.score, state.coins);
      requestAnimationFrame(function (param) {
            return updateHelper(collidObjs.contents, particles.contents);
          });
      return ;
    }
    
  };
  return updateHelper(objects, /* [] */0);
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
  updateObject0 ,
  updateObject ,
  updateParticle ,
  updateLoop ,
  
}
/* Object Not a pure module */
