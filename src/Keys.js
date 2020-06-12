

import * as Belt_List from "bs-platform/lib/es6/belt_List.js";

var pressed_keys = {
  left1: false,
  right1: false,
  up1: false,
  down1: false,
  left2: false,
  right2: false,
  up2: false,
  down2: false,
  bbox: 0
};

function keydown(evt) {
  var match = evt.keyCode;
  if (match >= 41) {
    switch (match) {
      case 65 :
          pressed_keys.left2 = true;
          break;
      case 66 :
          pressed_keys.bbox = (pressed_keys.bbox + 1 | 0) % 2;
          break;
      case 68 :
          pressed_keys.right2 = true;
          break;
      case 83 :
          pressed_keys.down2 = true;
          break;
      case 67 :
      case 69 :
      case 70 :
      case 71 :
      case 72 :
      case 73 :
      case 74 :
      case 75 :
      case 76 :
      case 77 :
      case 78 :
      case 79 :
      case 80 :
      case 81 :
      case 82 :
      case 84 :
      case 85 :
      case 86 :
          break;
      case 87 :
          pressed_keys.up2 = true;
          break;
      default:
        
    }
  } else if (match >= 32) {
    switch (match - 32 | 0) {
      case 1 :
      case 2 :
      case 3 :
      case 4 :
          break;
      case 5 :
          pressed_keys.left1 = true;
          break;
      case 0 :
      case 6 :
          pressed_keys.up1 = true;
          break;
      case 7 :
          pressed_keys.right1 = true;
          break;
      case 8 :
          pressed_keys.down1 = true;
          break;
      
    }
  }
  return true;
}

function keyup(evt) {
  var match = evt.keyCode;
  if (match >= 68) {
    if (match !== 83) {
      if (match !== 87) {
        if (match >= 69) {
          
        } else {
          pressed_keys.right2 = false;
        }
      } else {
        pressed_keys.up2 = false;
      }
    } else {
      pressed_keys.down2 = false;
    }
  } else if (match >= 41) {
    if (match !== 65) {
      
    } else {
      pressed_keys.left2 = false;
    }
  } else if (match >= 32) {
    switch (match - 32 | 0) {
      case 1 :
      case 2 :
      case 3 :
      case 4 :
          break;
      case 5 :
          pressed_keys.left1 = false;
          break;
      case 0 :
      case 6 :
          pressed_keys.up1 = false;
          break;
      case 7 :
          pressed_keys.right1 = false;
          break;
      case 8 :
          pressed_keys.down1 = false;
          break;
      
    }
  }
  return true;
}

function check_bbox_enabled(param) {
  return pressed_keys.bbox === 1;
}

function translate_keys(playerNum) {
  var ctrls1_0 = [
    pressed_keys.left1,
    /* CLeft */0
  ];
  var ctrls1_1 = /* :: */{
    _0: [
      pressed_keys.right1,
      /* CRight */1
    ],
    _1: /* :: */{
      _0: [
        pressed_keys.up1,
        /* CUp */2
      ],
      _1: /* :: */{
        _0: [
          pressed_keys.down1,
          /* CDown */3
        ],
        _1: /* [] */0
      }
    }
  };
  var ctrls1 = /* :: */{
    _0: ctrls1_0,
    _1: ctrls1_1
  };
  var ctrls2_0 = [
    pressed_keys.left2,
    /* CLeft */0
  ];
  var ctrls2_1 = /* :: */{
    _0: [
      pressed_keys.right2,
      /* CRight */1
    ],
    _1: /* :: */{
      _0: [
        pressed_keys.up2,
        /* CUp */2
      ],
      _1: /* :: */{
        _0: [
          pressed_keys.down2,
          /* CDown */3
        ],
        _1: /* [] */0
      }
    }
  };
  var ctrls2 = /* :: */{
    _0: ctrls2_0,
    _1: ctrls2_1
  };
  return Belt_List.reduce(playerNum === /* One */0 ? ctrls1 : ctrls2, /* [] */0, (function (a, x) {
                if (x[0]) {
                  return /* :: */{
                          _0: x[1],
                          _1: a
                        };
                } else {
                  return a;
                }
              }));
}

export {
  pressed_keys ,
  keydown ,
  keyup ,
  check_bbox_enabled ,
  translate_keys ,
  
}
/* No side effect */
