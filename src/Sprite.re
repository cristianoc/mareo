open Actors;

type xy = (float, float);

type sprite_params = {
  maxFrames: int,
  maxTicks: int,
  imgSrc: string,
  frameSize: xy,
  srcOffset: xy,
  bboxOffset: xy,
  bboxSize: xy,
};

type sprite = {
  mutable params: sprite_params,
  frame: ref(int),
  ticks: ref(int),
  mutable img: Html.imageElement,
};

// setupSprite is used to initialize a sprite.
let setupSprite =
    (
      ~bbOff as bboxOffset=(0., 0.),
      ~bbSz as bboxSize=(0., 0.),
      ~frameSize=(16., 16.),
      ~maxTicks=0,
      ~maxFrames=1,
      ~srcOffset,
      imgSrc,
    ) => {
  let bboxSize =
    if (bboxSize == (0., 0.)) {
      frameSize;
    } else {
      bboxSize;
    };
  let maxFrames = maxFrames < 1 ? 1 : maxFrames;
  let imgSrc = "./sprites/" ++ imgSrc;
  {imgSrc, maxFrames, maxTicks, frameSize, srcOffset, bboxOffset, bboxSize};
};

/*The following functions are used in order to define sprite animations
 *from their sprite sheets. Also creates bounding boxes if necessary.*/
/*Sets sprite for small mario.*/
let make_small_player = ((typ, dir)) =>
  switch (dir) {
  /* 16x16 grid with 0x0 offset*/
  | Left =>
    switch (typ) {
    | Standing =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(3., 1.),
        ~bbSz=(11., 15.),
        ~srcOffset=(0., 0.),
      )
    | Jumping =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(2., 1.),
        ~bbSz=(13., 15.),
        ~maxFrames=2,
        ~maxTicks=10,
        ~srcOffset=(16., 16.),
      )
    | Running =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(2., 1.),
        ~bbSz=(12., 15.),
        ~maxFrames=3,
        ~maxTicks=5,
        ~srcOffset=(16., 0.),
      )
    | Crouching =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(1., 5.),
        ~bbSz=(14., 10.),
        ~srcOffset=(0., 64.),
      )
    }
  | Right =>
    switch (typ) {
    | Standing =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(1., 1.),
        ~bbSz=(11., 15.),
        ~srcOffset=(0., 32.),
      )
    | Jumping =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(2., 1.),
        ~bbSz=(13., 15.),
        ~maxFrames=2,
        ~maxTicks=10,
        ~srcOffset=(16., 48.),
      )
    | Running =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(2., 1.),
        ~bbSz=(12., 15.),
        ~maxFrames=3,
        ~maxTicks=5,
        ~srcOffset=(16., 32.),
      )
    | Crouching =>
      setupSprite(
        "mario-small.png",
        ~bbOff=(1., 5.),
        ~bbSz=(14., 10.),
        ~srcOffset=(0., 64.),
      )
    }
  };

/*Sets sprite for big mario.*/
let make_big_player = ((typ, dir)) =>
  switch (dir) {
  | Left =>
    switch (typ) {
    | Standing =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(2., 1.),
        ~bbSz=(13., 25.),
        ~frameSize=(16., 27.),
        ~srcOffset=(16., 5.),
      )
    | Jumping =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(2., 1.),
        ~bbSz=(12., 25.),
        ~frameSize=(16., 26.),
        ~srcOffset=(48., 6.),
      )
    | Running =>
      setupSprite(
        "mario-big.png",
        ~maxFrames=4,
        ~maxTicks=10,
        ~bbOff=(2., 1.),
        ~bbSz=(13., 25.),
        ~frameSize=(16., 27.),
        ~srcOffset=(0., 37.),
      )
    | Crouching =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(2., 10.),
        ~bbSz=(13., 17.),
        ~frameSize=(16., 27.),
        ~srcOffset=(32., 5.),
      )
    }
  | Right =>
    switch (typ) {
    | Standing =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(1., 1.),
        ~bbSz=(13., 25.),
        ~frameSize=(16., 26.),
        ~srcOffset=(16., 69.),
      )
    | Jumping =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(2., 1.),
        ~bbSz=(12., 25.),
        ~frameSize=(16., 26.),
        ~srcOffset=(48., 70.),
      )
    | Running =>
      setupSprite(
        "mario-big.png",
        ~maxFrames=4,
        ~maxTicks=10,
        ~bbOff=(2., 1.),
        ~bbSz=(13., 25.),
        ~frameSize=(16., 27.),
        ~srcOffset=(0., 101.),
      )
    | Crouching =>
      setupSprite(
        "mario-big.png",
        ~bbOff=(2., 10.),
        ~bbSz=(13., 17.),
        ~frameSize=(16., 27.),
        ~srcOffset=(32., 69.),
      )
    }
  };

/*Sets sprites for enemies: Goomba, Red Koopa, Green Koopa.*/
let make_enemy = ((typ, dir)) =>
  switch (typ, dir) {
  | (Goomba, _) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(1., 1.),
      ~bbSz=(14., 14.),
      ~maxFrames=2,
      ~maxTicks=10,
      ~srcOffset=(0., 128.),
    )
  | (GKoopa, Left) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(4., 10.),
      ~bbSz=(11., 16.),
      ~maxFrames=2,
      ~maxTicks=10,
      ~frameSize=(16., 27.),
      ~srcOffset=(0., 69.),
    )
  | (GKoopa, Right) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(1., 10.),
      ~bbSz=(11., 16.),
      ~maxFrames=2,
      ~maxTicks=10,
      ~frameSize=(16., 27.),
      ~srcOffset=(32., 69.),
    )
  | (RKoopa, Left) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(4., 10.),
      ~bbSz=(11., 16.),
      ~maxFrames=2,
      ~maxTicks=10,
      ~frameSize=(16., 27.),
      ~srcOffset=(0., 5.),
    )
  | (RKoopa, Right) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(1., 10.),
      ~bbSz=(11., 16.),
      ~maxFrames=2,
      ~maxTicks=10,
      ~frameSize=(16., 27.),
      ~srcOffset=(32., 5.),
    )
  | (GKoopaShell, _) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(2., 2.),
      ~bbSz=(12., 13.),
      ~maxFrames=4,
      ~maxTicks=10,
      ~srcOffset=(0., 96.),
    )
  | (RKoopaShell, _) =>
    setupSprite(
      "enemies.png",
      ~bbOff=(2., 2.),
      ~bbSz=(12., 13.),
      ~maxFrames=4,
      ~maxTicks=10,
      ~srcOffset=(0., 32.),
    )
  };

/*Sets sprites for items: coin, fireflower, mushroom, star.*/
let make_item =
  fun
  /* 16x16 grid with 0x0 offset */
  | Coin =>
    setupSprite(
      "items.png",
      ~bbOff=(3., 0.),
      ~bbSz=(12., 16.),
      ~maxFrames=3,
      ~maxTicks=15,
      ~srcOffset=(0., 80.),
    )
  | Mushroom =>
    setupSprite(
      "items.png",
      ~bbOff=(2., 0.),
      ~bbSz=(12., 16.),
      ~srcOffset=(0., 0.),
    );

/*Sets sprites for blocks: brick, question block, unbreakable block, cloud block
 * panel block, ground block.*/
let make_block =
  fun
  /* 16x16 grid with 0x0 offset */
  | Brick =>
    setupSprite(
      "blocks.png",
      ~maxFrames=5,
      ~maxTicks=10,
      ~srcOffset=(0., 0.),
    )
  | QBlock(_) =>
    setupSprite(
      "blocks.png",
      ~maxFrames=4,
      ~maxTicks=15,
      ~srcOffset=(0., 16.),
    )
  | QBlockUsed => setupSprite("blocks.png", ~srcOffset=(0., 32.))
  | UnBBlock => setupSprite("blocks.png", ~srcOffset=(0., 48.))
  | Cloud => setupSprite("blocks.png", ~srcOffset=(0., 64.))
  | Panel =>
    setupSprite(
      "panel.png",
      ~maxFrames=3,
      ~maxTicks=15,
      ~frameSize=(26., 26.),
      ~srcOffset=(0., 0.),
    )
  | Ground => setupSprite("ground.png", ~srcOffset=(0., 32.));

/*Sets sprites for particles, squished goomba, brick chunks (upon destruction
 * of brick), score text.*/
let make_particle =
  fun
  | GoombaSquish => setupSprite("enemies.png", ~srcOffset=(0., 144.))
  | BrickChunkL =>
    setupSprite("chunks.png", ~frameSize=(8., 8.), ~srcOffset=(0., 0.))
  | BrickChunkR =>
    setupSprite("chunks.png", ~frameSize=(8., 8.), ~srcOffset=(8., 0.))
  | Score100 =>
    setupSprite("score.png", ~frameSize=(12., 8.), ~srcOffset=(0., 0.))
  | Score200 =>
    setupSprite("score.png", ~frameSize=(12., 9.), ~srcOffset=(0., 9.))
  | Score400 =>
    setupSprite("score.png", ~frameSize=(12., 9.), ~srcOffset=(0., 18.))
  | Score800 =>
    setupSprite("score.png", ~frameSize=(12., 9.), ~srcOffset=(0., 27.))
  | Score1000 =>
    setupSprite("score.png", ~frameSize=(14., 9.), ~srcOffset=(13., 0.))
  | Score2000 =>
    setupSprite("score.png", ~frameSize=(14., 9.), ~srcOffset=(13., 9.))
  | Score4000 =>
    setupSprite("score.png", ~frameSize=(14., 9.), ~srcOffset=(13., 18.))
  | Score8000 =>
    setupSprite("score.png", ~frameSize=(14., 9.), ~srcOffset=(13., 27.));

/*Calls to set sprite for either big or small mario.*/
let make_player = (pt, spr_type) =>
  switch (pt) {
  | BigM => make_big_player(spr_type)
  | SmallM => make_small_player(spr_type)
  };

/*Calls to set sprites for each type of object.*/
let make_type = (typ, dir: Actors.dir_1d) =>
  switch (typ) {
  | SPlayer(pt, st) => make_player(pt, (st, dir))
  | SEnemy(t) => make_enemy((t, dir))
  | SItem(t) => make_item(t)
  | SBlock(t) => make_block(t)
  };

/* Makes a sprite from provided [params]. */
let make_from_params = params => {
  let img = Html.createImg(Html.document);
  img.src = params.imgSrc;
  {params, img, frame: ref(0), ticks: ref(0)};
};

/*Make is the wrapper function to cycle through sprite animations*/
let make = (spawn, dir) => {
  let params = make_type(spawn, dir);
  make_from_params(params);
};

/* Make a background */
let make_bgd = () => {
  let params =
    setupSprite("bgd-1.png", ~frameSize=(512., 256.), ~srcOffset=(0., 0.));
  make_from_params(params);
};

/* Make a particle from the given particle type */
let make_particle = ptyp => {
  let params = make_particle(ptyp);
  make_from_params(params);
};

/*Transform_enemy is used in order to switch the direction an enemy faces.*/
let transform_enemy = (enemy_typ, spr, dir) => {
  let params = make_enemy((enemy_typ, dir));
  let img = Html.createImg(Html.document);
  img.src = params.imgSrc;
  spr.params = params;
  spr.img = img;
};

/*update_animation is the main method to cycle through sprite animations*/
let update_animation = (spr: sprite) => {
  /* Only advance frame when ticked */
  let curr_ticks = spr.ticks^;
  if (curr_ticks >= spr.params.maxTicks) {
    spr.ticks := 0;
    spr.frame := [@doesNotRaise] ((spr.frame^ + 1) mod spr.params.maxFrames);
  } else {
    spr.ticks := curr_ticks + 1;
  };
};