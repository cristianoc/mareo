type actor =
  | Mario 
  (* Enemies *)
  | Goomba
  | GKoopa
  | RKoopa
  | GKoopaShell
  | RKoopaShell
  (* Block *)
  | QBlock
  | Brick
  | UnBBlock
  (* Items *)
  | Mushroom
  | Flower
  | Coin

type player_state =
  | Standing
  | Jumping
  | Running
  | Crouching