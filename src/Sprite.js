

import * as Caml_obj from "bs-platform/lib/es6/caml_obj.js";
import * as Caml_int32 from "bs-platform/lib/es6/caml_int32.js";

function setupSprite(bboxOffsetOpt, bboxSizeOpt, frameSizeOpt, maxTicksOpt, maxFramesOpt, srcOffset, imgSrc) {
  var bboxOffset = bboxOffsetOpt !== undefined ? bboxOffsetOpt : [
      0,
      0
    ];
  var bboxSize = bboxSizeOpt !== undefined ? bboxSizeOpt : [
      0,
      0
    ];
  var frameSize = frameSizeOpt !== undefined ? frameSizeOpt : [
      16,
      16
    ];
  var maxTicks = maxTicksOpt !== undefined ? maxTicksOpt : 0;
  var maxFrames = maxFramesOpt !== undefined ? maxFramesOpt : 1;
  var bboxSize$1 = Caml_obj.caml_equal(bboxSize, [
        0,
        0
      ]) ? frameSize : bboxSize;
  var maxFrames$1 = maxFrames < 1 ? 1 : maxFrames;
  var imgSrc$1 = "./sprites/" + imgSrc;
  return {
          maxFrames: maxFrames$1,
          maxTicks: maxTicks,
          imgSrc: imgSrc$1,
          frameSize: frameSize,
          srcOffset: srcOffset,
          bboxOffset: bboxOffset,
          bboxSize: bboxSize$1
        };
}

function makeSmallPlayer(typ, dir) {
  if (dir) {
    switch (typ) {
      case /* Standing */0 :
          return setupSprite([
                      1,
                      1
                    ], [
                      11,
                      15
                    ], undefined, undefined, undefined, [
                      0,
                      32
                    ], "mario-small.png");
      case /* Jumping */1 :
          return setupSprite([
                      2,
                      1
                    ], [
                      13,
                      15
                    ], undefined, 10, 2, [
                      16,
                      48
                    ], "mario-small.png");
      case /* Running */2 :
          return setupSprite([
                      2,
                      1
                    ], [
                      12,
                      15
                    ], undefined, 5, 3, [
                      16,
                      32
                    ], "mario-small.png");
      case /* Crouching */3 :
          return setupSprite([
                      1,
                      5
                    ], [
                      14,
                      10
                    ], undefined, undefined, undefined, [
                      0,
                      64
                    ], "mario-small.png");
      
    }
  } else {
    switch (typ) {
      case /* Standing */0 :
          return setupSprite([
                      3,
                      1
                    ], [
                      11,
                      15
                    ], undefined, undefined, undefined, [
                      0,
                      0
                    ], "mario-small.png");
      case /* Jumping */1 :
          return setupSprite([
                      2,
                      1
                    ], [
                      13,
                      15
                    ], undefined, 10, 2, [
                      16,
                      16
                    ], "mario-small.png");
      case /* Running */2 :
          return setupSprite([
                      2,
                      1
                    ], [
                      12,
                      15
                    ], undefined, 5, 3, [
                      16,
                      0
                    ], "mario-small.png");
      case /* Crouching */3 :
          return setupSprite([
                      1,
                      5
                    ], [
                      14,
                      10
                    ], undefined, undefined, undefined, [
                      0,
                      64
                    ], "mario-small.png");
      
    }
  }
}

function makeBigPlayer(typ, dir) {
  if (dir) {
    switch (typ) {
      case /* Standing */0 :
          return setupSprite([
                      1,
                      1
                    ], [
                      13,
                      25
                    ], [
                      16,
                      26
                    ], undefined, undefined, [
                      16,
                      69
                    ], "mario-big.png");
      case /* Jumping */1 :
          return setupSprite([
                      2,
                      1
                    ], [
                      12,
                      25
                    ], [
                      16,
                      26
                    ], undefined, undefined, [
                      48,
                      70
                    ], "mario-big.png");
      case /* Running */2 :
          return setupSprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], [
                      16,
                      27
                    ], 10, 4, [
                      0,
                      101
                    ], "mario-big.png");
      case /* Crouching */3 :
          return setupSprite([
                      2,
                      10
                    ], [
                      13,
                      17
                    ], [
                      16,
                      27
                    ], undefined, undefined, [
                      32,
                      69
                    ], "mario-big.png");
      
    }
  } else {
    switch (typ) {
      case /* Standing */0 :
          return setupSprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], [
                      16,
                      27
                    ], undefined, undefined, [
                      16,
                      5
                    ], "mario-big.png");
      case /* Jumping */1 :
          return setupSprite([
                      2,
                      1
                    ], [
                      12,
                      25
                    ], [
                      16,
                      26
                    ], undefined, undefined, [
                      48,
                      6
                    ], "mario-big.png");
      case /* Running */2 :
          return setupSprite([
                      2,
                      1
                    ], [
                      13,
                      25
                    ], [
                      16,
                      27
                    ], 10, 4, [
                      0,
                      37
                    ], "mario-big.png");
      case /* Crouching */3 :
          return setupSprite([
                      2,
                      10
                    ], [
                      13,
                      17
                    ], [
                      16,
                      27
                    ], undefined, undefined, [
                      32,
                      5
                    ], "mario-big.png");
      
    }
  }
}

function makeEnemy(typ, dir) {
  switch (typ) {
    case /* Goomba */0 :
        return setupSprite([
                    1,
                    1
                  ], [
                    14,
                    14
                  ], undefined, 10, 2, [
                    0,
                    128
                  ], "enemies.png");
    case /* GKoopa */1 :
        if (dir) {
          return setupSprite([
                      1,
                      10
                    ], [
                      11,
                      16
                    ], [
                      16,
                      27
                    ], 10, 2, [
                      32,
                      69
                    ], "enemies.png");
        } else {
          return setupSprite([
                      4,
                      10
                    ], [
                      11,
                      16
                    ], [
                      16,
                      27
                    ], 10, 2, [
                      0,
                      69
                    ], "enemies.png");
        }
    case /* RKoopa */2 :
        if (dir) {
          return setupSprite([
                      1,
                      10
                    ], [
                      11,
                      16
                    ], [
                      16,
                      27
                    ], 10, 2, [
                      32,
                      5
                    ], "enemies.png");
        } else {
          return setupSprite([
                      4,
                      10
                    ], [
                      11,
                      16
                    ], [
                      16,
                      27
                    ], 10, 2, [
                      0,
                      5
                    ], "enemies.png");
        }
    case /* GKoopaShell */3 :
        return setupSprite([
                    2,
                    2
                  ], [
                    12,
                    13
                  ], undefined, 10, 4, [
                    0,
                    96
                  ], "enemies.png");
    case /* RKoopaShell */4 :
        return setupSprite([
                    2,
                    2
                  ], [
                    12,
                    13
                  ], undefined, 10, 4, [
                    0,
                    32
                  ], "enemies.png");
    
  }
}

function makeItem(param) {
  if (param) {
    return setupSprite([
                3,
                0
              ], [
                12,
                16
              ], undefined, 15, 3, [
                0,
                80
              ], "items.png");
  } else {
    return setupSprite([
                2,
                0
              ], [
                12,
                16
              ], undefined, undefined, undefined, [
                0,
                0
              ], "items.png");
  }
}

var brickParams = setupSprite(undefined, undefined, undefined, 10, 5, [
      0,
      0
    ], "blocks.png");

var qBlockParams = setupSprite(undefined, undefined, undefined, 15, 4, [
      0,
      16
    ], "blocks.png");

var qBlockUsedParams = setupSprite(undefined, undefined, undefined, undefined, undefined, [
      0,
      32
    ], "blocks.png");

var unBBlockParams = setupSprite(undefined, undefined, undefined, undefined, undefined, [
      0,
      48
    ], "blocks.png");

var cloudParams = setupSprite(undefined, undefined, undefined, undefined, undefined, [
      0,
      64
    ], "blocks.png");

var panelParams = setupSprite(undefined, undefined, [
      26,
      26
    ], 15, 3, [
      0,
      0
    ], "panel.png");

var groundParams = setupSprite(undefined, undefined, undefined, undefined, undefined, [
      0,
      32
    ], "ground.png");

function makeParams(param) {
  if (typeof param !== "number") {
    return qBlockParams;
  }
  switch (param) {
    case /* QBlockUsed */0 :
        return qBlockUsedParams;
    case /* Brick */1 :
        return brickParams;
    case /* UnBBlock */2 :
        return unBBlockParams;
    case /* Cloud */3 :
        return cloudParams;
    case /* Panel */4 :
        return panelParams;
    case /* Ground */5 :
        return groundParams;
    
  }
}

function makeParticle(param) {
  switch (param) {
    case /* GoombaSquish */0 :
        return setupSprite(undefined, undefined, undefined, undefined, undefined, [
                    0,
                    144
                  ], "enemies.png");
    case /* BrickChunkL */1 :
        return setupSprite(undefined, undefined, [
                    8,
                    8
                  ], undefined, undefined, [
                    0,
                    0
                  ], "chunks.png");
    case /* BrickChunkR */2 :
        return setupSprite(undefined, undefined, [
                    8,
                    8
                  ], undefined, undefined, [
                    8,
                    0
                  ], "chunks.png");
    case /* Score100 */3 :
        return setupSprite(undefined, undefined, [
                    12,
                    8
                  ], undefined, undefined, [
                    0,
                    0
                  ], "score.png");
    case /* Score200 */4 :
        return setupSprite(undefined, undefined, [
                    12,
                    9
                  ], undefined, undefined, [
                    0,
                    9
                  ], "score.png");
    case /* Score400 */5 :
        return setupSprite(undefined, undefined, [
                    12,
                    9
                  ], undefined, undefined, [
                    0,
                    18
                  ], "score.png");
    case /* Score800 */6 :
        return setupSprite(undefined, undefined, [
                    12,
                    9
                  ], undefined, undefined, [
                    0,
                    27
                  ], "score.png");
    case /* Score1000 */7 :
        return setupSprite(undefined, undefined, [
                    14,
                    9
                  ], undefined, undefined, [
                    13,
                    0
                  ], "score.png");
    case /* Score2000 */8 :
        return setupSprite(undefined, undefined, [
                    14,
                    9
                  ], undefined, undefined, [
                    13,
                    9
                  ], "score.png");
    case /* Score4000 */9 :
        return setupSprite(undefined, undefined, [
                    14,
                    9
                  ], undefined, undefined, [
                    13,
                    18
                  ], "score.png");
    case /* Score8000 */10 :
        return setupSprite(undefined, undefined, [
                    14,
                    9
                  ], undefined, undefined, [
                    13,
                    27
                  ], "score.png");
    
  }
}

function makePlayer(plSize, typ, dir) {
  if (plSize) {
    return makeSmallPlayer(typ, dir);
  } else {
    return makeBigPlayer(typ, dir);
  }
}

function makeFromParams(params) {
  var img = document.createElement("img");
  img.src = params.imgSrc;
  return {
          params: params,
          frame: 0,
          ticks: 0,
          img: img
        };
}

function makeBgd(param) {
  return makeFromParams(setupSprite(undefined, undefined, [
                  512,
                  256
                ], undefined, undefined, [
                  0,
                  0
                ], "bgd-1.png"));
}

function makeParticle$1(ptyp) {
  return makeFromParams(makeParticle(ptyp));
}

function transformEnemy(enemy_typ, spr, dir) {
  var params = makeEnemy(enemy_typ, dir);
  var img = document.createElement("img");
  img.src = params.imgSrc;
  spr.params = params;
  spr.img = img;
  
}

function updateAnimation(spr) {
  var curr_ticks = spr.ticks;
  if (curr_ticks >= spr.params.maxTicks) {
    spr.ticks = 0;
    spr.frame = Caml_int32.mod_(spr.frame + 1 | 0, spr.params.maxFrames);
  } else {
    spr.ticks = curr_ticks + 1 | 0;
  }
  
}

export {
  setupSprite ,
  makeSmallPlayer ,
  makeBigPlayer ,
  makeEnemy ,
  makeItem ,
  brickParams ,
  qBlockParams ,
  qBlockUsedParams ,
  unBBlockParams ,
  cloudParams ,
  panelParams ,
  groundParams ,
  makeParams ,
  makePlayer ,
  makeFromParams ,
  makeBgd ,
  makeParticle$1 as makeParticle,
  transformEnemy ,
  updateAnimation ,
  
}
/* brickParams Not a pure module */
