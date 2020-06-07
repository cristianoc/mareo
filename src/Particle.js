

import * as Sprite from "./Sprite.js";

function pair_to_xy(pair) {
  return {
          x: pair[0],
          y: pair[1]
        };
}

function make_params(sprite, lifetime) {
  return {
          sprite: sprite,
          lifetime: lifetime
        };
}

function make_type(typ) {
  if (typ === 2 || typ === 1) {
    return {
            sprite: Sprite.make_particle(typ),
            lifetime: 300
          };
  } else {
    return {
            sprite: Sprite.make_particle(typ),
            lifetime: 30
          };
  }
}

function make(velOpt, accOpt, part_type, pos) {
  var vel = velOpt !== undefined ? velOpt : [
      0,
      0
    ];
  var acc = accOpt !== undefined ? accOpt : [
      0,
      0
    ];
  var params = make_type(part_type);
  var pos$1 = pair_to_xy(pos);
  var vel$1 = pair_to_xy(vel);
  var acc$1 = pair_to_xy(acc);
  return {
          params: params,
          pos: pos$1,
          vel: vel$1,
          acc: acc$1,
          kill: false,
          life: params.lifetime
        };
}

function make_score(score, pos) {
  var t = score >= 801 ? (
      score >= 2001 ? (
          score !== 4000 ? (
              score !== 8000 ? /* Score100 */3 : /* Score8000 */10
            ) : /* Score4000 */9
        ) : (
          score !== 1000 ? (
              score >= 2000 ? /* Score2000 */8 : /* Score100 */3
            ) : /* Score1000 */7
        )
    ) : (
      score >= 201 ? (
          score !== 400 ? (
              score >= 800 ? /* Score800 */6 : /* Score100 */3
            ) : /* Score400 */5
        ) : (
          score !== 100 && score >= 200 ? /* Score200 */4 : /* Score100 */3
        )
    );
  return make([
              0.5,
              -0.7
            ], undefined, t, pos);
}

function update_vel(part) {
  part.vel.x = part.vel.x + part.acc.x;
  part.vel.y = part.vel.y + part.acc.y;
  
}

function update_pos(part) {
  part.pos.x = part.vel.x + part.pos.x;
  part.pos.y = part.vel.y + part.pos.y;
  
}

function $$process(part) {
  part.life = part.life - 1 | 0;
  if (part.life === 0) {
    part.kill = true;
  }
  update_vel(part);
  return update_pos(part);
}

export {
  pair_to_xy ,
  make_params ,
  make_type ,
  make ,
  make_score ,
  update_vel ,
  update_pos ,
  $$process ,
  
}
/* No side effect */
