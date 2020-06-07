open Belt;

/* Represents the values of relevant key bindings. */
type keys = {
  mutable left: bool,
  mutable right: bool,
  mutable up: bool,
  mutable down: bool,
  mutable bbox: int,
};

// pressed_keys instantiates the keys
let pressed_keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  bbox: 0,
};

/* Keydown event handler translates a key press */
let keydown = evt => {
  let evt = Html.keyboardEventToJsObj(evt);
  let () =
    switch (evt##keyCode) {
    | 38
    | 32
    | 87 => pressed_keys.up = true
    | 39
    | 68 => pressed_keys.right = true
    | 37
    | 65 => pressed_keys.left = true
    | 40
    | 83 => pressed_keys.down = true
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
    | 38
    | 32
    | 87 => pressed_keys.up = false
    | 39
    | 68 => pressed_keys.right = false
    | 37
    | 65 => pressed_keys.left = false
    | 40
    | 83 => pressed_keys.down = false
    | _ => ()
    };
  true;
};

// Returns whether the bounding box should be drawn
let check_bbox_enabled = () => pressed_keys.bbox == 1;

/* Converts a keypress to a list of control keys, allowing more than one key
 * to be processed each frame. */
let translate_keys = () => {
  let k = pressed_keys;
  let ctrls = [
    (k.left, Actors.CLeft),
    (k.right, CRight),
    (k.up, CUp),
    (k.down, CDown),
  ];
  List.reduce(ctrls, [], (a, x) =>
    if (fst(x)) {
      [snd(x), ...a];
    } else {
      a;
    }
  );
};