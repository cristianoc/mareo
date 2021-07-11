(() => {
  // src/Config.js
  function randomSeed(param) {
    return 34;
  }
  function levelWidth(level) {
    switch (level) {
      case 1:
        return 800;
      case 2:
        return 1200;
      case 3:
        return 2400;
      case 4:
        return 3500;
      case 5:
        return 4500;
      case 6:
        return 6e3;
      case 7:
        return 8e3;
      case 8:
        return 1e4;
      case 9:
        return 12e3;
      default:
        return 1500 * level;
    }
  }
  function levelHeight(param) {
    return 256;
  }
  function enemyDensity(level) {
    switch (level) {
      case 1:
      case 2:
      case 3:
        return 20;
      case 4:
      case 5:
        return 15;
      case 6:
        return 10;
      case 7:
      case 8:
        return 5;
      case 9:
        return 4;
      default:
        return 3;
    }
  }
  var images = [
    "blocks.png",
    "items.png",
    "enemies.png",
    "mario-small.png"
  ];
  function blockw(level) {
    return levelWidth(level) / 16;
  }
  function blockh(level) {
    return 256 / 16 - 1;
  }
  function mapDim(level) {
    return [
      levelWidth(level),
      256
    ];
  }
  var canvasId = "canvas";
  var delayWhenFinished = 300;
  var restartAfter = 5;
  var spritesDir = "sprites/";
  var scale = 1.5;
  var friction = 0.9;
  var gravity = 0.2;
  var maxYVel = 4.5;
  var playerSpeed = 2.8;
  var playerJump = 5.7;
  var playerMaxJump = -6;
  var dampenJump = 4;
  var invuln = 60;

  // node_modules/rescript/lib/es6/caml_array.js
  function sub(x, offset, len) {
    var result = new Array(len);
    var j = 0;
    var i2 = offset;
    while (j < len) {
      result[j] = x[i2];
      j = j + 1 | 0;
      i2 = i2 + 1 | 0;
    }
    ;
    return result;
  }
  function set(xs, index, newval) {
    if (index < 0 || index >= xs.length) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "index out of bounds",
        Error: new Error()
      };
    }
    xs[index] = newval;
  }
  function get(xs, index) {
    if (index < 0 || index >= xs.length) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "index out of bounds",
        Error: new Error()
      };
    }
    return xs[index];
  }

  // node_modules/rescript/lib/es6/curry.js
  function app(_f, _args) {
    while (true) {
      var args = _args;
      var f2 = _f;
      var init_arity = f2.length;
      var arity = init_arity === 0 ? 1 : init_arity;
      var len = args.length;
      var d = arity - len | 0;
      if (d === 0) {
        return f2.apply(null, args);
      }
      if (d >= 0) {
        return function(f3, args2) {
          return function(x) {
            return app(f3, args2.concat([x]));
          };
        }(f2, args);
      }
      _args = sub(args, arity, -d | 0);
      _f = f2.apply(null, sub(args, 0, arity));
      continue;
    }
    ;
  }
  function _1(o, a0) {
    var arity = o.length;
    if (arity === 1) {
      return o(a0);
    } else {
      switch (arity) {
        case 1:
          return o(a0);
        case 2:
          return function(param) {
            return o(a0, param);
          };
        case 3:
          return function(param, param$1) {
            return o(a0, param, param$1);
          };
        case 4:
          return function(param, param$1, param$2) {
            return o(a0, param, param$1, param$2);
          };
        case 5:
          return function(param, param$1, param$2, param$3) {
            return o(a0, param, param$1, param$2, param$3);
          };
        case 6:
          return function(param, param$1, param$2, param$3, param$4) {
            return o(a0, param, param$1, param$2, param$3, param$4);
          };
        case 7:
          return function(param, param$1, param$2, param$3, param$4, param$5) {
            return o(a0, param, param$1, param$2, param$3, param$4, param$5);
          };
        default:
          return app(o, [a0]);
      }
    }
  }
  function __1(o) {
    var arity = o.length;
    if (arity === 1) {
      return o;
    } else {
      return function(a0) {
        return _1(o, a0);
      };
    }
  }
  function _2(o, a0, a1) {
    var arity = o.length;
    if (arity === 2) {
      return o(a0, a1);
    } else {
      switch (arity) {
        case 1:
          return app(o(a0), [a1]);
        case 2:
          return o(a0, a1);
        case 3:
          return function(param) {
            return o(a0, a1, param);
          };
        case 4:
          return function(param, param$1) {
            return o(a0, a1, param, param$1);
          };
        case 5:
          return function(param, param$1, param$2) {
            return o(a0, a1, param, param$1, param$2);
          };
        case 6:
          return function(param, param$1, param$2, param$3) {
            return o(a0, a1, param, param$1, param$2, param$3);
          };
        case 7:
          return function(param, param$1, param$2, param$3, param$4) {
            return o(a0, a1, param, param$1, param$2, param$3, param$4);
          };
        default:
          return app(o, [
            a0,
            a1
          ]);
      }
    }
  }
  function __2(o) {
    var arity = o.length;
    if (arity === 2) {
      return o;
    } else {
      return function(a0, a1) {
        return _2(o, a0, a1);
      };
    }
  }

  // node_modules/rescript/lib/es6/caml.js
  function caml_float_min(x, y) {
    if (x < y) {
      return x;
    } else {
      return y;
    }
  }
  function caml_float_max(x, y) {
    if (x > y) {
      return x;
    } else {
      return y;
    }
  }

  // node_modules/rescript/lib/es6/belt_Array.js
  function forEachU(a, f2) {
    for (var i2 = 0, i_finish = a.length; i2 < i_finish; ++i2) {
      f2(a[i2]);
    }
  }

  // node_modules/rescript/lib/es6/belt_List.js
  function copyAuxWitFilter(f2, _cellX, _prec) {
    while (true) {
      var prec = _prec;
      var cellX = _cellX;
      if (!cellX) {
        return;
      }
      var t = cellX.tl;
      var h2 = cellX.hd;
      if (f2(h2)) {
        var next = {
          hd: h2,
          tl: 0
        };
        prec.tl = next;
        _prec = next;
        _cellX = t;
        continue;
      }
      _cellX = t;
      continue;
    }
    ;
  }
  function length(xs) {
    var _x = xs;
    var _acc = 0;
    while (true) {
      var acc = _acc;
      var x = _x;
      if (!x) {
        return acc;
      }
      _acc = acc + 1 | 0;
      _x = x.tl;
      continue;
    }
    ;
  }
  function forEachU2(_xs, f2) {
    while (true) {
      var xs = _xs;
      if (!xs) {
        return;
      }
      f2(xs.hd);
      _xs = xs.tl;
      continue;
    }
    ;
  }
  function forEach(xs, f2) {
    return forEachU2(xs, __1(f2));
  }
  function reduceU(_l, _accu, f2) {
    while (true) {
      var accu = _accu;
      var l = _l;
      if (!l) {
        return accu;
      }
      _accu = f2(accu, l.hd);
      _l = l.tl;
      continue;
    }
    ;
  }
  function reduce(l, accu, f2) {
    return reduceU(l, accu, __2(f2));
  }
  function keepU(_xs, p) {
    while (true) {
      var xs = _xs;
      if (!xs) {
        return 0;
      }
      var t = xs.tl;
      var h2 = xs.hd;
      if (p(h2)) {
        var cell = {
          hd: h2,
          tl: 0
        };
        copyAuxWitFilter(p, t, cell);
        return cell;
      }
      _xs = t;
      continue;
    }
    ;
  }
  function keep(xs, p) {
    return keepU(xs, __1(p));
  }

  // src/Keys.js
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
        case 65:
          pressedKeys.left2 = true;
          break;
        case 66:
          pressedKeys.bbox = (pressedKeys.bbox + 1 | 0) % 2;
          break;
        case 68:
          pressedKeys.right2 = true;
          break;
        case 83:
          pressedKeys.down2 = true;
          break;
        case 67:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
        case 76:
        case 77:
        case 78:
        case 79:
        case 80:
        case 81:
        case 82:
        case 84:
        case 85:
        case 86:
          break;
        case 87:
          pressedKeys.up2 = true;
          break;
        default:
      }
    } else if (match >= 32) {
      switch (match) {
        case 33:
        case 34:
        case 35:
        case 36:
          break;
        case 37:
          pressedKeys.left1 = true;
          break;
        case 32:
        case 38:
          pressedKeys.up1 = true;
          break;
        case 39:
          pressedKeys.right1 = true;
          break;
        case 40:
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
        case 33:
        case 34:
        case 35:
        case 36:
          break;
        case 37:
          pressedKeys.left1 = false;
          break;
        case 32:
        case 38:
          pressedKeys.up1 = false;
          break;
        case 39:
          pressedKeys.right1 = false;
          break;
        case 40:
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
      0
    ];
    var ctrls1_1 = {
      hd: [
        pressedKeys.right1,
        1
      ],
      tl: {
        hd: [
          pressedKeys.up1,
          2
        ],
        tl: {
          hd: [
            pressedKeys.down1,
            3
          ],
          tl: 0
        }
      }
    };
    var ctrls1 = {
      hd: ctrls1_0,
      tl: ctrls1_1
    };
    var ctrls2_0 = [
      pressedKeys.left2,
      0
    ];
    var ctrls2_1 = {
      hd: [
        pressedKeys.right2,
        1
      ],
      tl: {
        hd: [
          pressedKeys.up2,
          2
        ],
        tl: {
          hd: [
            pressedKeys.down2,
            3
          ],
          tl: 0
        }
      }
    };
    var ctrls2 = {
      hd: ctrls2_0,
      tl: ctrls2_1
    };
    return reduce(playerNum === 0 ? ctrls1 : ctrls2, 0, function(a, x) {
      if (x[0]) {
        return {
          hd: x[1],
          tl: a
        };
      } else {
        return a;
      }
    });
  }

  // node_modules/rescript/lib/es6/caml_exceptions.js
  var id = {
    contents: 0
  };
  function create(str) {
    id.contents = id.contents + 1 | 0;
    return str + ("/" + id.contents);
  }

  // node_modules/rescript/lib/es6/camlinternalLazy.js
  var Undefined = /* @__PURE__ */ create("CamlinternalLazy.Undefined");
  function forward_with_closure(blk, closure) {
    var result = closure();
    blk.VAL = result;
    blk.LAZY_DONE = true;
    return result;
  }
  function raise_undefined() {
    throw {
      RE_EXN_ID: Undefined,
      Error: new Error()
    };
  }
  function force(lzv) {
    if (lzv.LAZY_DONE) {
      return lzv.VAL;
    } else {
      var closure = lzv.VAL;
      lzv.VAL = raise_undefined;
      try {
        return forward_with_closure(lzv, closure);
      } catch (e) {
        lzv.VAL = function() {
          throw e;
        };
        throw e;
      }
    }
  }

  // src/Load.js
  var canvasAndContext = {
    LAZY_DONE: false,
    VAL: function() {
      var el = document.getElementById(canvasId);
      if (el !== null) {
        var width = el.width;
        var height = el.height;
        var context = el.getContext("2d");
        context.scale(scale, scale);
        document.addEventListener("keydown", keydown, true);
        document.addEventListener("keyup", keyup, true);
        return {
          canvasElement: el,
          sizeScaled: [
            width / scale,
            height / scale
          ],
          context
        };
      }
      console.log("cant find canvas " + (canvasId + " \n"));
      throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "Load.res",
          11,
          4
        ],
        Error: new Error()
      };
    }
  };
  function getCanvas(param) {
    return force(canvasAndContext).canvasElement;
  }
  function getContext(param) {
    return force(canvasAndContext).context;
  }
  function getCanvasSizeScaled(param) {
    return force(canvasAndContext).sizeScaled;
  }

  // node_modules/rescript/lib/es6/caml_bytes.js
  function caml_create_bytes(len) {
    if (len < 0) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "String.create",
        Error: new Error()
      };
    }
    var result = new Array(len);
    for (var i2 = 0; i2 < len; ++i2) {
      result[i2] = 0;
    }
    return result;
  }
  function caml_blit_bytes(s1, i1, s2, i2, len) {
    if (len <= 0) {
      return;
    }
    if (s1 === s2) {
      if (i1 < i2) {
        var range_a = (s1.length - i2 | 0) - 1 | 0;
        var range_b = len - 1 | 0;
        var range = range_a > range_b ? range_b : range_a;
        for (var j = range; j >= 0; --j) {
          s1[i2 + j | 0] = s1[i1 + j | 0];
        }
        return;
      }
      if (i1 <= i2) {
        return;
      }
      var range_a$1 = (s1.length - i1 | 0) - 1 | 0;
      var range_b$1 = len - 1 | 0;
      var range$1 = range_a$1 > range_b$1 ? range_b$1 : range_a$1;
      for (var k = 0; k <= range$1; ++k) {
        s1[i2 + k | 0] = s1[i1 + k | 0];
      }
      return;
    }
    var off1 = s1.length - i1 | 0;
    if (len <= off1) {
      for (var i3 = 0; i3 < len; ++i3) {
        s2[i2 + i3 | 0] = s1[i1 + i3 | 0];
      }
      return;
    }
    for (var i$1 = 0; i$1 < off1; ++i$1) {
      s2[i2 + i$1 | 0] = s1[i1 + i$1 | 0];
    }
    for (var i$2 = off1; i$2 < len; ++i$2) {
      s2[i2 + i$2 | 0] = 0;
    }
  }
  function bytes_to_string(a) {
    var i2 = 0;
    var len = a.length;
    var s = "";
    var s_len = len;
    if (i2 === 0 && len <= 4096 && len === a.length) {
      return String.fromCharCode.apply(null, a);
    }
    var offset = 0;
    while (s_len > 0) {
      var next = s_len < 1024 ? s_len : 1024;
      var tmp_bytes = new Array(next);
      for (var k = 0; k < next; ++k) {
        tmp_bytes[k] = a[k + offset | 0];
      }
      s = s + String.fromCharCode.apply(null, tmp_bytes);
      s_len = s_len - next | 0;
      offset = offset + next | 0;
    }
    ;
    return s;
  }
  function bytes_of_string(s) {
    var len = s.length;
    var res = new Array(len);
    for (var i2 = 0; i2 < len; ++i2) {
      res[i2] = s.charCodeAt(i2);
    }
    return res;
  }

  // node_modules/rescript/lib/es6/bytes.js
  function sub2(s, ofs, len) {
    if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "String.sub / Bytes.sub",
        Error: new Error()
      };
    }
    var r = caml_create_bytes(len);
    caml_blit_bytes(s, ofs, r, 0, len);
    return r;
  }

  // node_modules/rescript/lib/es6/caml_string.js
  function get2(s, i2) {
    if (i2 >= s.length || i2 < 0) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "index out of bounds",
        Error: new Error()
      };
    }
    return s.charCodeAt(i2);
  }

  // node_modules/rescript/lib/es6/string.js
  function sub3(s, ofs, len) {
    return bytes_to_string(sub2(bytes_of_string(s), ofs, len));
  }

  // src/Draw.js
  function renderBbox(sprite, posx, posy) {
    var match = sprite.params.bboxOffset;
    var match$1 = sprite.params.bboxSize;
    var context = getContext(void 0);
    context.strokeStyle = "#FF0000";
    return context.strokeRect(posx + match[0], posy + match[1], match$1[0], match$1[1]);
  }
  function render(sprite, posx, posy) {
    var match = sprite.params.srcOffset;
    var match$1 = sprite.params.frameSize;
    var sw = match$1[0];
    var match$2 = sprite.params.frameSize;
    var sx = match[0] + sprite.frame * sw;
    var context = getContext(void 0);
    return context.drawImage(sprite.img, sx, match[1], sw, match$1[1], posx, posy, match$2[0], match$2[1]);
  }
  function drawBgd(bgd, off_x) {
    render(bgd, -off_x, 0);
    return render(bgd, bgd.params.frameSize[0] - off_x, 0);
  }
  function clearCanvas(param) {
    var canvas = getCanvas(void 0);
    var context = getContext(void 0);
    var cwidth = canvas.width;
    var cheight = canvas.height;
    return context.clearRect(0, 0, cwidth, cheight);
  }
  function scoreString(score) {
    var b = "0000000";
    var blen = b.length;
    var s = String(score);
    var slen = s.length;
    if (slen <= blen) {
      return sub3(b, 0, blen - slen | 0) + s;
    } else {
      return s;
    }
  }
  function hud(score, coins) {
    var coin_string = String(coins);
    var context = getContext(void 0);
    context.font = "10px 'Press Start 2P'";
    context.fillText("Cx" + coin_string, 10, 18);
    return context.fillText(scoreString(score), 260, 18);
  }
  function fps(fps_val) {
    var fps_str = String(fps_val | 0);
    return getContext(void 0).fillText(fps_str, 80, 18);
  }
  function blackScreen(texts) {
    var ctx = getContext(void 0);
    var fontSize = 20 / scale;
    var fontTxt = String(fontSize | 0) + "px";
    ctx.rect(0, 0, 512 / scale, 512 / scale);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = fontTxt + "'Press Start 2P'";
    forEach(texts, function(param) {
      return ctx.fillText(param[0], param[1] / scale, param[2] / scale);
    });
    ctx.fillStyle = "black";
  }
  function levelFinished(result, level, elapsed) {
    if (result) {
      return blackScreen({
        hd: [
          "You lose level " + (level + "!"),
          80,
          100
        ],
        tl: {
          hd: [
            elapsed,
            230,
            160
          ],
          tl: 0
        }
      });
    } else {
      return blackScreen({
        hd: [
          "You win level" + (level + "!"),
          80,
          100
        ],
        tl: {
          hd: [
            elapsed,
            230,
            160
          ],
          tl: 0
        }
      });
    }
  }

  // node_modules/rescript/lib/es6/caml_obj.js
  var for_in = function(o, foo) {
    for (var x in o) {
      foo(x);
    }
  };
  function caml_equal(a, b) {
    if (a === b) {
      return true;
    }
    var a_type = typeof a;
    if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
      return false;
    }
    var b_type = typeof b;
    if (a_type === "function" || b_type === "function") {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "equal: functional value",
        Error: new Error()
      };
    }
    if (b_type === "number" || b_type === "undefined" || b === null) {
      return false;
    }
    var tag_a = a.TAG | 0;
    var tag_b = b.TAG | 0;
    if (tag_a === 248) {
      return a[1] === b[1];
    }
    if (tag_a === 251) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "equal: abstract value",
        Error: new Error()
      };
    }
    if (tag_a !== tag_b) {
      return false;
    }
    var len_a = a.length | 0;
    var len_b = b.length | 0;
    if (len_a === len_b) {
      if (Array.isArray(a)) {
        var _i = 0;
        while (true) {
          var i2 = _i;
          if (i2 === len_a) {
            return true;
          }
          if (!caml_equal(a[i2], b[i2])) {
            return false;
          }
          _i = i2 + 1 | 0;
          continue;
        }
        ;
      } else if (a instanceof Date && b instanceof Date) {
        return !(a > b || a < b);
      } else {
        var result = {
          contents: true
        };
        var do_key_a = function(key) {
          if (!b.hasOwnProperty(key)) {
            result.contents = false;
            return;
          }
        };
        var do_key_b = function(key) {
          if (!a.hasOwnProperty(key) || !caml_equal(b[key], a[key])) {
            result.contents = false;
            return;
          }
        };
        for_in(a, do_key_a);
        if (result.contents) {
          for_in(b, do_key_b);
        }
        return result.contents;
      }
    } else {
      return false;
    }
  }

  // node_modules/rescript/lib/es6/caml_int32.js
  function mod_(x, y) {
    if (y === 0) {
      throw {
        RE_EXN_ID: "Division_by_zero",
        Error: new Error()
      };
    }
    return x % y;
  }

  // src/Sprite.js
  function setupSprite(bboxOffsetOpt, bboxSizeOpt, frameSizeOpt, maxTicksOpt, maxFramesOpt, srcOffset, imgSrc) {
    var bboxOffset = bboxOffsetOpt !== void 0 ? bboxOffsetOpt : [
      0,
      0
    ];
    var bboxSize = bboxSizeOpt !== void 0 ? bboxSizeOpt : [
      0,
      0
    ];
    var frameSize = frameSizeOpt !== void 0 ? frameSizeOpt : [
      16,
      16
    ];
    var maxTicks = maxTicksOpt !== void 0 ? maxTicksOpt : 0;
    var maxFrames = maxFramesOpt !== void 0 ? maxFramesOpt : 1;
    var bboxSize$1 = caml_equal(bboxSize, [
      0,
      0
    ]) ? frameSize : bboxSize;
    var maxFrames$1 = maxFrames < 1 ? 1 : maxFrames;
    var imgSrc$1 = "./sprites/" + imgSrc;
    return {
      maxFrames: maxFrames$1,
      maxTicks,
      imgSrc: imgSrc$1,
      frameSize,
      srcOffset,
      bboxOffset,
      bboxSize: bboxSize$1
    };
  }
  function makeSmallPlayer(typ, dir, playerNum) {
    var png = playerNum ? "mario2-small.png" : "mario-small.png";
    if (dir) {
      switch (typ) {
        case 0:
          return setupSprite([
            1,
            1
          ], [
            11,
            15
          ], void 0, void 0, void 0, [
            0,
            32
          ], png);
        case 1:
          return setupSprite([
            2,
            1
          ], [
            13,
            15
          ], void 0, 10, 2, [
            16,
            48
          ], png);
        case 2:
          return setupSprite([
            2,
            1
          ], [
            12,
            15
          ], void 0, 5, 3, [
            16,
            32
          ], png);
        case 3:
          return setupSprite([
            1,
            5
          ], [
            14,
            10
          ], void 0, void 0, void 0, [
            0,
            64
          ], png);
      }
    } else {
      switch (typ) {
        case 0:
          return setupSprite([
            3,
            1
          ], [
            11,
            15
          ], void 0, void 0, void 0, [
            0,
            0
          ], png);
        case 1:
          return setupSprite([
            2,
            1
          ], [
            13,
            15
          ], void 0, 10, 2, [
            16,
            16
          ], png);
        case 2:
          return setupSprite([
            2,
            1
          ], [
            12,
            15
          ], void 0, 5, 3, [
            16,
            0
          ], png);
        case 3:
          return setupSprite([
            1,
            5
          ], [
            14,
            10
          ], void 0, void 0, void 0, [
            0,
            64
          ], png);
      }
    }
  }
  function makeBigPlayer(typ, dir, playerNum) {
    var png = playerNum ? "mario2-big.png" : "mario-big.png";
    if (dir) {
      switch (typ) {
        case 0:
          return setupSprite([
            1,
            1
          ], [
            13,
            25
          ], [
            16,
            26
          ], void 0, void 0, [
            16,
            69
          ], png);
        case 1:
          return setupSprite([
            2,
            1
          ], [
            12,
            25
          ], [
            16,
            26
          ], void 0, void 0, [
            48,
            70
          ], png);
        case 2:
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
          ], png);
        case 3:
          return setupSprite([
            2,
            10
          ], [
            13,
            17
          ], [
            16,
            27
          ], void 0, void 0, [
            32,
            69
          ], png);
      }
    } else {
      switch (typ) {
        case 0:
          return setupSprite([
            2,
            1
          ], [
            13,
            25
          ], [
            16,
            27
          ], void 0, void 0, [
            16,
            5
          ], png);
        case 1:
          return setupSprite([
            2,
            1
          ], [
            12,
            25
          ], [
            16,
            26
          ], void 0, void 0, [
            48,
            6
          ], png);
        case 2:
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
          ], png);
        case 3:
          return setupSprite([
            2,
            10
          ], [
            13,
            17
          ], [
            16,
            27
          ], void 0, void 0, [
            32,
            5
          ], png);
      }
    }
  }
  function makeEnemy(typ, dir) {
    switch (typ) {
      case 0:
        return setupSprite([
          1,
          1
        ], [
          14,
          14
        ], void 0, 10, 2, [
          0,
          128
        ], "enemies.png");
      case 1:
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
      case 2:
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
      case 3:
        return setupSprite([
          2,
          2
        ], [
          12,
          13
        ], void 0, 10, 4, [
          0,
          96
        ], "enemies.png");
      case 4:
        return setupSprite([
          2,
          2
        ], [
          12,
          13
        ], void 0, 10, 4, [
          0,
          32
        ], "enemies.png");
    }
  }
  function makeItem(x) {
    if (x) {
      return setupSprite([
        3,
        0
      ], [
        12,
        16
      ], void 0, 15, 3, [
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
      ], void 0, void 0, void 0, [
        0,
        0
      ], "items.png");
    }
  }
  var brickParams = setupSprite(void 0, void 0, void 0, 10, 5, [
    0,
    0
  ], "blocks.png");
  var qBlockParams = setupSprite(void 0, void 0, void 0, 15, 4, [
    0,
    16
  ], "blocks.png");
  var qBlockUsedParams = setupSprite(void 0, void 0, void 0, void 0, void 0, [
    0,
    32
  ], "blocks.png");
  var unBBlockParams = setupSprite(void 0, void 0, void 0, void 0, void 0, [
    0,
    48
  ], "blocks.png");
  var cloudParams = setupSprite(void 0, void 0, void 0, void 0, void 0, [
    0,
    64
  ], "blocks.png");
  var panelParams = setupSprite(void 0, void 0, [
    26,
    26
  ], 15, 3, [
    0,
    0
  ], "panel.png");
  var groundParams = setupSprite(void 0, void 0, void 0, void 0, void 0, [
    0,
    32
  ], "ground.png");
  function makeBlock(x) {
    if (typeof x !== "number") {
      return qBlockParams;
    }
    switch (x) {
      case 0:
        return qBlockUsedParams;
      case 1:
        return brickParams;
      case 2:
        return unBBlockParams;
      case 3:
        return cloudParams;
      case 4:
        return panelParams;
      case 5:
        return groundParams;
    }
  }
  function makeParticle(x) {
    switch (x) {
      case 0:
        return setupSprite(void 0, void 0, void 0, void 0, void 0, [
          0,
          144
        ], "enemies.png");
      case 1:
        return setupSprite(void 0, void 0, [
          8,
          8
        ], void 0, void 0, [
          0,
          0
        ], "chunks.png");
      case 2:
        return setupSprite(void 0, void 0, [
          8,
          8
        ], void 0, void 0, [
          8,
          0
        ], "chunks.png");
      case 3:
        return setupSprite(void 0, void 0, [
          12,
          8
        ], void 0, void 0, [
          0,
          0
        ], "score.png");
      case 4:
        return setupSprite(void 0, void 0, [
          12,
          9
        ], void 0, void 0, [
          0,
          9
        ], "score.png");
      case 5:
        return setupSprite(void 0, void 0, [
          12,
          9
        ], void 0, void 0, [
          0,
          18
        ], "score.png");
      case 6:
        return setupSprite(void 0, void 0, [
          12,
          9
        ], void 0, void 0, [
          0,
          27
        ], "score.png");
      case 7:
        return setupSprite(void 0, void 0, [
          14,
          9
        ], void 0, void 0, [
          13,
          0
        ], "score.png");
      case 8:
        return setupSprite(void 0, void 0, [
          14,
          9
        ], void 0, void 0, [
          13,
          9
        ], "score.png");
      case 9:
        return setupSprite(void 0, void 0, [
          14,
          9
        ], void 0, void 0, [
          13,
          18
        ], "score.png");
      case 10:
        return setupSprite(void 0, void 0, [
          14,
          9
        ], void 0, void 0, [
          13,
          27
        ], "score.png");
    }
  }
  function makePlayer(plSize, typ, dir, playerNum) {
    if (plSize) {
      return makeSmallPlayer(typ, dir, playerNum);
    } else {
      return makeBigPlayer(typ, dir, playerNum);
    }
  }
  function makeFromParams(params) {
    var img = document.createElement("img");
    img.src = params.imgSrc;
    return {
      params,
      frame: 0,
      ticks: 0,
      img
    };
  }
  function makeBgd(param) {
    return makeFromParams(setupSprite(void 0, void 0, [
      512,
      256
    ], void 0, void 0, [
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
      spr.frame = mod_(spr.frame + 1 | 0, spr.params.maxFrames);
    } else {
      spr.ticks = curr_ticks + 1 | 0;
    }
  }

  // src/Particle.js
  function pairToXy(pair) {
    return {
      x: pair[0],
      y: pair[1]
    };
  }
  function makeType(typ) {
    return {
      sprite: makeParticle$1(typ),
      lifetime: typ === 2 || typ === 1 ? 300 : 30
    };
  }
  function make2(velOpt, accOpt, partType, px, py) {
    var vel = velOpt !== void 0 ? velOpt : [
      0,
      0
    ];
    var acc = accOpt !== void 0 ? accOpt : [
      0,
      0
    ];
    var params = makeType(partType);
    var vel$1 = pairToXy(vel);
    var acc$1 = pairToXy(acc);
    return {
      params,
      px,
      py,
      vel: vel$1,
      acc: acc$1,
      kill: false,
      life: params.lifetime
    };
  }
  function makeScore(score, pos) {
    var t = score >= 801 ? score >= 2001 ? score !== 4e3 ? score !== 8e3 ? 3 : 10 : 9 : score !== 1e3 ? score >= 2e3 ? 8 : 3 : 7 : score >= 201 ? score !== 400 ? score >= 800 ? 6 : 3 : 5 : score !== 100 && score >= 200 ? 4 : 3;
    var partial_arg = [
      0.5,
      -0.7
    ];
    return function(param) {
      return make2(partial_arg, void 0, t, pos, param);
    };
  }
  function updateVel(part) {
    part.vel.x = part.vel.x + part.acc.x;
    part.vel.y = part.vel.y + part.acc.y;
  }
  function updatePos(part) {
    part.px = part.vel.x + part.px;
    part.py = part.vel.y + part.py;
  }
  function $$process(part) {
    part.life = part.life - 1 | 0;
    if (part.life === 0) {
      part.kill = true;
    }
    updateVel(part);
    return updatePos(part);
  }

  // node_modules/rescript/lib/es6/pervasives.js
  var min_int = -2147483648;
  function $at(l1, l2) {
    if (l1) {
      return {
        hd: l1.hd,
        tl: $at(l1.tl, l2)
      };
    } else {
      return l2;
    }
  }

  // src/Object.js
  var idCounter = {
    contents: min_int
  };
  function setVelToSpeed(obj) {
    var speed = obj.speed;
    var match = obj.dir;
    if (match) {
      obj.vx = speed;
    } else {
      obj.vx = -speed;
    }
  }
  function makeItem2(o, t) {
    if (t) {
      o.hasGravity = false;
      return;
    }
  }
  function makeEnemy2(o, t) {
    if (t >= 3) {
      o.speed = 3;
      return;
    }
  }
  function newId(param) {
    idCounter.contents = idCounter.contents + 1 | 0;
    return idCounter.contents;
  }
  function make3(hasGravityOpt, speedOpt, dirOpt, objTyp, spriteParams, px, py) {
    var hasGravity = hasGravityOpt !== void 0 ? hasGravityOpt : true;
    var speed = speedOpt !== void 0 ? speedOpt : 1;
    var dir = dirOpt !== void 0 ? dirOpt : 0;
    var newObj = {
      objTyp,
      sprite: makeFromParams(spriteParams),
      hasGravity,
      speed,
      id: newId(void 0),
      px,
      py,
      vx: 0,
      vy: 0,
      jumping: false,
      grounded: false,
      dir,
      invuln: 0,
      kill: false,
      health: 1,
      crouch: false,
      score: 0
    };
    switch (objTyp.TAG | 0) {
      case 0:
        newObj.speed = playerSpeed;
        break;
      case 1:
        makeEnemy2(newObj, objTyp._0);
        break;
      case 2:
        makeItem2(newObj, objTyp._0);
        break;
      case 3:
        newObj.hasGravity = false;
        break;
    }
    return newObj;
  }
  function isPlayer(x) {
    var match = x.objTyp;
    if (match.TAG === 0) {
      return true;
    } else {
      return false;
    }
  }
  function isEnemy(x) {
    var match = x.objTyp;
    if (match.TAG === 1) {
      return true;
    } else {
      return false;
    }
  }
  function equals(col1, col2) {
    return col1.id === col2.id;
  }
  function jump(player) {
    player.jumping = true;
    player.grounded = false;
    player.vy = caml_float_max(player.vy - (playerJump + Math.abs(player.vx) * 0.25), playerMaxJump);
  }
  function updatePlayerKeys(player, controls) {
    var lr_acc = player.vx * 0.2;
    switch (controls) {
      case 0:
        if (!player.crouch) {
          if (player.vx > -player.speed) {
            player.vx = player.vx - (0.4 + Math.abs(lr_acc));
          }
          player.dir = 0;
          return;
        } else {
          return;
        }
      case 1:
        if (!player.crouch) {
          if (player.vx < player.speed) {
            player.vx = player.vx + (0.4 + Math.abs(lr_acc));
          }
          player.dir = 1;
          return;
        } else {
          return;
        }
      case 2:
        if (!player.jumping && player.grounded) {
          return jump(player);
        } else {
          return;
        }
      case 3:
        if (!player.jumping && player.grounded) {
          player.crouch = true;
          return;
        } else {
          return;
        }
    }
  }
  function normalizePos(o, p1, p2) {
    var match = p1.bboxOffset;
    var match$1 = p2.bboxOffset;
    var match$2 = p1.bboxSize;
    var match$3 = p2.bboxSize;
    o.px = o.px - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
    o.py = o.py - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  }
  function updatePlayer(player, playerNum, keys) {
    var prev_jumping = player.jumping;
    var prev_dir = player.dir;
    var prev_vx = Math.abs(player.vx);
    forEach(keys, function(param) {
      return updatePlayerKeys(player, param);
    });
    var v = player.vx * friction;
    var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
    player.vx = vel_damped;
    var plSize = player.health <= 1 ? 1 : 0;
    var playerTyp = !prev_jumping && player.jumping ? 1 : prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vx) > 0 && !player.jumping ? 2 : prev_dir !== player.dir && player.jumping && prev_jumping ? 1 : player.vy === 0 && player.crouch ? 3 : player.vy === 0 && player.vx === 0 ? 0 : void 0;
    if (playerTyp === void 0) {
      return;
    }
    var newSprite = makeFromParams(makePlayer(plSize, playerTyp, player.dir, playerNum));
    normalizePos(player, player.sprite.params, newSprite.params);
    player.objTyp = {
      TAG: 0,
      _0: plSize,
      _1: playerNum
    };
    player.sprite = newSprite;
  }
  function updateVel2(obj) {
    if (obj.grounded) {
      obj.vy = 0;
      return;
    } else if (obj.hasGravity) {
      obj.vy = caml_float_min(obj.vy + gravity + Math.abs(obj.vy) * 0.01, maxYVel);
      return;
    } else {
      return;
    }
  }
  function updatePos2(obj) {
    obj.px = obj.vx + obj.px;
    if (obj.hasGravity) {
      obj.py = obj.vy + obj.py;
      return;
    }
  }
  function processObj(obj, level) {
    updateVel2(obj);
    updatePos2(obj);
    if (obj.py > levelHeight(level)) {
      obj.kill = true;
      return;
    }
  }
  function collideBlock(dir, obj) {
    if (dir !== 1) {
      if (dir !== 0) {
        obj.vx = 0;
      } else {
        obj.vy = -1e-3;
      }
    } else {
      obj.vy = 0;
      obj.grounded = true;
      obj.jumping = false;
    }
  }
  function reverseLeftRight(obj) {
    obj.vx = -obj.vx;
    obj.dir = obj.dir ? 0 : 1;
  }
  function evolveEnemy(player_dir, typ, spr, obj) {
    switch (typ) {
      case 0:
        obj.kill = true;
        return;
      case 1:
        var newObj = make3(void 0, 3, obj.dir, {
          TAG: 1,
          _0: 3
        }, makeEnemy(3, obj.dir), obj.px, obj.py);
        normalizePos(newObj, spr.params, newObj.sprite.params);
        return newObj;
      case 2:
        return make3(void 0, 3, obj.dir, {
          TAG: 1,
          _0: 4
        }, makeEnemy(4, obj.dir), obj.px, obj.py);
      case 3:
      case 4:
        break;
    }
    obj.dir = player_dir;
    if (obj.vx !== 0) {
      obj.vx = 0;
    } else {
      setVelToSpeed(obj);
    }
  }
  function revDir(o, t, s) {
    reverseLeftRight(o);
    var old_params = s.params;
    transformEnemy(t, s, o.dir);
    return normalizePos(o, old_params, s.params);
  }
  function decHealth(obj) {
    var health = obj.health - 1 | 0;
    if (health === 0) {
      obj.kill = true;
    } else if (obj.invuln === 0) {
      obj.health = health;
    }
    if (isPlayer(obj)) {
      return jump(obj);
    }
  }
  function evolveBlock(obj) {
    decHealth(obj);
    return make3(false, void 0, obj.dir, {
      TAG: 3,
      _0: 0
    }, makeBlock(0), obj.px, obj.py);
  }
  function spawnAbove(player_dir, obj, itemTyp) {
    var item = make3(itemTyp !== 1, void 0, 0, {
      TAG: 2,
      _0: itemTyp
    }, makeItem(itemTyp), obj.px, obj.py);
    item.py = item.py - item.sprite.params.frameSize[1];
    item.dir = player_dir ? 0 : 1;
    setVelToSpeed(item);
    return item;
  }
  function getAabb(obj) {
    var sprParams = obj.sprite.params;
    var match = sprParams.bboxOffset;
    var box = obj.px + match[0];
    var boy = obj.py + match[1];
    var match$1 = sprParams.bboxSize;
    var sy = match$1[1];
    var sx = match$1[0];
    return {
      center: {
        x: box + sx / 2,
        y: boy + sy / 2
      },
      half: {
        x: sx / 2,
        y: sy / 2
      }
    };
  }
  function colBypass(c1, c2) {
    if (c1.kill) {
      return true;
    }
    if (c2.kill) {
      return true;
    }
    var match = c1.objTyp;
    var match$1 = c2.objTyp;
    switch (match.TAG | 0) {
      case 0:
        if (match$1.TAG === 1) {
          return c1.invuln > 0;
        } else {
          return false;
        }
      case 1:
        if (match$1.TAG === 2) {
          return true;
        } else {
          return false;
        }
      case 2:
        switch (match$1.TAG | 0) {
          case 1:
          case 2:
            return true;
          case 0:
          case 3:
            return false;
        }
      case 3:
        return false;
    }
  }
  function checkCollision(o1, o2) {
    var b1 = getAabb(o1);
    var b2 = getAabb(o2);
    if (colBypass(o1, o2)) {
      return;
    }
    var vx = b1.center.x - b2.center.x;
    var vy = b1.center.y - b2.center.y;
    var hwidths = b1.half.x + b2.half.x;
    var hheights = b1.half.y + b2.half.y;
    if (!(Math.abs(vx) < hwidths && Math.abs(vy) < hheights)) {
      return;
    }
    var ox = hwidths - Math.abs(vx);
    var oy = hheights - Math.abs(vy);
    if (ox + 0.2 > oy) {
      if (vy > 0) {
        o1.py = o1.py + oy;
        return 0;
      } else {
        o1.py = o1.py - oy;
        return 1;
      }
    } else if (vx > 0) {
      o1.px = o1.px + ox;
      return 3;
    } else {
      o1.px = o1.px - ox;
      return 2;
    }
  }
  function kill(obj) {
    var t = obj.objTyp;
    switch (t.TAG | 0) {
      case 0:
        return 0;
      case 1:
        var score = obj.score > 0 ? {
          hd: makeScore(obj.score, obj.px)(obj.py),
          tl: 0
        } : 0;
        var remains = t._0 !== 0 ? 0 : {
          hd: make2(void 0, void 0, 0, obj.px, obj.py),
          tl: 0
        };
        return $at(score, remains);
      case 2:
        if (t._0) {
          return 0;
        } else {
          return {
            hd: makeScore(obj.score, obj.px)(obj.py),
            tl: 0
          };
        }
      case 3:
        if (t._0 !== 1) {
          return 0;
        }
        var p1 = make2([
          -5,
          -5
        ], [
          0,
          0.2
        ], 1, obj.px, obj.py);
        var p2 = make2([
          -3,
          -4
        ], [
          0,
          0.2
        ], 1, obj.px, obj.py);
        var p3 = make2([
          3,
          -4
        ], [
          0,
          0.2
        ], 2, obj.px, obj.py);
        var p4 = make2([
          5,
          -5
        ], [
          0,
          0.2
        ], 2, obj.px, obj.py);
        return {
          hd: p1,
          tl: {
            hd: p2,
            tl: {
              hd: p3,
              tl: {
                hd: p4,
                tl: 0
              }
            }
          }
        };
    }
  }

  // src/Viewport.js
  function make4(param, param$1) {
    return {
      px: 0,
      py: 0,
      v_dim: {
        x: param[0],
        y: param[1]
      },
      m_dim: {
        x: param$1[0],
        y: param$1[1]
      }
    };
  }
  function calcViewportPoint(cc, vc, mc) {
    var vc_half = vc / 2;
    return caml_float_min(caml_float_max(cc - vc_half, 0), caml_float_min(mc - vc, Math.abs(cc - vc_half)));
  }
  function inViewport(v, px, py) {
    var v_min_x = v.px - 32;
    var v_max_x = v.px + v.v_dim.x;
    var v_min_y = v.py - 32;
    var v_max_y = v.py + v.v_dim.y;
    if (px >= v_min_x && px <= v_max_x && py >= v_min_y) {
      return py <= v_max_y;
    } else {
      return false;
    }
  }
  function outOfViewportBelow(v, y) {
    var vMaxY = v.v_dim.y * 1.5;
    return y + 20 >= vMaxY;
  }
  function fromCoord(viewport, px, py) {
    return {
      x: px - viewport.px,
      y: py - viewport.py
    };
  }
  function update(vpt, px, py) {
    var newX = calcViewportPoint(px, vpt.v_dim.x, vpt.m_dim.x);
    var newY = calcViewportPoint(py, vpt.v_dim.y, vpt.m_dim.y);
    vpt.px = newX;
    vpt.py = newY;
  }

  // node_modules/rescript/lib/es6/caml_md5.js
  function cmn(q, a, b, x, s, t) {
    var a$1 = ((a + q | 0) + x | 0) + t | 0;
    return (a$1 << s | a$1 >>> (32 - s | 0) | 0) + b | 0;
  }
  function f(a, b, c, d, x, s, t) {
    return cmn(b & c | (b ^ -1) & d, a, b, x, s, t);
  }
  function g(a, b, c, d, x, s, t) {
    return cmn(b & d | c & (d ^ -1), a, b, x, s, t);
  }
  function h(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function i(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | d ^ -1), a, b, x, s, t);
  }
  function cycle(x, k) {
    var a = x[0];
    var b = x[1];
    var c = x[2];
    var d = x[3];
    a = f(a, b, c, d, k[0], 7, -680876936);
    d = f(d, a, b, c, k[1], 12, -389564586);
    c = f(c, d, a, b, k[2], 17, 606105819);
    b = f(b, c, d, a, k[3], 22, -1044525330);
    a = f(a, b, c, d, k[4], 7, -176418897);
    d = f(d, a, b, c, k[5], 12, 1200080426);
    c = f(c, d, a, b, k[6], 17, -1473231341);
    b = f(b, c, d, a, k[7], 22, -45705983);
    a = f(a, b, c, d, k[8], 7, 1770035416);
    d = f(d, a, b, c, k[9], 12, -1958414417);
    c = f(c, d, a, b, k[10], 17, -42063);
    b = f(b, c, d, a, k[11], 22, -1990404162);
    a = f(a, b, c, d, k[12], 7, 1804603682);
    d = f(d, a, b, c, k[13], 12, -40341101);
    c = f(c, d, a, b, k[14], 17, -1502002290);
    b = f(b, c, d, a, k[15], 22, 1236535329);
    a = g(a, b, c, d, k[1], 5, -165796510);
    d = g(d, a, b, c, k[6], 9, -1069501632);
    c = g(c, d, a, b, k[11], 14, 643717713);
    b = g(b, c, d, a, k[0], 20, -373897302);
    a = g(a, b, c, d, k[5], 5, -701558691);
    d = g(d, a, b, c, k[10], 9, 38016083);
    c = g(c, d, a, b, k[15], 14, -660478335);
    b = g(b, c, d, a, k[4], 20, -405537848);
    a = g(a, b, c, d, k[9], 5, 568446438);
    d = g(d, a, b, c, k[14], 9, -1019803690);
    c = g(c, d, a, b, k[3], 14, -187363961);
    b = g(b, c, d, a, k[8], 20, 1163531501);
    a = g(a, b, c, d, k[13], 5, -1444681467);
    d = g(d, a, b, c, k[2], 9, -51403784);
    c = g(c, d, a, b, k[7], 14, 1735328473);
    b = g(b, c, d, a, k[12], 20, -1926607734);
    a = h(a, b, c, d, k[5], 4, -378558);
    d = h(d, a, b, c, k[8], 11, -2022574463);
    c = h(c, d, a, b, k[11], 16, 1839030562);
    b = h(b, c, d, a, k[14], 23, -35309556);
    a = h(a, b, c, d, k[1], 4, -1530992060);
    d = h(d, a, b, c, k[4], 11, 1272893353);
    c = h(c, d, a, b, k[7], 16, -155497632);
    b = h(b, c, d, a, k[10], 23, -1094730640);
    a = h(a, b, c, d, k[13], 4, 681279174);
    d = h(d, a, b, c, k[0], 11, -358537222);
    c = h(c, d, a, b, k[3], 16, -722521979);
    b = h(b, c, d, a, k[6], 23, 76029189);
    a = h(a, b, c, d, k[9], 4, -640364487);
    d = h(d, a, b, c, k[12], 11, -421815835);
    c = h(c, d, a, b, k[15], 16, 530742520);
    b = h(b, c, d, a, k[2], 23, -995338651);
    a = i(a, b, c, d, k[0], 6, -198630844);
    d = i(d, a, b, c, k[7], 10, 1126891415);
    c = i(c, d, a, b, k[14], 15, -1416354905);
    b = i(b, c, d, a, k[5], 21, -57434055);
    a = i(a, b, c, d, k[12], 6, 1700485571);
    d = i(d, a, b, c, k[3], 10, -1894986606);
    c = i(c, d, a, b, k[10], 15, -1051523);
    b = i(b, c, d, a, k[1], 21, -2054922799);
    a = i(a, b, c, d, k[8], 6, 1873313359);
    d = i(d, a, b, c, k[15], 10, -30611744);
    c = i(c, d, a, b, k[6], 15, -1560198380);
    b = i(b, c, d, a, k[13], 21, 1309151649);
    a = i(a, b, c, d, k[4], 6, -145523070);
    d = i(d, a, b, c, k[11], 10, -1120210379);
    c = i(c, d, a, b, k[2], 15, 718787259);
    b = i(b, c, d, a, k[9], 21, -343485551);
    x[0] = a + x[0] | 0;
    x[1] = b + x[1] | 0;
    x[2] = c + x[2] | 0;
    x[3] = d + x[3] | 0;
  }
  var state = [
    1732584193,
    -271733879,
    -1732584194,
    271733878
  ];
  var md5blk = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ];
  function caml_md5_string(s, start, len) {
    var s$1 = s.slice(start, len);
    var n = s$1.length;
    state[0] = 1732584193;
    state[1] = -271733879;
    state[2] = -1732584194;
    state[3] = 271733878;
    for (var i2 = 0; i2 <= 15; ++i2) {
      md5blk[i2] = 0;
    }
    var i_end = n / 64 | 0;
    for (var i$1 = 1; i$1 <= i_end; ++i$1) {
      for (var j = 0; j <= 15; ++j) {
        var k = ((i$1 << 6) - 64 | 0) + (j << 2) | 0;
        md5blk[j] = ((s$1.charCodeAt(k) + (s$1.charCodeAt(k + 1 | 0) << 8) | 0) + (s$1.charCodeAt(k + 2 | 0) << 16) | 0) + (s$1.charCodeAt(k + 3 | 0) << 24) | 0;
      }
      cycle(state, md5blk);
    }
    var s_tail = s$1.slice(i_end << 6);
    for (var kk = 0; kk <= 15; ++kk) {
      md5blk[kk] = 0;
    }
    var i_end$1 = s_tail.length - 1 | 0;
    for (var i$2 = 0; i$2 <= i_end$1; ++i$2) {
      md5blk[i$2 / 4 | 0] = md5blk[i$2 / 4 | 0] | s_tail.charCodeAt(i$2) << (i$2 % 4 << 3);
    }
    var i$3 = i_end$1 + 1 | 0;
    md5blk[i$3 / 4 | 0] = md5blk[i$3 / 4 | 0] | 128 << (i$3 % 4 << 3);
    if (i$3 > 55) {
      cycle(state, md5blk);
      for (var i$4 = 0; i$4 <= 15; ++i$4) {
        md5blk[i$4] = 0;
      }
    }
    md5blk[14] = n << 3;
    cycle(state, md5blk);
    return String.fromCharCode(state[0] & 255, state[0] >> 8 & 255, state[0] >> 16 & 255, state[0] >> 24 & 255, state[1] & 255, state[1] >> 8 & 255, state[1] >> 16 & 255, state[1] >> 24 & 255, state[2] & 255, state[2] >> 8 & 255, state[2] >> 16 & 255, state[2] >> 24 & 255, state[3] & 255, state[3] >> 8 & 255, state[3] >> 16 & 255, state[3] >> 24 & 255);
  }

  // node_modules/rescript/lib/es6/digest.js
  function string(str) {
    return caml_md5_string(str, 0, str.length);
  }

  // node_modules/rescript/lib/es6/random.js
  function full_init(s, seed) {
    var combine = function(accu2, x) {
      return string(accu2 + String(x));
    };
    var extract = function(d) {
      return ((get2(d, 0) + (get2(d, 1) << 8) | 0) + (get2(d, 2) << 16) | 0) + (get2(d, 3) << 24) | 0;
    };
    var seed$1 = seed.length === 0 ? [0] : seed;
    var l = seed$1.length;
    for (var i2 = 0; i2 <= 54; ++i2) {
      set(s.st, i2, i2);
    }
    var accu = "x";
    for (var i$1 = 0, i_finish = 54 + (55 > l ? 55 : l) | 0; i$1 <= i_finish; ++i$1) {
      var j = i$1 % 55;
      var k = i$1 % l;
      accu = combine(accu, get(seed$1, k));
      set(s.st, j, (get(s.st, j) ^ extract(accu)) & 1073741823);
    }
    s.idx = 0;
  }
  function bits(s) {
    s.idx = (s.idx + 1 | 0) % 55;
    var curval = get(s.st, s.idx);
    var newval = get(s.st, (s.idx + 24 | 0) % 55) + (curval ^ curval >>> 25 & 31) | 0;
    var newval30 = newval & 1073741823;
    set(s.st, s.idx, newval30);
    return newval30;
  }
  function $$int(s, bound) {
    if (bound > 1073741823 || bound <= 0) {
      throw {
        RE_EXN_ID: "Invalid_argument",
        _1: "Random.int",
        Error: new Error()
      };
    }
    while (true) {
      var r = bits(s);
      var v = r % bound;
      if ((r - v | 0) <= ((1073741823 - bound | 0) + 1 | 0)) {
        return v;
      }
      continue;
    }
    ;
  }
  function bool(s) {
    return (bits(s) & 1) === 0;
  }
  var $$default = {
    st: [
      987910699,
      495797812,
      364182224,
      414272206,
      318284740,
      990407751,
      383018966,
      270373319,
      840823159,
      24560019,
      536292337,
      512266505,
      189156120,
      730249596,
      143776328,
      51606627,
      140166561,
      366354223,
      1003410265,
      700563762,
      981890670,
      913149062,
      526082594,
      1021425055,
      784300257,
      667753350,
      630144451,
      949649812,
      48546892,
      415514493,
      258888527,
      511570777,
      89983870,
      283659902,
      308386020,
      242688715,
      482270760,
      865188196,
      1027664170,
      207196989,
      193777847,
      619708188,
      671350186,
      149669678,
      257044018,
      87658204,
      558145612,
      183450813,
      28133145,
      901332182,
      710253903,
      510646120,
      652377910,
      409934019,
      801085050
    ],
    idx: 0
  };
  function $$int$1(bound) {
    return $$int($$default, bound);
  }
  function bool$1(param) {
    return bool($$default);
  }
  function init2(seed) {
    return full_init($$default, [seed]);
  }

  // src/Generator.js
  function memPos(_objs, x, y) {
    while (true) {
      var objs = _objs;
      if (!objs) {
        return false;
      }
      var match = objs.hd;
      var px = match.px;
      var py = match.py;
      if (x === px && y === py) {
        return true;
      }
      _objs = objs.tl;
      continue;
    }
    ;
  }
  function trimEdge(x, y, level) {
    var pixx = blockw(level) * 16;
    var pixy = blockh(level) * 16;
    return !(x < 128 || pixx - x < 528 || y === 0 || pixy - y < 48);
  }
  function convertCoinToObj(param) {
    return make3(false, void 0, void 0, {
      TAG: 2,
      _0: 1
    }, makeItem(1), param[1], param[2]);
  }
  function addCoins(objects, x, y0, level) {
    var y = y0 - 16;
    if (bool$1(void 0) && trimEdge(x, y, level) && !memPos(objects.contents, x, y)) {
      objects.contents = {
        hd: convertCoinToObj([
          {
            _0: 1
          },
          x,
          y
        ]),
        tl: objects.contents
      };
      return;
    }
  }
  function convertEnemyToObj(param) {
    var enemyTyp = param[0];
    var obj = make3(void 0, void 0, void 0, {
      TAG: 1,
      _0: enemyTyp
    }, makeEnemy(enemyTyp, 0), param[1], param[2]);
    setVelToSpeed(obj);
    return obj;
  }
  function randomEnemyTyp(param) {
    var match = $$int$1(3);
    if (match !== 0) {
      if (match !== 1) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  }
  function addEnemyOnBlock(objects, x, y, level) {
    var placeEnemy = $$int$1(enemyDensity(level));
    if (placeEnemy === 0 && !memPos(objects.contents, x, y - 16)) {
      objects.contents = {
        hd: convertEnemyToObj([
          randomEnemyTyp(void 0),
          x,
          y - 16
        ]),
        tl: objects.contents
      };
      return;
    }
  }
  function addBlock(objects, blockTyp, xBlock, yBlock, level) {
    var x = xBlock * 16;
    var y = yBlock * 16;
    if (!(!memPos(objects.contents, x, y) && trimEdge(x, y, level))) {
      return;
    }
    var obj = make3(void 0, void 0, void 0, {
      TAG: 3,
      _0: blockTyp
    }, makeBlock(blockTyp), x, y);
    objects.contents = {
      hd: obj,
      tl: objects.contents
    };
    addCoins(objects, x, y, level);
    return addEnemyOnBlock(objects, x, y, level);
  }
  function generateGroundStairs(cbx, cby, typ, blocks, level) {
    addBlock(blocks, typ, cbx, cby, level);
    addBlock(blocks, typ, cbx + 1, cby, level);
    addBlock(blocks, typ, cbx + 2, cby, level);
    addBlock(blocks, typ, cbx + 3, cby, level);
    addBlock(blocks, typ, cbx + 1, cby - 1, level);
    addBlock(blocks, typ, cbx + 2, cby - 1, level);
    addBlock(blocks, typ, cbx + 3, cby - 1, level);
    addBlock(blocks, typ, cbx + 2, cby - 2, level);
    addBlock(blocks, typ, cbx + 3, cby - 2, level);
    return addBlock(blocks, typ, cbx + 3, cby - 3, level);
  }
  function generateAirupStairs(cbx, cby, typ, blocks, level) {
    addBlock(blocks, typ, cbx, cby, level);
    addBlock(blocks, typ, cbx + 1, cby, level);
    addBlock(blocks, typ, cbx + 3, cby - 1, level);
    addBlock(blocks, typ, cbx + 4, cby - 1, level);
    addBlock(blocks, typ, cbx + 4, cby - 2, level);
    addBlock(blocks, typ, cbx + 5, cby - 2, level);
    return addBlock(blocks, typ, cbx + 6, cby - 2, level);
  }
  function generateAirdownStairs(cbx, cby, typ, blocks, level) {
    addBlock(blocks, typ, cbx, cby, level);
    addBlock(blocks, typ, cbx + 1, cby, level);
    addBlock(blocks, typ, cbx + 2, cby, level);
    addBlock(blocks, typ, cbx + 2, cby + 1, level);
    addBlock(blocks, typ, cbx + 3, cby + 1, level);
    addBlock(blocks, typ, cbx + 5, cby + 2, level);
    return addBlock(blocks, typ, cbx + 6, cby + 2, level);
  }
  function generateClouds(_cbx, cby, typ, _num, blocks, level) {
    while (true) {
      var num = _num;
      var cbx = _cbx;
      if (num === 0) {
        return;
      }
      addBlock(blocks, typ, cbx, cby, level);
      _num = num - 1 | 0;
      _cbx = cbx + 1;
      continue;
    }
    ;
  }
  function randomStairTyp(param) {
    if (bool$1(void 0)) {
      return 2;
    } else {
      return 1;
    }
  }
  function chooseBlockPattern(cbx, cby, blocks, level) {
    if (cbx > blockw(level) || cby > blockh(level)) {
      return;
    }
    var stairTyp = randomStairTyp(void 0);
    var lifeBlock = $$int$1(5) === 0;
    var middleBlock = lifeBlock ? {
      _0: 0
    } : stairTyp;
    var match = $$int$1(5);
    switch (match) {
      case 0:
        addBlock(blocks, stairTyp, cbx, cby, level);
        addBlock(blocks, middleBlock, cbx + 1, cby, level);
        return addBlock(blocks, stairTyp, cbx + 2, cby, level);
      case 1:
        var numClouds = $$int$1(5) + 5 | 0;
        if (cby < 5) {
          return generateClouds(cbx, cby, 3, numClouds, blocks, level);
        } else {
          return;
        }
      case 2:
        if (blockh(level) - cby === 1) {
          return generateGroundStairs(cbx, cby, stairTyp, blocks, level);
        } else {
          return;
        }
      case 3:
        if (stairTyp === 1 && blockh(level) - cby > 3) {
          return generateAirdownStairs(cbx, cby, stairTyp, blocks, level);
        } else if (blockh(level) - cby > 2) {
          return generateAirupStairs(cbx, cby, stairTyp, blocks, level);
        } else {
          return addBlock(blocks, stairTyp, cbx, cby, level);
        }
      default:
        if (cby + 3 - blockh(level) === 2) {
          return addBlock(blocks, stairTyp, cbx, cby, level);
        } else if (cby + 3 - blockh(level) === 1) {
          addBlock(blocks, stairTyp, cbx, cby, level);
          return addBlock(blocks, stairTyp, cbx, cby + 1, level);
        } else {
          addBlock(blocks, stairTyp, cbx, cby, level);
          addBlock(blocks, stairTyp, cbx, cby + 1, level);
          return addBlock(blocks, stairTyp, cbx, cby + 2, level);
        }
    }
  }
  function generateEnemiesOnGround(objects, _cbx, _cby, level) {
    while (true) {
      var cby = _cby;
      var cbx = _cbx;
      if (cbx > blockw(level) - 32) {
        return;
      }
      if (cby > blockh(level) - 1 || cbx < 15) {
        _cby = 0;
        _cbx = cbx + 1;
        continue;
      }
      if (cby === 0 || blockh(level) - 1 !== cby || $$int$1(10) !== 0) {
        _cby = cby + 1;
        continue;
      }
      objects.contents = {
        hd: convertEnemyToObj([
          randomEnemyTyp(void 0),
          cbx * 16,
          cby * 16
        ]),
        tl: objects.contents
      };
      _cby = cby + 1;
      continue;
    }
    ;
  }
  function generateBlocks(objects, _cbx, _cby, level) {
    while (true) {
      var cby = _cby;
      var cbx = _cbx;
      if (blockw(level) - cbx < 33) {
        return;
      }
      if (cby > blockh(level) - 1) {
        _cby = 0;
        _cbx = cbx + 1;
        continue;
      }
      if (memPos(objects.contents, cbx, cby) || cby === 0) {
        _cby = cby + 1;
        continue;
      }
      if ($$int$1(20) === 0) {
        chooseBlockPattern(cbx, cby, objects, level);
        _cby = cby + 1;
        continue;
      }
      _cby = cby + 1;
      continue;
    }
    ;
  }
  function generatePanel(level) {
    return make3(void 0, void 0, void 0, {
      TAG: 3,
      _0: 4
    }, makeBlock(4), blockw(level) * 16 - 256, blockh(level) * 16 * 2 / 3);
  }
  function convertBlockToObj(param) {
    var blockTyp = param[0];
    return make3(void 0, void 0, void 0, {
      TAG: 3,
      _0: blockTyp
    }, makeBlock(blockTyp), param[1], param[2]);
  }
  function generateGround(objects, _inc, level) {
    while (true) {
      var inc = _inc;
      if (inc > blockw(level)) {
        return;
      }
      if (inc > 10) {
        var skip = $$int$1(10);
        if (skip === 7 && blockw(level) - inc > 32) {
          _inc = inc + 1;
          continue;
        }
        objects.contents = {
          hd: convertBlockToObj([
            5,
            inc * 16,
            blockh(level) * 16
          ]),
          tl: objects.contents
        };
        _inc = inc + 1;
        continue;
      }
      objects.contents = {
        hd: convertBlockToObj([
          5,
          inc * 16,
          blockh(level) * 16
        ]),
        tl: objects.contents
      };
      _inc = inc + 1;
      continue;
    }
    ;
  }
  function generateHelper(level) {
    var objects = {
      contents: 0
    };
    generateBlocks(objects, 0, 0, level);
    generateGround(objects, 0, level);
    generateEnemiesOnGround(objects, 0, 0, level);
    var panel = generatePanel(level);
    return {
      hd: panel,
      tl: objects.contents
    };
  }
  function generate(level) {
    init2(randomSeed(level));
    var initial = performance.now();
    var objects = generateHelper(level);
    var player1 = make3(void 0, void 0, void 0, {
      TAG: 0,
      _0: 1,
      _1: 0
    }, makePlayer(1, 0, 0, 0), 100, 224);
    var player2 = make3(void 0, void 0, void 0, {
      TAG: 0,
      _0: 1,
      _1: 1
    }, makePlayer(1, 0, 0, 1), 120, 224);
    var elapsed = performance.now() - initial;
    console.log("generated", length(objects), "objects in " + (elapsed.toString() + " milliseconds"));
    return [
      player1,
      player2,
      objects
    ];
  }

  // src/Director.js
  var collidObjs = {
    contents: 0
  };
  var particles = {
    contents: 0
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
    var delta = (time - t0) / 1e3;
    if (time - initialTime.contents < 1e3) {
      return 0;
    } else {
      return 1 / delta;
    }
  }
  function updateScore(state2, i2) {
    state2.score = state2.score + i2 | 0;
  }
  function playerAttackEnemy(o1, enemyTyp, s2, o2, state2) {
    o1.invuln = 10;
    o1.jumping = false;
    o1.grounded = true;
    if (enemyTyp >= 3) {
      var r2 = evolveEnemy(o1.dir, enemyTyp, s2, o2);
      o1.vy = -dampenJump;
      o1.py = o1.py - 5;
      return [
        void 0,
        r2
      ];
    }
    decHealth(o2);
    o1.vy = -dampenJump;
    if (state2.multiplier === 8) {
      updateScore(state2, 800);
      o2.score = 800;
      return [
        void 0,
        evolveEnemy(o1.dir, enemyTyp, s2, o2)
      ];
    }
    var score = Math.imul(100, state2.multiplier);
    updateScore(state2, score);
    o2.score = score;
    state2.multiplier = state2.multiplier << 1;
    return [
      void 0,
      evolveEnemy(o1.dir, enemyTyp, s2, o2)
    ];
  }
  function enemyAttackPlayer(o1, t2, s2, o2) {
    if (t2 >= 3) {
      var r2 = o2.vx === 0 ? evolveEnemy(o1.dir, t2, s2, o2) : (decHealth(o1), o1.invuln = invuln, void 0);
      return [
        void 0,
        r2
      ];
    }
    decHealth(o1);
    o1.invuln = invuln;
    return [
      void 0,
      void 0
    ];
  }
  function collEnemyEnemy(t1, s1, o1, t2, s2, o2, dir) {
    if (t1 !== 3) {
      if (t1 < 4) {
        if (t2 >= 3) {
          if (o2.vx === 0) {
            revDir(o1, t1, s1);
            return [
              void 0,
              void 0
            ];
          } else {
            decHealth(o1);
            return [
              void 0,
              void 0
            ];
          }
        } else if (dir >= 2) {
          revDir(o1, t1, s1);
          revDir(o2, t2, s2);
          return [
            void 0,
            void 0
          ];
        } else {
          return [
            void 0,
            void 0
          ];
        }
      }
      if (t2 >= 3) {
        decHealth(o1);
        decHealth(o2);
        return [
          void 0,
          void 0
        ];
      }
    } else if (t2 >= 3) {
      decHealth(o1);
      decHealth(o2);
      return [
        void 0,
        void 0
      ];
    }
    if (o1.vx === 0) {
      revDir(o2, t2, s2);
      return [
        void 0,
        void 0
      ];
    } else {
      decHealth(o2);
      return [
        void 0,
        void 0
      ];
    }
  }
  function processCollision(dir, obj1, obj2, state2) {
    var t2;
    var t1 = obj1.objTyp;
    switch (t1.TAG | 0) {
      case 0:
        var t = obj2.objTyp;
        switch (t.TAG | 0) {
          case 0:
            if (dir >= 2) {
              obj2.vx = obj2.vx + obj1.vx;
              return [
                void 0,
                void 0
              ];
            } else {
              return [
                void 0,
                void 0
              ];
            }
          case 1:
            var typ = t._0;
            var s2 = obj2.sprite;
            if (dir !== 1) {
              return enemyAttackPlayer(obj1, typ, s2, obj2);
            } else {
              return playerAttackEnemy(obj1, typ, s2, obj2, state2);
            }
          case 2:
            t2 = t._0;
            break;
          case 3:
            var t$1 = t._0;
            if (dir !== 0) {
              if (t$1 === 4) {
                state2.status = {
                  levelResult: 0,
                  finishTime: performance.now()
                };
                return [
                  void 0,
                  void 0
                ];
              } else if (dir !== 1) {
                collideBlock(dir, obj1);
                return [
                  void 0,
                  void 0
                ];
              } else {
                state2.multiplier = 1;
                collideBlock(dir, obj1);
                return [
                  void 0,
                  void 0
                ];
              }
            }
            if (typeof t$1 === "number") {
              if (t$1 !== 1) {
                if (t$1 !== 4) {
                  collideBlock(dir, obj1);
                  return [
                    void 0,
                    void 0
                  ];
                } else {
                  state2.status = {
                    levelResult: 0,
                    finishTime: performance.now()
                  };
                  return [
                    void 0,
                    void 0
                  ];
                }
              } else if (t1._0 === 0) {
                collideBlock(dir, obj1);
                decHealth(obj2);
                return [
                  void 0,
                  void 0
                ];
              } else {
                collideBlock(dir, obj1);
                return [
                  void 0,
                  void 0
                ];
              }
            }
            var updatedBlock = evolveBlock(obj2);
            var spawnedItem = spawnAbove(obj1.dir, obj2, t$1._0);
            collideBlock(dir, obj1);
            return [
              spawnedItem,
              updatedBlock
            ];
        }
        break;
      case 1:
        var t1$1 = t1._0;
        var s1 = obj1.sprite;
        var t2$1 = obj2.objTyp;
        switch (t2$1.TAG | 0) {
          case 0:
            if (dir !== 0) {
              return enemyAttackPlayer(obj1, t1$1, s1, obj2);
            } else {
              return playerAttackEnemy(obj1, t1$1, s1, obj2, state2);
            }
          case 1:
            var s2$1 = obj2.sprite;
            return collEnemyEnemy(t1$1, s1, obj1, t2$1._0, s2$1, obj2, dir);
          case 2:
            return [
              void 0,
              void 0
            ];
          case 3:
            var t2$2 = t2$1._0;
            if (dir >= 2) {
              if (t1$1 >= 3) {
                if (typeof t2$2 === "number") {
                  if (t2$2 !== 1) {
                    revDir(obj1, t1$1, s1);
                    return [
                      void 0,
                      void 0
                    ];
                  } else {
                    decHealth(obj2);
                    reverseLeftRight(obj1);
                    return [
                      void 0,
                      void 0
                    ];
                  }
                }
                var updatedBlock$1 = evolveBlock(obj2);
                var spawnedItem$1 = spawnAbove(obj1.dir, obj2, t2$2._0);
                revDir(obj1, t1$1, s1);
                return [
                  updatedBlock$1,
                  spawnedItem$1
                ];
              }
              revDir(obj1, t1$1, s1);
              return [
                void 0,
                void 0
              ];
            }
            collideBlock(dir, obj1);
            return [
              void 0,
              void 0
            ];
        }
      case 2:
        var match = obj2.objTyp;
        switch (match.TAG | 0) {
          case 0:
            t2 = t1._0;
            break;
          case 1:
          case 2:
            return [
              void 0,
              void 0
            ];
          case 3:
            if (dir >= 2) {
              reverseLeftRight(obj1);
              return [
                void 0,
                void 0
              ];
            } else {
              collideBlock(dir, obj1);
              return [
                void 0,
                void 0
              ];
            }
        }
        break;
      case 3:
        return [
          void 0,
          void 0
        ];
    }
    if (t2) {
      state2.coins = state2.coins + 1 | 0;
      decHealth(obj2);
      updateScore(state2, 100);
      return [
        void 0,
        void 0
      ];
    } else {
      decHealth(obj2);
      if (obj1.health === 2) {
      } else {
        obj1.health = obj1.health + 1 | 0;
      }
      obj1.vx = 0;
      obj1.vy = 0;
      updateScore(state2, 1e3);
      obj2.score = 1e3;
      return [
        void 0,
        void 0
      ];
    }
  }
  function viewportFilter(obj, state2) {
    if (inViewport(state2.viewport, obj.px, obj.py) || isPlayer(obj)) {
      return true;
    } else {
      return outOfViewportBelow(state2.viewport, obj.py);
    }
  }
  function broadPhase(allCollids, state2) {
    return keep(allCollids, function(o) {
      return viewportFilter(o, state2);
    });
  }
  function narrowPhase(obj, cs, state2) {
    var _cs = cs;
    var _acc = 0;
    while (true) {
      var acc = _acc;
      var cs$1 = _cs;
      if (!cs$1) {
        return acc;
      }
      var h2 = cs$1.hd;
      var newObjs;
      if (equals(obj, h2)) {
        newObjs = [
          void 0,
          void 0
        ];
      } else {
        var dir = checkCollision(obj, h2);
        newObjs = dir !== void 0 && h2.id !== obj.id ? processCollision(dir, obj, h2, state2) : [
          void 0,
          void 0
        ];
      }
      var o = newObjs[0];
      var acc$1;
      if (o !== void 0) {
        var o2 = newObjs[1];
        acc$1 = o2 !== void 0 ? {
          hd: o,
          tl: {
            hd: o2,
            tl: acc
          }
        } : {
          hd: o,
          tl: acc
        };
      } else {
        var o$1 = newObjs[1];
        acc$1 = o$1 !== void 0 ? {
          hd: o$1,
          tl: acc
        } : acc;
      }
      _acc = acc$1;
      _cs = cs$1.tl;
      continue;
    }
    ;
  }
  function checkCollisions(obj, state2, objects) {
    var match = obj.objTyp;
    if (match.TAG === 3) {
      return 0;
    }
    var broad = broadPhase(objects, state2);
    return narrowPhase(obj, broad, state2);
  }
  function updateObject0(obj, state2, objects, level) {
    var spr = obj.sprite;
    obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
    if (!((!obj.kill || isPlayer(obj)) && viewportFilter(obj, state2))) {
      return 0;
    }
    obj.grounded = false;
    processObj(obj, level);
    var evolved = checkCollisions(obj, state2, objects);
    var vptAdjXy = fromCoord(state2.viewport, obj.px, obj.py);
    render(spr, vptAdjXy.x, vptAdjXy.y);
    if (checkBboxEnabled(void 0)) {
      renderBbox(spr, vptAdjXy.x, vptAdjXy.y);
    }
    if (obj.vx !== 0 || !isEnemy(obj)) {
      updateAnimation(spr);
    }
    return evolved;
  }
  function updateObject(obj, state2, objects, level) {
    var match = obj.objTyp;
    if (match.TAG === 0) {
      var n = match._1;
      var keys = translateKeys(n);
      obj.crouch = false;
      updatePlayer(obj, n, keys);
      var evolved = updateObject0(obj, state2, objects, level);
      collidObjs.contents = $at(evolved, collidObjs.contents);
      return;
    }
    var evolved$1 = updateObject0(obj, state2, objects, level);
    if (!obj.kill) {
      collidObjs.contents = {
        hd: obj,
        tl: $at(evolved$1, collidObjs.contents)
      };
    }
    var newParts = obj.kill ? kill(obj) : 0;
    particles.contents = $at(newParts, particles.contents);
  }
  function updateParticle(state2, part) {
    $$process(part);
    var x = part.px - state2.viewport.px;
    var y = part.py - state2.viewport.py;
    render(part.params.sprite, x, y);
    if (!part.kill) {
      particles.contents = {
        hd: part,
        tl: particles.contents
      };
      return;
    }
  }
  function updateLoop(player1, player2, level, objects) {
    var viewport = make4(getCanvasSizeScaled(void 0), mapDim(level));
    update(viewport, player1.px, player1.py);
    var state2 = {
      bgd: makeBgd(void 0),
      coins: 0,
      level,
      multiplier: 1,
      score: 0,
      status: 0,
      viewport
    };
    var updateHelper = function(objects2, parts) {
      var match = state2.status;
      var exit = 0;
      if (match) {
        var finishTime = match.finishTime;
        if (performance.now() - finishTime > delayWhenFinished) {
          var levelResult = match.levelResult;
          var timeToStart = restartAfter - (performance.now() - finishTime) / 1e3;
          if (timeToStart > 0) {
            levelFinished(levelResult, String(state2.level), String(timeToStart | 0));
            requestAnimationFrame(function(param) {
              return updateHelper(collidObjs.contents, particles.contents);
            });
            return;
          }
          var level$1 = levelResult === 0 ? level + 1 | 0 : level;
          var match$1 = generate(level$1);
          return updateLoop(match$1[0], match$1[1], level$1, match$1[2]);
        }
        exit = 1;
      } else {
        exit = 1;
      }
      if (exit === 1) {
        var fps2 = calcFps(void 0);
        collidObjs.contents = 0;
        particles.contents = 0;
        clearCanvas(void 0);
        var vposXInt = state2.viewport.px / 5 | 0;
        var bgdWidth = state2.bgd.params.frameSize[0] | 0;
        drawBgd(state2.bgd, mod_(vposXInt, bgdWidth));
        updateObject(player1, state2, {
          hd: player2,
          tl: objects2
        }, level);
        updateObject(player2, state2, {
          hd: player1,
          tl: objects2
        }, level);
        if (player1.kill === true) {
          var match$2 = state2.status;
          var exit$1 = 0;
          if (!(match$2 && match$2.levelResult)) {
            exit$1 = 2;
          }
          if (exit$1 === 2) {
            state2.status = {
              levelResult: 1,
              finishTime: performance.now()
            };
          }
        }
        update(state2.viewport, player1.px, player1.py);
        forEach(objects2, function(obj) {
          return updateObject(obj, state2, objects2, level);
        });
        forEach(parts, function(part) {
          return updateParticle(state2, part);
        });
        fps(fps2);
        hud(state2.score, state2.coins);
        requestAnimationFrame(function(param) {
          return updateHelper(collidObjs.contents, particles.contents);
        });
        return;
      }
    };
    return updateHelper(objects, 0);
  }

  // src/Mareo.js
  function preload(param) {
    var loadCount = {
      contents: 0
    };
    var numImages = images.length;
    return forEachU(images, function(img_src) {
      var img = document.createElement("img");
      img.src = spritesDir + img_src;
      img.addEventListener("load", function(param2) {
        loadCount.contents = loadCount.contents + 1 | 0;
        if (loadCount.contents === numImages) {
          var match = generate(1);
          updateLoop(match[0], match[1], 1, match[2]);
        }
        return true;
      }, true);
    });
  }
  window.onload = function(param) {
    preload(void 0);
    return true;
  };
})();
