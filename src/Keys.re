open Belt;

/* Represents the values of relevant key bindings. */
type keys = {
  mutable left1: bool,
  mutable right1: bool,
  mutable up1: bool,
  mutable down1: bool,
  mutable left2: bool,
  mutable right2: bool,
  mutable up2: bool,
  mutable down2: bool,
  mutable bbox: int,
};

// pressed_keys instantiates the keys
let pressed_keys = {
  left1: false,
  right1: false,
  up1: false,
  down1: false,
  left2: false,
  right2: false,
  up2: false,
  down2: false,
  bbox: 0,
};

/* Keydown event handler translates a key press */
let keydown = evt => {
  let evt = Html.keyboardEventToJsObj(evt);
  let () =
    switch (evt##keyCode) {
    | 32
    | 38 => pressed_keys.up1 = true
    | 87 => pressed_keys.up2 = true
    | 39 => pressed_keys.right1 = true
    | 68 => pressed_keys.right2 = true
    | 37 => pressed_keys.left1 = true
    | 65 => pressed_keys.left2 = true
    | 40 => pressed_keys.down1 = true
    | 83 => pressed_keys.down2 = true
    | 66 => pressed_keys.bbox = [@doesNotRaise] ((pressed_keys.bbox + 1) mod 2)
    | _ => ()
    };
  true;
};

/* Keyup event handler translates a key release */
let keyup = evt => {
  let evt = Html.keyboardEventToJsObj(evt);
  let () =
    switch (evt##keyCode) {
    | 32
    | 38 => pressed_keys.up1 = false
    | 87 => pressed_keys.up2 = false
    | 39 => pressed_keys.right1 = false
    | 68 => pressed_keys.right2 = false
    | 37 => pressed_keys.left1 = false
    | 65 => pressed_keys.left2 = false
    | 40 => pressed_keys.down1 = false
    | 83 => pressed_keys.down2 = false
    | _ => ()
    };
  true;
};

// Returns whether the bounding box should be drawn
let check_bbox_enabled = () => pressed_keys.bbox == 1;

/* Converts a keypress to a list of control keys, allowing more than one key
 * to be processed each frame. */
let translate_keys = playerNum => {
  let k = pressed_keys;
  let ctrls1 = [
    (k.left1, Actors.CLeft),
    (k.right1, CRight),
    (k.up1, CUp),
    (k.down1, CDown),
  ];
  let ctrls2 = [
    (k.left2, Actors.CLeft),
    (k.right2, CRight),
    (k.up2, CUp),
    (k.down2, CDown),
  ];
  List.reduce(playerNum == Object.One ? ctrls1 : ctrls2, [], (a, x) =>
    if (fst(x)) {
      [snd(x), ...a];
    } else {
      a;
    }
  );
};