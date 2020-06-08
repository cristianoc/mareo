open Actors;

type part_params = {
  sprite: Sprite.t,
  lifetime: int,
};

type particle = {
  params: part_params,
  pos: Actors.xy,
  vel: Actors.xy,
  acc: Actors.xy,
  mutable kill: bool,
  mutable life: int,
};

/* Converts an x,y [pair] to an Actors.xy record */
let pairToXy = pair => {x: fst(pair), y: snd(pair)};

// Function wrapper to assist in generating the template paramss for a
// particle.
let makeParams = (sprite, lifetime) => {sprite, lifetime};

/* Generate the template for a specific particle type */
let makeType = typ =>
  makeParams(
    Sprite.makeParticle(typ),
    switch (typ) {
    | BrickChunkL
    | BrickChunkR => 300
    | GoombaSquish
    | Score100
    | Score200
    | Score400
    | Score800
    | Score1000
    | Score2000
    | Score4000
    | Score8000 => 30
    },
  );

let make = (~vel=(0., 0.), ~acc=(0., 0.), partType, pos) => {
  let params = makeType(partType);
  let pos = pairToXy(pos)
  and vel = pairToXy(vel)
  and acc = pairToXy(acc);
  {params, pos, vel, acc, kill: false, life: params.lifetime};
};

let make_score = (score, pos) => {
  let t =
    switch (score) {
    | 100 => Score100
    | 200 => Score200
    | 400 => Score400
    | 800 => Score800
    | 1000 => Score1000
    | 2000 => Score2000
    | 4000 => Score4000
    | 8000 => Score8000
    | _ => Score100
    };
  make(~vel=(0.5, (-0.7)), t, pos);
};

/* Mutably update the velocity of a particle */
let update_vel = part => {
  part.vel.x = part.vel.x +. part.acc.x;
  part.vel.y = part.vel.y +. part.acc.y;
};

/* Mutably update the position of a particle */
let update_pos = part => {
  part.pos.x = part.vel.x +. part.pos.x;
  part.pos.y = part.vel.y +. part.pos.y;
};

let process = part => {
  part.life = part.life - 1;
  if (part.life == 0) {
    part.kill = true;
  };
  update_vel(part);
  update_pos(part);
};