

import * as Belt_List from "rescript/lib/es6/belt_List.js";

var pressedKeys = {
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
          pressedKeys.left2 = true;
          break;
      case 66 :
          pressedKeys.bbox = (pressedKeys.bbox + 1 | 0) % 2;
          break;
      case 68 :
          pressedKeys.right2 = true;
          break;
      case 83 :
          pressedKeys.down2 = true;
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
          pressedKeys.up2 = true;
          break;
      default:
        
    }
  } else if (match >= 32) {
    switch (match) {
      case 33 :
      case 34 :
      case 35 :
      case 36 :
          break;
      case 37 :
          pressedKeys.left1 = true;
          break;
      case 32 :
      case 38 :
          pressedKeys.up1 = true;
          break;
      case 39 :
          pressedKeys.right1 = true;
          break;
      case 40 :
          pressedKeys.down1 = true;
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
          pressedKeys.right2 = false;
        }
      } else {
        pressedKeys.up2 = false;
      }
    } else {
      pressedKeys.down2 = false;
    }
  } else if (match >= 41) {
    if (match !== 65) {
      
    } else {
      pressedKeys.left2 = false;
    }
  } else if (match >= 32) {
    switch (match) {
      case 33 :
      case 34 :
      case 35 :
      case 36 :
          break;
      case 37 :
          pressedKeys.left1 = false;
          break;
      case 32 :
      case 38 :
          pressedKeys.up1 = false;
          break;
      case 39 :
          pressedKeys.right1 = false;
          break;
      case 40 :
          pressedKeys.down1 = false;
          break;
      
    }
  }
  return true;
}

function checkBboxEnabled(param) {
  return pressedKeys.bbox === 1;
}

function translateKeys(playerNum) {
  var ctrls1_0 = [
    pressedKeys.left1,
    /* CLeft */0
  ];
  var ctrls1_1 = {
    hd: [
      pressedKeys.right1,
      /* CRight */1
    ],
    tl: {
      hd: [
        pressedKeys.up1,
        /* CUp */2
      ],
      tl: {
        hd: [
          pressedKeys.down1,
          /* CDown */3
        ],
        tl: /* [] */0
      }
    }
  };
  var ctrls1 = {
    hd: ctrls1_0,
    tl: ctrls1_1
  };
  var ctrls2_0 = [
    pressedKeys.left2,
    /* CLeft */0
  ];
  var ctrls2_1 = {
    hd: [
      pressedKeys.right2,
      /* CRight */1
    ],
    tl: {
      hd: [
        pressedKeys.up2,
        /* CUp */2
      ],
      tl: {
        hd: [
          pressedKeys.down2,
          /* CDown */3
        ],
        tl: /* [] */0
      }
    }
  };
  var ctrls2 = {
    hd: ctrls2_0,
    tl: ctrls2_1
  };
  return Belt_List.reduce(playerNum === /* One */0 ? ctrls1 : ctrls2, /* [] */0, (function (a, x) {
                if (x[0]) {
                  return {
                          hd: x[1],
                          tl: a
                        };
                } else {
                  return a;
                }
              }));
}

export {
  pressedKeys ,
  keydown ,
  keyup ,
  checkBboxEnabled ,
  translateKeys ,
  
}
/* No side effect */
