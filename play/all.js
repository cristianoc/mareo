(function () {
  'use strict';

  function randomSeed(param) {
    return 34;
  }

  function levelWidth(level) {
    switch (level) {
      case 1 :
          return 800;
      case 2 :
          return 1200;
      case 3 :
          return 2400;
      case 4 :
          return 3500;
      case 5 :
          return 4500;
      case 6 :
          return 6000;
      case 7 :
          return 8000;
      case 8 :
          return 10000;
      case 9 :
          return 12000;
      default:
        return 1500 * level;
    }
  }

  function levelHeight(param) {
    return 256;
  }

  function enemyDensity(level) {
    switch (level) {
      case 1 :
      case 2 :
      case 3 :
          return 20;
      case 4 :
      case 5 :
          return 15;
      case 6 :
          return 10;
      case 7 :
      case 8 :
          return 5;
      case 9 :
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
  /* No side effect */

  function caml_array_sub(x, offset, len) {
    var result = new Array(len);
    var j = 0;
    var i = offset;
    while(j < len) {
      result[j] = x[i];
      j = j + 1 | 0;
      i = i + 1 | 0;
    }  return result;
  }

  function caml_array_set(xs, index, newval) {
    if (index < 0 || index >= xs.length) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "index out of bounds",
            Error: new Error()
          };
    }
    xs[index] = newval;
    
  }

  function caml_array_get(xs, index) {
    if (index < 0 || index >= xs.length) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "index out of bounds",
            Error: new Error()
          };
    }
    return xs[index];
  }
  /* No side effect */

  function app(_f, _args) {
    while(true) {
      var args = _args;
      var f = _f;
      var init_arity = f.length;
      var arity = init_arity === 0 ? 1 : init_arity;
      var len = args.length;
      var d = arity - len | 0;
      if (d === 0) {
        return f.apply(null, args);
      }
      if (d >= 0) {
        return (function(f,args){
        return function (x) {
          return app(f, args.concat([x]));
        }
        }(f,args));
      }
      _args = caml_array_sub(args, arity, -d | 0);
      _f = f.apply(null, caml_array_sub(args, 0, arity));
      continue ;
    }}

  function _1(o, a0) {
    var arity = o.length;
    if (arity === 1) {
      return o(a0);
    } else {
      switch (arity) {
        case 1 :
            return o(a0);
        case 2 :
            return function (param) {
              return o(a0, param);
            };
        case 3 :
            return function (param, param$1) {
              return o(a0, param, param$1);
            };
        case 4 :
            return function (param, param$1, param$2) {
              return o(a0, param, param$1, param$2);
            };
        case 5 :
            return function (param, param$1, param$2, param$3) {
              return o(a0, param, param$1, param$2, param$3);
            };
        case 6 :
            return function (param, param$1, param$2, param$3, param$4) {
              return o(a0, param, param$1, param$2, param$3, param$4);
            };
        case 7 :
            return function (param, param$1, param$2, param$3, param$4, param$5) {
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
      return function (a0) {
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
        case 1 :
            return app(o(a0), [a1]);
        case 2 :
            return o(a0, a1);
        case 3 :
            return function (param) {
              return o(a0, a1, param);
            };
        case 4 :
            return function (param, param$1) {
              return o(a0, a1, param, param$1);
            };
        case 5 :
            return function (param, param$1, param$2) {
              return o(a0, a1, param, param$1, param$2);
            };
        case 6 :
            return function (param, param$1, param$2, param$3) {
              return o(a0, a1, param, param$1, param$2, param$3);
            };
        case 7 :
            return function (param, param$1, param$2, param$3, param$4) {
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
      return function (a0, a1) {
        return _2(o, a0, a1);
      };
    }
  }
  /* No side effect */

  function caml_float_min(x, y) {
    if (x < y) {
      return x;
    } else {
      return y;
    }
  }

  function caml_int_max(x, y) {
    if (x > y) {
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
  /* No side effect */

  function forEachU(a, f) {
    for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
      f(a[i]);
    }
    
  }
  /* No side effect */

  var m = (function(xs,ys){
        xs._1 = ys; 
  });

  function copyAuxWitFilter(f, _cellX, _prec) {
    while(true) {
      var prec = _prec;
      var cellX = _cellX;
      if (!cellX) {
        return ;
      }
      var t = cellX._1;
      var h = cellX._0;
      if (f(h)) {
        var next = /* :: */{
          _0: h,
          _1: /* [] */0
        };
        m(prec, next);
        _prec = next;
        _cellX = t;
        continue ;
      }
      _cellX = t;
      continue ;
    }}

  function length(xs) {
    var _x = xs;
    var _acc = 0;
    while(true) {
      var acc = _acc;
      var x = _x;
      if (!x) {
        return acc;
      }
      _acc = acc + 1 | 0;
      _x = x._1;
      continue ;
    }}

  function forEachU$1(_xs, f) {
    while(true) {
      var xs = _xs;
      if (!xs) {
        return ;
      }
      f(xs._0);
      _xs = xs._1;
      continue ;
    }}

  function forEach(xs, f) {
    return forEachU$1(xs, __1(f));
  }

  function reduceU(_l, _accu, f) {
    while(true) {
      var accu = _accu;
      var l = _l;
      if (!l) {
        return accu;
      }
      _accu = f(accu, l._0);
      _l = l._1;
      continue ;
    }}

  function reduce(l, accu, f) {
    return reduceU(l, accu, __2(f));
  }

  function keepU(_xs, p) {
    while(true) {
      var xs = _xs;
      if (!xs) {
        return /* [] */0;
      }
      var t = xs._1;
      var h = xs._0;
      if (p(h)) {
        var cell = /* :: */{
          _0: h,
          _1: /* [] */0
        };
        copyAuxWitFilter(p, t, cell);
        return cell;
      }
      _xs = t;
      continue ;
    }}

  function keep(xs, p) {
    return keepU(xs, __1(p));
  }
  /* No side effect */

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
          
      }
    } else if (match >= 32) {
      switch (match - 32 | 0) {
        case 1 :
        case 2 :
        case 3 :
        case 4 :
            break;
        case 5 :
            pressedKeys.left1 = true;
            break;
        case 0 :
        case 6 :
            pressedKeys.up1 = true;
            break;
        case 7 :
            pressedKeys.right1 = true;
            break;
        case 8 :
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
          if (match >= 69) ; else {
            pressedKeys.right2 = false;
          }
        } else {
          pressedKeys.up2 = false;
        }
      } else {
        pressedKeys.down2 = false;
      }
    } else if (match >= 41) {
      if (match !== 65) ; else {
        pressedKeys.left2 = false;
      }
    } else if (match >= 32) {
      switch (match - 32 | 0) {
        case 1 :
        case 2 :
        case 3 :
        case 4 :
            break;
        case 5 :
            pressedKeys.left1 = false;
            break;
        case 0 :
        case 6 :
            pressedKeys.up1 = false;
            break;
        case 7 :
            pressedKeys.right1 = false;
            break;
        case 8 :
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
    var ctrls1_1 = /* :: */{
      _0: [
        pressedKeys.right1,
        /* CRight */1
      ],
      _1: /* :: */{
        _0: [
          pressedKeys.up1,
          /* CUp */2
        ],
        _1: /* :: */{
          _0: [
            pressedKeys.down1,
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
      pressedKeys.left2,
      /* CLeft */0
    ];
    var ctrls2_1 = /* :: */{
      _0: [
        pressedKeys.right2,
        /* CRight */1
      ],
      _1: /* :: */{
        _0: [
          pressedKeys.up2,
          /* CUp */2
        ],
        _1: /* :: */{
          _0: [
            pressedKeys.down2,
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
    return reduce(playerNum === /* One */0 ? ctrls1 : ctrls2, /* [] */0, (function (a, x) {
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
  /* No side effect */

  var id = {
    contents: 0
  };

  function create(str) {
    id.contents = id.contents + 1 | 0;
    return str + ("/" + id.contents);
  }
  /* No side effect */

  var Undefined = create("CamlinternalLazy.Undefined");

  function forward_with_closure(blk, closure) {
    var result = closure();
    blk.value = result;
    blk.RE_LAZY_DONE = true;
    return result;
  }

  function raise_undefined() {
    throw {
          RE_EXN_ID: Undefined,
          Error: new Error()
        };
  }

  function force(lzv) {
    if (lzv.RE_LAZY_DONE) {
      return lzv.value;
    } else {
      var closure = lzv.value;
      lzv.value = raise_undefined;
      try {
        return forward_with_closure(lzv, closure);
      }
      catch (e){
        lzv.value = (function () {
            throw e;
          });
        throw e;
      }
    }
  }
  /* No side effect */

  var canvasAndContext = {
    RE_LAZY_DONE: false,
    value: (function () {
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
                  context: context
                };
        }
        console.log("cant find canvas " + (canvasId + " \n"));
        throw {
              RE_EXN_ID: "Assert_failure",
              _1: [
                "Load.re",
                13,
                8
              ],
              Error: new Error()
            };
      })
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
  /* No side effect */

  function caml_fill_bytes(s, i, l, c) {
    if (l <= 0) {
      return ;
    }
    for(var k = i ,k_finish = l + i | 0; k < k_finish; ++k){
      s[k] = c;
    }
    
  }

  function caml_create_bytes(len) {
    if (len < 0) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "String.create",
            Error: new Error()
          };
    }
    var result = new Array(len);
    for(var i = 0; i < len; ++i){
      result[i] = /* "\000" */0;
    }
    return result;
  }

  function caml_blit_bytes(s1, i1, s2, i2, len) {
    if (len <= 0) {
      return ;
    }
    if (s1 === s2) {
      if (i1 < i2) {
        var range_a = (s1.length - i2 | 0) - 1 | 0;
        var range_b = len - 1 | 0;
        var range = range_a > range_b ? range_b : range_a;
        for(var j = range; j >= 0; --j){
          s1[i2 + j | 0] = s1[i1 + j | 0];
        }
        return ;
      }
      if (i1 <= i2) {
        return ;
      }
      var range_a$1 = (s1.length - i1 | 0) - 1 | 0;
      var range_b$1 = len - 1 | 0;
      var range$1 = range_a$1 > range_b$1 ? range_b$1 : range_a$1;
      for(var k = 0; k <= range$1; ++k){
        s1[i2 + k | 0] = s1[i1 + k | 0];
      }
      return ;
    }
    var off1 = s1.length - i1 | 0;
    if (len <= off1) {
      for(var i = 0; i < len; ++i){
        s2[i2 + i | 0] = s1[i1 + i | 0];
      }
      return ;
    }
    for(var i$1 = 0; i$1 < off1; ++i$1){
      s2[i2 + i$1 | 0] = s1[i1 + i$1 | 0];
    }
    for(var i$2 = off1; i$2 < len; ++i$2){
      s2[i2 + i$2 | 0] = /* "\000" */0;
    }
    
  }

  function bytes_to_string(a) {
    var len = a.length;
    var s = "";
    var s_len = len;
    if ( len <= 4096 && len === a.length) {
      return String.fromCharCode.apply(null, a);
    }
    var offset = 0;
    while(s_len > 0) {
      var next = s_len < 1024 ? s_len : 1024;
      var tmp_bytes = new Array(next);
      caml_blit_bytes(a, offset, tmp_bytes, 0, next);
      s = s + String.fromCharCode.apply(null, tmp_bytes);
      s_len = s_len - next | 0;
      offset = offset + next | 0;
    }  return s;
  }

  function caml_blit_string(s1, i1, s2, i2, len) {
    if (len <= 0) {
      return ;
    }
    var off1 = s1.length - i1 | 0;
    if (len <= off1) {
      for(var i = 0; i < len; ++i){
        s2[i2 + i | 0] = s1.charCodeAt(i1 + i | 0);
      }
      return ;
    }
    for(var i$1 = 0; i$1 < off1; ++i$1){
      s2[i2 + i$1 | 0] = s1.charCodeAt(i1 + i$1 | 0);
    }
    for(var i$2 = off1; i$2 < len; ++i$2){
      s2[i2 + i$2 | 0] = /* "\000" */0;
    }
    
  }

  function bytes_of_string(s) {
    var len = s.length;
    var res = new Array(len);
    for(var i = 0; i < len; ++i){
      res[i] = s.charCodeAt(i);
    }
    return res;
  }
  /* No side effect */

  function escaped(c) {
    var exit = 0;
    if (c >= 40) {
      if (c === 92) {
        return "\\\\";
      }
      exit = c >= 127 ? 1 : 2;
    } else if (c >= 32) {
      if (c >= 39) {
        return "\\'";
      }
      exit = 2;
    } else if (c >= 14) {
      exit = 1;
    } else {
      switch (c) {
        case 8 :
            return "\\b";
        case 9 :
            return "\\t";
        case 10 :
            return "\\n";
        case 0 :
        case 1 :
        case 2 :
        case 3 :
        case 4 :
        case 5 :
        case 6 :
        case 7 :
        case 11 :
        case 12 :
            exit = 1;
            break;
        case 13 :
            return "\\r";
        
      }
    }
    switch (exit) {
      case 1 :
          var s = [
            0,
            0,
            0,
            0
          ];
          s[0] = /* "\\" */92;
          s[1] = 48 + (c / 100 | 0) | 0;
          s[2] = 48 + (c / 10 | 0) % 10 | 0;
          s[3] = 48 + c % 10 | 0;
          return bytes_to_string(s);
      case 2 :
          var s$1 = [0];
          s$1[0] = c;
          return bytes_to_string(s$1);
      
    }
  }

  function uppercase_ascii(c) {
    if (c >= /* "a" */97 && c <= /* "z" */122) {
      return c - 32 | 0;
    } else {
      return c;
    }
  }
  /* No side effect */

  var $$Error = create("Caml_js_exceptions.Error");
  /* No side effect */

  function make(n, c) {
    var s = caml_create_bytes(n);
    caml_fill_bytes(s, 0, n, c);
    return s;
  }

  function copy(s) {
    var len = s.length;
    var r = caml_create_bytes(len);
    caml_blit_bytes(s, 0, r, 0, len);
    return r;
  }

  function sub(s, ofs, len) {
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

  function sub_string(b, ofs, len) {
    return bytes_to_string(sub(b, ofs, len));
  }

  function blit(s1, ofs1, s2, ofs2, len) {
    if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "Bytes.blit",
            Error: new Error()
          };
    }
    return caml_blit_bytes(s1, ofs1, s2, ofs2, len);
  }

  function blit_string(s1, ofs1, s2, ofs2, len) {
    if (len < 0 || ofs1 < 0 || ofs1 > (s1.length - len | 0) || ofs2 < 0 || ofs2 > (s2.length - len | 0)) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "String.blit / Bytes.blit_string",
            Error: new Error()
          };
    }
    return caml_blit_string(s1, ofs1, s2, ofs2, len);
  }

  function escaped$1(s) {
    var n = 0;
    for(var i = 0 ,i_finish = s.length; i < i_finish; ++i){
      var match = s[i];
      var tmp;
      if (match >= 32) {
        var switcher = match - 34 | 0;
        tmp = switcher > 58 || switcher < 0 ? (
            switcher >= 93 ? 4 : 1
          ) : (
            switcher > 57 || switcher < 1 ? 2 : 1
          );
      } else {
        tmp = match >= 11 ? (
            match !== 13 ? 4 : 2
          ) : (
            match >= 8 ? 2 : 4
          );
      }
      n = n + tmp | 0;
    }
    if (n === s.length) {
      return copy(s);
    }
    var s$prime = caml_create_bytes(n);
    n = 0;
    for(var i$1 = 0 ,i_finish$1 = s.length; i$1 < i_finish$1; ++i$1){
      var c = s[i$1];
      var exit = 0;
      if (c >= 35) {
        if (c !== 92) {
          if (c >= 127) {
            exit = 1;
          } else {
            s$prime[n] = c;
          }
        } else {
          exit = 2;
        }
      } else if (c >= 32) {
        if (c >= 34) {
          exit = 2;
        } else {
          s$prime[n] = c;
        }
      } else if (c >= 14) {
        exit = 1;
      } else {
        switch (c) {
          case 8 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "b" */98;
              break;
          case 9 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "t" */116;
              break;
          case 10 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "n" */110;
              break;
          case 0 :
          case 1 :
          case 2 :
          case 3 :
          case 4 :
          case 5 :
          case 6 :
          case 7 :
          case 11 :
          case 12 :
              exit = 1;
              break;
          case 13 :
              s$prime[n] = /* "\\" */92;
              n = n + 1 | 0;
              s$prime[n] = /* "r" */114;
              break;
          
        }
      }
      switch (exit) {
        case 1 :
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = 48 + (c / 100 | 0) | 0;
            n = n + 1 | 0;
            s$prime[n] = 48 + (c / 10 | 0) % 10 | 0;
            n = n + 1 | 0;
            s$prime[n] = 48 + c % 10 | 0;
            break;
        case 2 :
            s$prime[n] = /* "\\" */92;
            n = n + 1 | 0;
            s$prime[n] = c;
            break;
        
      }
      n = n + 1 | 0;
    }
    return s$prime;
  }

  function map(f, s) {
    var l = s.length;
    if (l === 0) {
      return s;
    }
    var r = caml_create_bytes(l);
    for(var i = 0; i < l; ++i){
      r[i] = _1(f, s[i]);
    }
    return r;
  }

  function uppercase_ascii$1(s) {
    return map(uppercase_ascii, s);
  }
  /* No side effect */

  function escaped$2(s) {
    var needs_escape = function (_i) {
      while(true) {
        var i = _i;
        if (i >= s.length) {
          return false;
        }
        var match = s.charCodeAt(i);
        if (match < 32) {
          return true;
        }
        var switcher = match - 34 | 0;
        if (switcher > 58 || switcher < 0) {
          if (switcher >= 93) {
            return true;
          }
          _i = i + 1 | 0;
          continue ;
        }
        if (switcher > 57 || switcher < 1) {
          return true;
        }
        _i = i + 1 | 0;
        continue ;
      }  };
    if (needs_escape(0)) {
      return bytes_to_string(escaped$1(bytes_of_string(s)));
    } else {
      return s;
    }
  }

  var blit$1 = blit_string;
  /* No side effect */

  function mk(lo, hi) {
    return /* Int64 */{
            hi: hi,
            lo: (lo >>> 0)
          };
  }

  var min_int = /* Int64 */{
    hi: -2147483648,
    lo: 0
  };

  var max_int = /* Int64 */{
    hi: 2147483647,
    lo: 4294967295
  };

  var one = /* Int64 */{
    hi: 0,
    lo: 1
  };

  var zero = /* Int64 */{
    hi: 0,
    lo: 0
  };

  var neg_one = /* Int64 */{
    hi: -1,
    lo: 4294967295
  };

  function neg_signed(x) {
    return (x & 2147483648) !== 0;
  }

  function non_neg_signed(x) {
    return (x & 2147483648) === 0;
  }

  function neg(param) {
    var other_lo = (param.lo ^ -1) + 1 | 0;
    return mk(other_lo, (param.hi ^ -1) + (
                other_lo === 0 ? 1 : 0
              ) | 0);
  }

  function add_aux(param, y_lo, y_hi) {
    var x_lo = param.lo;
    var lo = x_lo + y_lo | 0;
    var overflow = neg_signed(x_lo) && (neg_signed(y_lo) || non_neg_signed(lo)) || neg_signed(y_lo) && non_neg_signed(lo) ? 1 : 0;
    return mk(lo, param.hi + y_hi + overflow | 0);
  }

  function add(self, param) {
    return add_aux(self, param.lo, param.hi);
  }

  function eq(x, y) {
    if (x.hi === y.hi) {
      return x.lo === y.lo;
    } else {
      return false;
    }
  }

  function sub_aux(x, lo, hi) {
    var y_lo = ((lo ^ -1) + 1 >>> 0);
    var y_hi = (hi ^ -1) + (
      y_lo === 0 ? 1 : 0
    ) | 0;
    return add_aux(x, y_lo, y_hi);
  }

  function sub$1(self, param) {
    return sub_aux(self, param.lo, param.hi);
  }

  function lsl_(x, numBits) {
    if (numBits === 0) {
      return x;
    }
    var lo = x.lo;
    if (numBits >= 32) {
      return mk(0, (lo << (numBits - 32 | 0)));
    } else {
      return mk((lo << numBits), (lo >>> (32 - numBits | 0)) | (x.hi << numBits));
    }
  }

  function asr_(x, numBits) {
    if (numBits === 0) {
      return x;
    }
    var hi = x.hi;
    if (numBits < 32) {
      return mk((hi << (32 - numBits | 0)) | (x.lo >>> numBits), (hi >> numBits));
    } else {
      return mk((hi >> (numBits - 32 | 0)), hi >= 0 ? 0 : -1);
    }
  }

  function is_zero(param) {
    if (param.hi !== 0 || param.lo !== 0) {
      return false;
    } else {
      return true;
    }
  }

  function mul(_this, _other) {
    while(true) {
      var other = _other;
      var $$this = _this;
      var lo;
      var exit = 0;
      var exit$1 = 0;
      if ($$this.hi !== 0) {
        exit$1 = 3;
      } else {
        if ($$this.lo === 0) {
          return zero;
        }
        exit$1 = 3;
      }
      if (exit$1 === 3) {
        if (other.hi !== 0) {
          exit = 2;
        } else {
          if (other.lo === 0) {
            return zero;
          }
          exit = 2;
        }
      }
      if (exit === 2) {
        var this_hi = $$this.hi;
        var exit$2 = 0;
        if (this_hi !== -2147483648 || $$this.lo !== 0) {
          exit$2 = 3;
        } else {
          lo = other.lo;
        }
        if (exit$2 === 3) {
          var other_hi = other.hi;
          var lo$1 = $$this.lo;
          var exit$3 = 0;
          if (other_hi !== -2147483648 || other.lo !== 0) {
            exit$3 = 4;
          } else {
            lo = lo$1;
          }
          if (exit$3 === 4) {
            var other_lo = other.lo;
            if (this_hi < 0) {
              if (other_hi >= 0) {
                return neg(mul(neg($$this), other));
              }
              _other = neg(other);
              _this = neg($$this);
              continue ;
            }
            if (other_hi < 0) {
              return neg(mul($$this, neg(other)));
            }
            var a48 = (this_hi >>> 16);
            var a32 = this_hi & 65535;
            var a16 = (lo$1 >>> 16);
            var a00 = lo$1 & 65535;
            var b48 = (other_hi >>> 16);
            var b32 = other_hi & 65535;
            var b16 = (other_lo >>> 16);
            var b00 = other_lo & 65535;
            var c48 = 0;
            var c32 = 0;
            var c16 = 0;
            var c00 = a00 * b00;
            c16 = (c00 >>> 16) + a16 * b00;
            c32 = (c16 >>> 16);
            c16 = (c16 & 65535) + a00 * b16;
            c32 = c32 + (c16 >>> 16) + a32 * b00;
            c48 = (c32 >>> 16);
            c32 = (c32 & 65535) + a16 * b16;
            c48 = c48 + (c32 >>> 16);
            c32 = (c32 & 65535) + a00 * b32;
            c48 = c48 + (c32 >>> 16);
            c32 = c32 & 65535;
            c48 = c48 + (a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48) & 65535;
            return mk(c00 & 65535 | ((c16 & 65535) << 16), c32 | (c48 << 16));
          }
          
        }
        
      }
      if ((lo & 1) === 0) {
        return zero;
      } else {
        return min_int;
      }
    }}

  function ge(param, param$1) {
    var other_hi = param$1.hi;
    var hi = param.hi;
    if (hi > other_hi) {
      return true;
    } else if (hi < other_hi) {
      return false;
    } else {
      return param.lo >= param$1.lo;
    }
  }

  function neq(x, y) {
    return !eq(x, y);
  }

  function lt(x, y) {
    return !ge(x, y);
  }

  function gt(x, y) {
    if (x.hi > y.hi) {
      return true;
    } else if (x.hi < y.hi) {
      return false;
    } else {
      return x.lo > y.lo;
    }
  }

  function to_float(param) {
    return param.hi * 0x100000000 + param.lo;
  }

  function of_float(x) {
    if (isNaN(x) || !isFinite(x)) {
      return zero;
    } else if (x <= -9.22337203685477581e+18) {
      return min_int;
    } else if (x + 1 >= 9.22337203685477581e+18) {
      return max_int;
    } else if (x < 0) {
      return neg(of_float(-x));
    } else {
      return mk(x % 4294967296 | 0, x / 4294967296 | 0);
    }
  }

  function isSafeInteger(param) {
    var hi = param.hi;
    var top11Bits = (hi >> 21);
    if (top11Bits === 0) {
      return true;
    } else if (top11Bits === -1) {
      return !(param.lo === 0 && hi === (4292870144 | 0));
    } else {
      return false;
    }
  }

  function to_string(self) {
    if (isSafeInteger(self)) {
      return String(to_float(self));
    }
    if (self.hi < 0) {
      if (eq(self, min_int)) {
        return "-9223372036854775808";
      } else {
        return "-" + to_string(neg(self));
      }
    }
    var approx_div1 = of_float(Math.floor(to_float(self) / 10));
    var lo = approx_div1.lo;
    var hi = approx_div1.hi;
    var match = sub_aux(sub_aux(self, (lo << 3), (lo >>> 29) | (hi << 3)), (lo << 1), (lo >>> 31) | (hi << 1));
    var rem_lo = match.lo;
    var rem_hi = match.hi;
    if (rem_lo === 0 && rem_hi === 0) {
      return to_string(approx_div1) + "0";
    }
    if (rem_hi < 0) {
      var rem_lo$1 = ((rem_lo ^ -1) + 1 >>> 0);
      var delta = Math.ceil(rem_lo$1 / 10);
      var remainder = 10 * delta - rem_lo$1;
      return to_string(sub_aux(approx_div1, delta | 0, 0)) + String(remainder | 0);
    }
    var rem_lo$2 = rem_lo;
    var delta$1 = Math.floor(rem_lo$2 / 10);
    var remainder$1 = rem_lo$2 - 10 * delta$1;
    return to_string(add_aux(approx_div1, delta$1 | 0, 0)) + String(remainder$1 | 0);
  }

  function div(_self, _other) {
    while(true) {
      var other = _other;
      var self = _self;
      var exit = 0;
      var exit$1 = 0;
      if (other.hi !== 0 || other.lo !== 0) {
        exit$1 = 3;
      } else {
        throw {
              RE_EXN_ID: "Division_by_zero",
              Error: new Error()
            };
      }
      if (exit$1 === 3) {
        var match = self.hi;
        if (match !== -2147483648) {
          if (match !== 0) {
            exit = 2;
          } else {
            if (self.lo === 0) {
              return zero;
            }
            exit = 2;
          }
        } else if (self.lo !== 0) {
          exit = 2;
        } else {
          if (eq(other, one) || eq(other, neg_one)) {
            return self;
          }
          if (eq(other, min_int)) {
            return one;
          }
          var half_this = asr_(self, 1);
          var approx = lsl_(div(half_this, other), 1);
          var exit$2 = 0;
          if (approx.hi !== 0) {
            exit$2 = 4;
          } else {
            if (approx.lo === 0) {
              if (other.hi < 0) {
                return one;
              } else {
                return neg(one);
              }
            }
            exit$2 = 4;
          }
          if (exit$2 === 4) {
            var rem = sub$1(self, mul(other, approx));
            return add(approx, div(rem, other));
          }
          
        }
      }
      if (exit === 2 && other.hi === -2147483648 && other.lo === 0) {
        return zero;
      }
      var other_hi = other.hi;
      if (self.hi < 0) {
        if (other_hi >= 0) {
          return neg(div(neg(self), other));
        }
        _other = neg(other);
        _self = neg(self);
        continue ;
      }
      if (other_hi < 0) {
        return neg(div(self, neg(other)));
      }
      var res = zero;
      var rem$1 = self;
      while(ge(rem$1, other)) {
        var approx$1 = caml_float_max(1, Math.floor(to_float(rem$1) / to_float(other)));
        var log2 = Math.ceil(Math.log(approx$1) / Math.LN2);
        var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
        var approxRes = of_float(approx$1);
        var approxRem = mul(approxRes, other);
        while(approxRem.hi < 0 || gt(approxRem, rem$1)) {
          approx$1 = approx$1 - delta;
          approxRes = of_float(approx$1);
          approxRem = mul(approxRes, other);
        }      if (is_zero(approxRes)) {
          approxRes = one;
        }
        res = add(res, approxRes);
        rem$1 = sub$1(rem$1, approxRem);
      }    return res;
    }}

  function div_mod(self, other) {
    var quotient = div(self, other);
    return [
            quotient,
            sub$1(self, mul(quotient, other))
          ];
  }

  function to_int32(x) {
    return x.lo | 0;
  }

  function to_hex(x) {
    var x_lo = x.lo;
    var x_hi = x.hi;
    var aux = function (v) {
      return (v >>> 0).toString(16);
    };
    if (x_hi === 0 && x_lo === 0) {
      return "0";
    }
    if (x_lo === 0) {
      return aux(x_hi) + "00000000";
    }
    if (x_hi === 0) {
      return aux(x_lo);
    }
    var lo = aux(x_lo);
    var pad = 8 - lo.length | 0;
    if (pad <= 0) {
      return aux(x_hi) + lo;
    } else {
      return aux(x_hi) + ("0".repeat(pad) + lo);
    }
  }

  function discard_sign(x) {
    return /* Int64 */{
            hi: 2147483647 & x.hi,
            lo: x.lo
          };
  }
  /* No side effect */

  function int_of_base(param) {
    switch (param) {
      case /* Oct */0 :
          return 8;
      case /* Hex */1 :
          return 16;
      case /* Dec */2 :
          return 10;
      
    }
  }

  function lowercase(c) {
    if (c >= /* "A" */65 && c <= /* "Z" */90 || c >= /* "\192" */192 && c <= /* "\214" */214 || c >= /* "\216" */216 && c <= /* "\222" */222) {
      return c + 32 | 0;
    } else {
      return c;
    }
  }

  function parse_format(fmt) {
    var len = fmt.length;
    if (len > 31) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "format_int: format too long",
            Error: new Error()
          };
    }
    var f = {
      justify: "+",
      signstyle: "-",
      filter: " ",
      alternate: false,
      base: /* Dec */2,
      signedconv: false,
      width: 0,
      uppercase: false,
      sign: 1,
      prec: -1,
      conv: "f"
    };
    var _i = 0;
    while(true) {
      var i = _i;
      if (i >= len) {
        return f;
      }
      var c = fmt.charCodeAt(i);
      var exit = 0;
      if (c >= 69) {
        if (c >= 88) {
          if (c >= 121) {
            exit = 1;
          } else {
            switch (c - 88 | 0) {
              case 0 :
                  f.base = /* Hex */1;
                  f.uppercase = true;
                  _i = i + 1 | 0;
                  continue ;
              case 13 :
              case 14 :
              case 15 :
                  exit = 5;
                  break;
              case 12 :
              case 17 :
                  exit = 4;
                  break;
              case 23 :
                  f.base = /* Oct */0;
                  _i = i + 1 | 0;
                  continue ;
              case 29 :
                  f.base = /* Dec */2;
                  _i = i + 1 | 0;
                  continue ;
              case 1 :
              case 2 :
              case 3 :
              case 4 :
              case 5 :
              case 6 :
              case 7 :
              case 8 :
              case 9 :
              case 10 :
              case 11 :
              case 16 :
              case 18 :
              case 19 :
              case 20 :
              case 21 :
              case 22 :
              case 24 :
              case 25 :
              case 26 :
              case 27 :
              case 28 :
              case 30 :
              case 31 :
                  exit = 1;
                  break;
              case 32 :
                  f.base = /* Hex */1;
                  _i = i + 1 | 0;
                  continue ;
              
            }
          }
        } else if (c >= 72) {
          exit = 1;
        } else {
          f.signedconv = true;
          f.uppercase = true;
          f.conv = String.fromCharCode(lowercase(c));
          _i = i + 1 | 0;
          continue ;
        }
      } else {
        switch (c) {
          case 35 :
              f.alternate = true;
              _i = i + 1 | 0;
              continue ;
          case 32 :
          case 43 :
              exit = 2;
              break;
          case 45 :
              f.justify = "-";
              _i = i + 1 | 0;
              continue ;
          case 46 :
              f.prec = 0;
              var j = i + 1 | 0;
              while((function(j){
                  return function () {
                    var w = fmt.charCodeAt(j) - /* "0" */48 | 0;
                    return w >= 0 && w <= 9;
                  }
                  }(j))()) {
                f.prec = (Math.imul(f.prec, 10) + fmt.charCodeAt(j) | 0) - /* "0" */48 | 0;
                j = j + 1 | 0;
              }            _i = j;
              continue ;
          case 33 :
          case 34 :
          case 36 :
          case 37 :
          case 38 :
          case 39 :
          case 40 :
          case 41 :
          case 42 :
          case 44 :
          case 47 :
              exit = 1;
              break;
          case 48 :
              f.filter = "0";
              _i = i + 1 | 0;
              continue ;
          case 49 :
          case 50 :
          case 51 :
          case 52 :
          case 53 :
          case 54 :
          case 55 :
          case 56 :
          case 57 :
              exit = 3;
              break;
          default:
            exit = 1;
        }
      }
      switch (exit) {
        case 1 :
            _i = i + 1 | 0;
            continue ;
        case 2 :
            f.signstyle = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
        case 3 :
            f.width = 0;
            var j$1 = i;
            while((function(j$1){
                return function () {
                  var w = fmt.charCodeAt(j$1) - /* "0" */48 | 0;
                  return w >= 0 && w <= 9;
                }
                }(j$1))()) {
              f.width = (Math.imul(f.width, 10) + fmt.charCodeAt(j$1) | 0) - /* "0" */48 | 0;
              j$1 = j$1 + 1 | 0;
            }          _i = j$1;
            continue ;
        case 4 :
            f.signedconv = true;
            f.base = /* Dec */2;
            _i = i + 1 | 0;
            continue ;
        case 5 :
            f.signedconv = true;
            f.conv = String.fromCharCode(c);
            _i = i + 1 | 0;
            continue ;
        
      }
    }}

  function finish_formatting(config, rawbuffer) {
    var justify = config.justify;
    var signstyle = config.signstyle;
    var filter = config.filter;
    var alternate = config.alternate;
    var base = config.base;
    var signedconv = config.signedconv;
    var width = config.width;
    var uppercase = config.uppercase;
    var sign = config.sign;
    var len = rawbuffer.length;
    if (signedconv && (sign < 0 || signstyle !== "-")) {
      len = len + 1 | 0;
    }
    if (alternate) {
      if (base === /* Oct */0) {
        len = len + 1 | 0;
      } else if (base === /* Hex */1) {
        len = len + 2 | 0;
      }
      
    }
    var buffer = "";
    if (justify === "+" && filter === " ") {
      for(var _for = len; _for < width; ++_for){
        buffer = buffer + filter;
      }
    }
    if (signedconv) {
      if (sign < 0) {
        buffer = buffer + "-";
      } else if (signstyle !== "-") {
        buffer = buffer + signstyle;
      }
      
    }
    if (alternate && base === /* Oct */0) {
      buffer = buffer + "0";
    }
    if (alternate && base === /* Hex */1) {
      buffer = buffer + "0x";
    }
    if (justify === "+" && filter === "0") {
      for(var _for$1 = len; _for$1 < width; ++_for$1){
        buffer = buffer + filter;
      }
    }
    buffer = uppercase ? buffer + rawbuffer.toUpperCase() : buffer + rawbuffer;
    if (justify === "-") {
      for(var _for$2 = len; _for$2 < width; ++_for$2){
        buffer = buffer + " ";
      }
    }
    return buffer;
  }

  function caml_format_int(fmt, i) {
    if (fmt === "%d") {
      return String(i);
    }
    var f = parse_format(fmt);
    var i$1 = i < 0 ? (
        f.signedconv ? (f.sign = -1, -i) : (i >>> 0)
      ) : i;
    var s = i$1.toString(int_of_base(f.base));
    if (f.prec >= 0) {
      f.filter = " ";
      var n = f.prec - s.length | 0;
      if (n > 0) {
        s = "0".repeat(n) + s;
      }
      
    }
    return finish_formatting(f, s);
  }

  function dec_of_pos_int64(x) {
    if (!lt(x, zero)) {
      return to_string(x);
    }
    var wbase = mk(10, 0);
    var y = discard_sign(x);
    var match = div_mod(y, wbase);
    var match$1 = div_mod(add(mk(8, 0), match[1]), wbase);
    var quotient = add(add(mk(-858993460, 214748364), match[0]), match$1[0]);
    return to_string(quotient) + "0123456789"[to_int32(match$1[1])];
  }

  function oct_of_int64(x) {
    var s = "";
    var wbase = mk(8, 0);
    var cvtbl = "01234567";
    if (lt(x, zero)) {
      var y = discard_sign(x);
      var match = div_mod(y, wbase);
      var quotient = add(mk(0, 268435456), match[0]);
      var modulus = match[1];
      s = cvtbl[to_int32(modulus)] + s;
      while(neq(quotient, zero)) {
        var match$1 = div_mod(quotient, wbase);
        quotient = match$1[0];
        modulus = match$1[1];
        s = cvtbl[to_int32(modulus)] + s;
      }  } else {
      var match$2 = div_mod(x, wbase);
      var quotient$1 = match$2[0];
      var modulus$1 = match$2[1];
      s = cvtbl[to_int32(modulus$1)] + s;
      while(neq(quotient$1, zero)) {
        var match$3 = div_mod(quotient$1, wbase);
        quotient$1 = match$3[0];
        modulus$1 = match$3[1];
        s = cvtbl[to_int32(modulus$1)] + s;
      }  }
    return s;
  }

  function caml_int64_format(fmt, x) {
    if (fmt === "%d") {
      return to_string(x);
    }
    var f = parse_format(fmt);
    var x$1 = f.signedconv && lt(x, zero) ? (f.sign = -1, neg(x)) : x;
    var match = f.base;
    var s;
    switch (match) {
      case /* Oct */0 :
          s = oct_of_int64(x$1);
          break;
      case /* Hex */1 :
          s = to_hex(x$1);
          break;
      case /* Dec */2 :
          s = dec_of_pos_int64(x$1);
          break;
      
    }
    var fill_s;
    if (f.prec >= 0) {
      f.filter = " ";
      var n = f.prec - s.length | 0;
      fill_s = n > 0 ? "0".repeat(n) + s : s;
    } else {
      fill_s = s;
    }
    return finish_formatting(f, fill_s);
  }

  function caml_format_float(fmt, x) {
    var f = parse_format(fmt);
    var prec = f.prec < 0 ? 6 : f.prec;
    var x$1 = x < 0 ? (f.sign = -1, -x) : x;
    var s = "";
    if (isNaN(x$1)) {
      s = "nan";
      f.filter = " ";
    } else if (isFinite(x$1)) {
      var match = f.conv;
      switch (match) {
        case "e" :
            s = x$1.toExponential(prec);
            var i = s.length;
            if (s[i - 3 | 0] === "e") {
              s = s.slice(0, i - 1 | 0) + ("0" + s.slice(i - 1 | 0));
            }
            break;
        case "f" :
            s = x$1.toFixed(prec);
            break;
        case "g" :
            var prec$1 = prec !== 0 ? prec : 1;
            s = x$1.toExponential(prec$1 - 1 | 0);
            var j = s.indexOf("e");
            var exp = Number(s.slice(j + 1 | 0)) | 0;
            if (exp < -4 || x$1 >= 1e21 || x$1.toFixed().length > prec$1) {
              var i$1 = j - 1 | 0;
              while(s[i$1] === "0") {
                i$1 = i$1 - 1 | 0;
              }            if (s[i$1] === ".") {
                i$1 = i$1 - 1 | 0;
              }
              s = s.slice(0, i$1 + 1 | 0) + s.slice(j);
              var i$2 = s.length;
              if (s[i$2 - 3 | 0] === "e") {
                s = s.slice(0, i$2 - 1 | 0) + ("0" + s.slice(i$2 - 1 | 0));
              }
              
            } else {
              var p = prec$1;
              if (exp < 0) {
                p = p - (exp + 1 | 0) | 0;
                s = x$1.toFixed(p);
              } else {
                while((function () {
                        s = x$1.toFixed(p);
                        return s.length > (prec$1 + 1 | 0);
                      })()) {
                  p = p - 1 | 0;
                }            }
              if (p !== 0) {
                var k = s.length - 1 | 0;
                while(s[k] === "0") {
                  k = k - 1 | 0;
                }              if (s[k] === ".") {
                  k = k - 1 | 0;
                }
                s = s.slice(0, k + 1 | 0);
              }
              
            }
            break;
          
      }
    } else {
      s = "inf";
      f.filter = " ";
    }
    return finish_formatting(f, s);
  }

  var caml_hexstring_of_float = (function(x,prec,style){
    if (!isFinite(x)) {
      if (isNaN(x)) return "nan";
      return x > 0 ? "infinity":"-infinity";
    }
    var sign = (x==0 && 1/x == -Infinity)?1:(x>=0)?0:1;
    if(sign) x = -x;
    var exp = 0;
    if (x == 0) ;
    else if (x < 1) {
      while (x < 1 && exp > -1022)  { x *= 2; exp--; }
    } else {
      while (x >= 2) { x /= 2; exp++; }
    }
    var exp_sign = exp < 0 ? '' : '+';
    var sign_str = '';
    if (sign) sign_str = '-';
    else {
      switch(style){
      case 43 /* '+' */: sign_str = '+'; break;
      case 32 /* ' ' */: sign_str = ' '; break;
      }
    }
    if (prec >= 0 && prec < 13) {
      /* If a precision is given, and is small, round mantissa accordingly */
        var cst = Math.pow(2,prec * 4);
        x = Math.round(x * cst) / cst;
    }
    var x_str = x.toString(16);
    if(prec >= 0){
        var idx = x_str.indexOf('.');
      if(idx<0) {
        x_str += '.' +  '0'.repeat(prec);
      }
      else {
        var size = idx+1+prec;
        if(x_str.length < size)
          x_str += '0'.repeat(size - x_str.length);
        else
          x_str = x_str.substr(0,size);
      }
    }
    return  (sign_str + '0x' + x_str + 'p' + exp_sign + exp.toString(10));
  });

  var caml_nativeint_format = caml_format_int;

  var caml_int32_format = caml_format_int;
  /* No side effect */

  function get(s, i) {
    if (i >= s.length || i < 0) {
      throw {
            RE_EXN_ID: "Invalid_argument",
            _1: "index out of bounds",
            Error: new Error()
          };
    }
    return s.charCodeAt(i);
  }
  /* No side effect */

  function erase_rel(rest) {
    if (typeof rest === "number") {
      return /* End_of_fmtty */0;
    }
    switch (rest.TAG | 0) {
      case /* Char_ty */0 :
          return {
                  TAG: /* Char_ty */0,
                  _0: erase_rel(rest._0)
                };
      case /* String_ty */1 :
          return {
                  TAG: /* String_ty */1,
                  _0: erase_rel(rest._0)
                };
      case /* Int_ty */2 :
          return {
                  TAG: /* Int_ty */2,
                  _0: erase_rel(rest._0)
                };
      case /* Int32_ty */3 :
          return {
                  TAG: /* Int32_ty */3,
                  _0: erase_rel(rest._0)
                };
      case /* Nativeint_ty */4 :
          return {
                  TAG: /* Nativeint_ty */4,
                  _0: erase_rel(rest._0)
                };
      case /* Int64_ty */5 :
          return {
                  TAG: /* Int64_ty */5,
                  _0: erase_rel(rest._0)
                };
      case /* Float_ty */6 :
          return {
                  TAG: /* Float_ty */6,
                  _0: erase_rel(rest._0)
                };
      case /* Bool_ty */7 :
          return {
                  TAG: /* Bool_ty */7,
                  _0: erase_rel(rest._0)
                };
      case /* Format_arg_ty */8 :
          return {
                  TAG: /* Format_arg_ty */8,
                  _0: rest._0,
                  _1: erase_rel(rest._1)
                };
      case /* Format_subst_ty */9 :
          var ty1 = rest._0;
          return {
                  TAG: /* Format_subst_ty */9,
                  _0: ty1,
                  _1: ty1,
                  _2: erase_rel(rest._2)
                };
      case /* Alpha_ty */10 :
          return {
                  TAG: /* Alpha_ty */10,
                  _0: erase_rel(rest._0)
                };
      case /* Theta_ty */11 :
          return {
                  TAG: /* Theta_ty */11,
                  _0: erase_rel(rest._0)
                };
      case /* Any_ty */12 :
          return {
                  TAG: /* Any_ty */12,
                  _0: erase_rel(rest._0)
                };
      case /* Reader_ty */13 :
          return {
                  TAG: /* Reader_ty */13,
                  _0: erase_rel(rest._0)
                };
      case /* Ignored_reader_ty */14 :
          return {
                  TAG: /* Ignored_reader_ty */14,
                  _0: erase_rel(rest._0)
                };
      
    }
  }

  function concat_fmtty(fmtty1, fmtty2) {
    if (typeof fmtty1 === "number") {
      return fmtty2;
    }
    switch (fmtty1.TAG | 0) {
      case /* Char_ty */0 :
          return {
                  TAG: /* Char_ty */0,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* String_ty */1 :
          return {
                  TAG: /* String_ty */1,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Int_ty */2 :
          return {
                  TAG: /* Int_ty */2,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Int32_ty */3 :
          return {
                  TAG: /* Int32_ty */3,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Nativeint_ty */4 :
          return {
                  TAG: /* Nativeint_ty */4,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Int64_ty */5 :
          return {
                  TAG: /* Int64_ty */5,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Float_ty */6 :
          return {
                  TAG: /* Float_ty */6,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Bool_ty */7 :
          return {
                  TAG: /* Bool_ty */7,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Format_arg_ty */8 :
          return {
                  TAG: /* Format_arg_ty */8,
                  _0: fmtty1._0,
                  _1: concat_fmtty(fmtty1._1, fmtty2)
                };
      case /* Format_subst_ty */9 :
          return {
                  TAG: /* Format_subst_ty */9,
                  _0: fmtty1._0,
                  _1: fmtty1._1,
                  _2: concat_fmtty(fmtty1._2, fmtty2)
                };
      case /* Alpha_ty */10 :
          return {
                  TAG: /* Alpha_ty */10,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Theta_ty */11 :
          return {
                  TAG: /* Theta_ty */11,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Any_ty */12 :
          return {
                  TAG: /* Any_ty */12,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Reader_ty */13 :
          return {
                  TAG: /* Reader_ty */13,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      case /* Ignored_reader_ty */14 :
          return {
                  TAG: /* Ignored_reader_ty */14,
                  _0: concat_fmtty(fmtty1._0, fmtty2)
                };
      
    }
  }

  function concat_fmt(fmt1, fmt2) {
    if (typeof fmt1 === "number") {
      return fmt2;
    }
    switch (fmt1.TAG | 0) {
      case /* Char */0 :
          return {
                  TAG: /* Char */0,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* Caml_char */1 :
          return {
                  TAG: /* Caml_char */1,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* String */2 :
          return {
                  TAG: /* String */2,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Caml_string */3 :
          return {
                  TAG: /* Caml_string */3,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Int */4 :
          return {
                  TAG: /* Int */4,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: fmt1._2,
                  _3: concat_fmt(fmt1._3, fmt2)
                };
      case /* Int32 */5 :
          return {
                  TAG: /* Int32 */5,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: fmt1._2,
                  _3: concat_fmt(fmt1._3, fmt2)
                };
      case /* Nativeint */6 :
          return {
                  TAG: /* Nativeint */6,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: fmt1._2,
                  _3: concat_fmt(fmt1._3, fmt2)
                };
      case /* Int64 */7 :
          return {
                  TAG: /* Int64 */7,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: fmt1._2,
                  _3: concat_fmt(fmt1._3, fmt2)
                };
      case /* Float */8 :
          return {
                  TAG: /* Float */8,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: fmt1._2,
                  _3: concat_fmt(fmt1._3, fmt2)
                };
      case /* Bool */9 :
          return {
                  TAG: /* Bool */9,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Flush */10 :
          return {
                  TAG: /* Flush */10,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* String_literal */11 :
          return {
                  TAG: /* String_literal */11,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Char_literal */12 :
          return {
                  TAG: /* Char_literal */12,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Format_arg */13 :
          return {
                  TAG: /* Format_arg */13,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: concat_fmt(fmt1._2, fmt2)
                };
      case /* Format_subst */14 :
          return {
                  TAG: /* Format_subst */14,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: concat_fmt(fmt1._2, fmt2)
                };
      case /* Alpha */15 :
          return {
                  TAG: /* Alpha */15,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* Theta */16 :
          return {
                  TAG: /* Theta */16,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* Formatting_lit */17 :
          return {
                  TAG: /* Formatting_lit */17,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Formatting_gen */18 :
          return {
                  TAG: /* Formatting_gen */18,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Reader */19 :
          return {
                  TAG: /* Reader */19,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* Scan_char_set */20 :
          return {
                  TAG: /* Scan_char_set */20,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: concat_fmt(fmt1._2, fmt2)
                };
      case /* Scan_get_counter */21 :
          return {
                  TAG: /* Scan_get_counter */21,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Scan_next_char */22 :
          return {
                  TAG: /* Scan_next_char */22,
                  _0: concat_fmt(fmt1._0, fmt2)
                };
      case /* Ignored_param */23 :
          return {
                  TAG: /* Ignored_param */23,
                  _0: fmt1._0,
                  _1: concat_fmt(fmt1._1, fmt2)
                };
      case /* Custom */24 :
          return {
                  TAG: /* Custom */24,
                  _0: fmt1._0,
                  _1: fmt1._1,
                  _2: concat_fmt(fmt1._2, fmt2)
                };
      
    }
  }
  /* No side effect */

  var Exit = create("Pervasives.Exit");

  function abs(x) {
    if (x >= 0) {
      return x;
    } else {
      return -x | 0;
    }
  }

  var min_int$1 = -2147483648;

  function classify_float(x) {
    if (isFinite(x)) {
      if (Math.abs(x) >= 2.22507385850720138e-308) {
        return /* FP_normal */0;
      } else if (x !== 0) {
        return /* FP_subnormal */1;
      } else {
        return /* FP_zero */2;
      }
    } else if (isNaN(x)) {
      return /* FP_nan */4;
    } else {
      return /* FP_infinite */3;
    }
  }

  function string_of_bool(b) {
    if (b) {
      return "true";
    } else {
      return "false";
    }
  }

  function $at(l1, l2) {
    if (l1) {
      return /* :: */{
              _0: l1._0,
              _1: $at(l1._1, l2)
            };
    } else {
      return l2;
    }
  }
  /* No side effect */

  function create$1(n) {
    var n$1 = n < 1 ? 1 : n;
    var s = caml_create_bytes(n$1);
    return {
            buffer: s,
            position: 0,
            length: n$1,
            initial_buffer: s
          };
  }

  function contents(b) {
    return sub_string(b.buffer, 0, b.position);
  }

  function resize(b, more) {
    var len = b.length;
    var new_len = len;
    while((b.position + more | 0) > new_len) {
      new_len = (new_len << 1);
    }  var new_buffer = caml_create_bytes(new_len);
    blit(b.buffer, 0, new_buffer, 0, b.position);
    b.buffer = new_buffer;
    b.length = new_len;
    
  }

  function add_char(b, c) {
    var pos = b.position;
    if (pos >= b.length) {
      resize(b, 1);
    }
    b.buffer[pos] = c;
    b.position = pos + 1 | 0;
    
  }

  function add_string(b, s) {
    var len = s.length;
    var new_position = b.position + len | 0;
    if (new_position > b.length) {
      resize(b, len);
    }
    blit_string(s, 0, b.buffer, b.position, len);
    b.position = new_position;
    
  }
  /* No side effect */

  var for_in = (function(o,foo){
          for (var x in o) { foo(x); }});

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
    if (tag_a === 256) {
      return a[1] === b[1];
    }
    var len_a = a.length | 0;
    var len_b = b.length | 0;
    if (len_a === len_b) {
      if (Array.isArray(a)) {
        var _i = 0;
        while(true) {
          var i = _i;
          if (i === len_a) {
            return true;
          }
          if (!caml_equal(a[i], b[i])) {
            return false;
          }
          _i = i + 1 | 0;
          continue ;
        }    } else if ((a instanceof Date && b instanceof Date)) {
        return !(a > b || a < b);
      } else {
        var result = {
          contents: true
        };
        var do_key_a = function (key) {
          if (!b.hasOwnProperty(key)) {
            result.contents = false;
            return ;
          }
          
        };
        var do_key_b = function (key) {
          if (!a.hasOwnProperty(key) || !caml_equal(b[key], a[key])) {
            result.contents = false;
            return ;
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

  function caml_notequal(a, b) {
    return !caml_equal(a, b);
  }
  /* No side effect */

  function buffer_check_size(buf, overhead) {
    var len = buf.bytes.length;
    var min_len = buf.ind + overhead | 0;
    if (min_len <= len) {
      return ;
    }
    var new_len = caml_int_max((len << 1), min_len);
    var new_str = caml_create_bytes(new_len);
    blit(buf.bytes, 0, new_str, 0, len);
    buf.bytes = new_str;
    
  }

  function buffer_add_char(buf, c) {
    buffer_check_size(buf, 1);
    buf.bytes[buf.ind] = c;
    buf.ind = buf.ind + 1 | 0;
    
  }

  function buffer_add_string(buf, s) {
    var str_len = s.length;
    buffer_check_size(buf, str_len);
    blit$1(s, 0, buf.bytes, buf.ind, str_len);
    buf.ind = buf.ind + str_len | 0;
    
  }

  function buffer_contents(buf) {
    return sub_string(buf.bytes, 0, buf.ind);
  }

  function char_of_fconv(fconv) {
    switch (fconv) {
      case /* Float_f */0 :
      case /* Float_pf */1 :
      case /* Float_sf */2 :
          return /* "f" */102;
      case /* Float_e */3 :
      case /* Float_pe */4 :
      case /* Float_se */5 :
          return /* "e" */101;
      case /* Float_E */6 :
      case /* Float_pE */7 :
      case /* Float_sE */8 :
          return /* "E" */69;
      case /* Float_g */9 :
      case /* Float_pg */10 :
      case /* Float_sg */11 :
          return /* "g" */103;
      case /* Float_G */12 :
      case /* Float_pG */13 :
      case /* Float_sG */14 :
          return /* "G" */71;
      case /* Float_F */15 :
          return /* "F" */70;
      case /* Float_h */16 :
      case /* Float_ph */17 :
      case /* Float_sh */18 :
          return /* "h" */104;
      case /* Float_H */19 :
      case /* Float_pH */20 :
      case /* Float_sH */21 :
          return /* "H" */72;
      
    }
  }

  function bprint_fconv_flag(buf, fconv) {
    switch (fconv) {
      case /* Float_f */0 :
      case /* Float_e */3 :
      case /* Float_E */6 :
      case /* Float_g */9 :
      case /* Float_G */12 :
      case /* Float_F */15 :
      case /* Float_h */16 :
      case /* Float_H */19 :
          return ;
      case /* Float_pf */1 :
      case /* Float_pe */4 :
      case /* Float_pE */7 :
      case /* Float_pg */10 :
      case /* Float_pG */13 :
      case /* Float_ph */17 :
      case /* Float_pH */20 :
          return buffer_add_char(buf, /* "+" */43);
      case /* Float_sf */2 :
      case /* Float_se */5 :
      case /* Float_sE */8 :
      case /* Float_sg */11 :
      case /* Float_sG */14 :
      case /* Float_sh */18 :
      case /* Float_sH */21 :
          return buffer_add_char(buf, /* " " */32);
      
    }
  }

  function string_of_formatting_lit(formatting_lit) {
    if (typeof formatting_lit === "number") {
      switch (formatting_lit) {
        case /* Close_box */0 :
            return "@]";
        case /* Close_tag */1 :
            return "@}";
        case /* FFlush */2 :
            return "@?";
        case /* Force_newline */3 :
            return "@\n";
        case /* Flush_newline */4 :
            return "@.";
        case /* Escaped_at */5 :
            return "@@";
        case /* Escaped_percent */6 :
            return "@%";
        
      }
    } else {
      switch (formatting_lit.TAG | 0) {
        case /* Break */0 :
        case /* Magic_size */1 :
            return formatting_lit._0;
        case /* Scan_indic */2 :
            return "@" + bytes_to_string(make(1, formatting_lit._0));
        
      }
    }
  }

  function bprint_fmtty(buf, _fmtty) {
    while(true) {
      var fmtty = _fmtty;
      if (typeof fmtty === "number") {
        return ;
      }
      switch (fmtty.TAG | 0) {
        case /* Char_ty */0 :
            buffer_add_string(buf, "%c");
            _fmtty = fmtty._0;
            continue ;
        case /* String_ty */1 :
            buffer_add_string(buf, "%s");
            _fmtty = fmtty._0;
            continue ;
        case /* Int_ty */2 :
            buffer_add_string(buf, "%i");
            _fmtty = fmtty._0;
            continue ;
        case /* Int32_ty */3 :
            buffer_add_string(buf, "%li");
            _fmtty = fmtty._0;
            continue ;
        case /* Nativeint_ty */4 :
            buffer_add_string(buf, "%ni");
            _fmtty = fmtty._0;
            continue ;
        case /* Int64_ty */5 :
            buffer_add_string(buf, "%Li");
            _fmtty = fmtty._0;
            continue ;
        case /* Float_ty */6 :
            buffer_add_string(buf, "%f");
            _fmtty = fmtty._0;
            continue ;
        case /* Bool_ty */7 :
            buffer_add_string(buf, "%B");
            _fmtty = fmtty._0;
            continue ;
        case /* Format_arg_ty */8 :
            buffer_add_string(buf, "%{");
            bprint_fmtty(buf, fmtty._0);
            buffer_add_string(buf, "%}");
            _fmtty = fmtty._1;
            continue ;
        case /* Format_subst_ty */9 :
            buffer_add_string(buf, "%(");
            bprint_fmtty(buf, fmtty._0);
            buffer_add_string(buf, "%)");
            _fmtty = fmtty._2;
            continue ;
        case /* Alpha_ty */10 :
            buffer_add_string(buf, "%a");
            _fmtty = fmtty._0;
            continue ;
        case /* Theta_ty */11 :
            buffer_add_string(buf, "%t");
            _fmtty = fmtty._0;
            continue ;
        case /* Any_ty */12 :
            buffer_add_string(buf, "%?");
            _fmtty = fmtty._0;
            continue ;
        case /* Reader_ty */13 :
            buffer_add_string(buf, "%r");
            _fmtty = fmtty._0;
            continue ;
        case /* Ignored_reader_ty */14 :
            buffer_add_string(buf, "%_r");
            _fmtty = fmtty._0;
            continue ;
        
      }
    }}

  function symm(rest) {
    if (typeof rest === "number") {
      return /* End_of_fmtty */0;
    }
    switch (rest.TAG | 0) {
      case /* Char_ty */0 :
          return {
                  TAG: /* Char_ty */0,
                  _0: symm(rest._0)
                };
      case /* String_ty */1 :
          return {
                  TAG: /* String_ty */1,
                  _0: symm(rest._0)
                };
      case /* Int_ty */2 :
          return {
                  TAG: /* Int_ty */2,
                  _0: symm(rest._0)
                };
      case /* Int32_ty */3 :
          return {
                  TAG: /* Int32_ty */3,
                  _0: symm(rest._0)
                };
      case /* Nativeint_ty */4 :
          return {
                  TAG: /* Nativeint_ty */4,
                  _0: symm(rest._0)
                };
      case /* Int64_ty */5 :
          return {
                  TAG: /* Int64_ty */5,
                  _0: symm(rest._0)
                };
      case /* Float_ty */6 :
          return {
                  TAG: /* Float_ty */6,
                  _0: symm(rest._0)
                };
      case /* Bool_ty */7 :
          return {
                  TAG: /* Bool_ty */7,
                  _0: symm(rest._0)
                };
      case /* Format_arg_ty */8 :
          return {
                  TAG: /* Format_arg_ty */8,
                  _0: rest._0,
                  _1: symm(rest._1)
                };
      case /* Format_subst_ty */9 :
          return {
                  TAG: /* Format_subst_ty */9,
                  _0: rest._1,
                  _1: rest._0,
                  _2: symm(rest._2)
                };
      case /* Alpha_ty */10 :
          return {
                  TAG: /* Alpha_ty */10,
                  _0: symm(rest._0)
                };
      case /* Theta_ty */11 :
          return {
                  TAG: /* Theta_ty */11,
                  _0: symm(rest._0)
                };
      case /* Any_ty */12 :
          return {
                  TAG: /* Any_ty */12,
                  _0: symm(rest._0)
                };
      case /* Reader_ty */13 :
          return {
                  TAG: /* Reader_ty */13,
                  _0: symm(rest._0)
                };
      case /* Ignored_reader_ty */14 :
          return {
                  TAG: /* Ignored_reader_ty */14,
                  _0: symm(rest._0)
                };
      
    }
  }

  function fmtty_rel_det(rest) {
    if (typeof rest === "number") {
      return [
              (function (param) {
                  return /* Refl */0;
                }),
              (function (param) {
                  return /* Refl */0;
                }),
              (function (param) {
                  return /* Refl */0;
                }),
              (function (param) {
                  return /* Refl */0;
                })
            ];
    }
    switch (rest.TAG | 0) {
      case /* Char_ty */0 :
          var match = fmtty_rel_det(rest._0);
          var af = match[1];
          var fa = match[0];
          return [
                  (function (param) {
                      _1(fa, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match[2],
                  match[3]
                ];
      case /* String_ty */1 :
          var match$1 = fmtty_rel_det(rest._0);
          var af$1 = match$1[1];
          var fa$1 = match$1[0];
          return [
                  (function (param) {
                      _1(fa$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$1[2],
                  match$1[3]
                ];
      case /* Int_ty */2 :
          var match$2 = fmtty_rel_det(rest._0);
          var af$2 = match$2[1];
          var fa$2 = match$2[0];
          return [
                  (function (param) {
                      _1(fa$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$2[2],
                  match$2[3]
                ];
      case /* Int32_ty */3 :
          var match$3 = fmtty_rel_det(rest._0);
          var af$3 = match$3[1];
          var fa$3 = match$3[0];
          return [
                  (function (param) {
                      _1(fa$3, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$3, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$3[2],
                  match$3[3]
                ];
      case /* Nativeint_ty */4 :
          var match$4 = fmtty_rel_det(rest._0);
          var af$4 = match$4[1];
          var fa$4 = match$4[0];
          return [
                  (function (param) {
                      _1(fa$4, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$4, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$4[2],
                  match$4[3]
                ];
      case /* Int64_ty */5 :
          var match$5 = fmtty_rel_det(rest._0);
          var af$5 = match$5[1];
          var fa$5 = match$5[0];
          return [
                  (function (param) {
                      _1(fa$5, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$5, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$5[2],
                  match$5[3]
                ];
      case /* Float_ty */6 :
          var match$6 = fmtty_rel_det(rest._0);
          var af$6 = match$6[1];
          var fa$6 = match$6[0];
          return [
                  (function (param) {
                      _1(fa$6, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$6, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$6[2],
                  match$6[3]
                ];
      case /* Bool_ty */7 :
          var match$7 = fmtty_rel_det(rest._0);
          var af$7 = match$7[1];
          var fa$7 = match$7[0];
          return [
                  (function (param) {
                      _1(fa$7, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$7, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$7[2],
                  match$7[3]
                ];
      case /* Format_arg_ty */8 :
          var match$8 = fmtty_rel_det(rest._1);
          var af$8 = match$8[1];
          var fa$8 = match$8[0];
          return [
                  (function (param) {
                      _1(fa$8, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$8, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$8[2],
                  match$8[3]
                ];
      case /* Format_subst_ty */9 :
          var match$9 = fmtty_rel_det(rest._2);
          var de = match$9[3];
          var ed = match$9[2];
          var af$9 = match$9[1];
          var fa$9 = match$9[0];
          var ty = trans(symm(rest._0), rest._1);
          var match$10 = fmtty_rel_det(ty);
          var jd = match$10[3];
          var dj = match$10[2];
          var ga = match$10[1];
          var ag = match$10[0];
          return [
                  (function (param) {
                      _1(fa$9, /* Refl */0);
                      _1(ag, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(ga, /* Refl */0);
                      _1(af$9, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(ed, /* Refl */0);
                      _1(dj, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(jd, /* Refl */0);
                      _1(de, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      case /* Alpha_ty */10 :
          var match$11 = fmtty_rel_det(rest._0);
          var af$10 = match$11[1];
          var fa$10 = match$11[0];
          return [
                  (function (param) {
                      _1(fa$10, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$10, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$11[2],
                  match$11[3]
                ];
      case /* Theta_ty */11 :
          var match$12 = fmtty_rel_det(rest._0);
          var af$11 = match$12[1];
          var fa$11 = match$12[0];
          return [
                  (function (param) {
                      _1(fa$11, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$11, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$12[2],
                  match$12[3]
                ];
      case /* Any_ty */12 :
          var match$13 = fmtty_rel_det(rest._0);
          var af$12 = match$13[1];
          var fa$12 = match$13[0];
          return [
                  (function (param) {
                      _1(fa$12, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$12, /* Refl */0);
                      return /* Refl */0;
                    }),
                  match$13[2],
                  match$13[3]
                ];
      case /* Reader_ty */13 :
          var match$14 = fmtty_rel_det(rest._0);
          var de$1 = match$14[3];
          var ed$1 = match$14[2];
          var af$13 = match$14[1];
          var fa$13 = match$14[0];
          return [
                  (function (param) {
                      _1(fa$13, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$13, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(ed$1, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(de$1, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      case /* Ignored_reader_ty */14 :
          var match$15 = fmtty_rel_det(rest._0);
          var de$2 = match$15[3];
          var ed$2 = match$15[2];
          var af$14 = match$15[1];
          var fa$14 = match$15[0];
          return [
                  (function (param) {
                      _1(fa$14, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(af$14, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(ed$2, /* Refl */0);
                      return /* Refl */0;
                    }),
                  (function (param) {
                      _1(de$2, /* Refl */0);
                      return /* Refl */0;
                    })
                ];
      
    }
  }

  function trans(ty1, ty2) {
    var exit = 0;
    if (typeof ty1 === "number") {
      if (typeof ty2 === "number") {
        return /* End_of_fmtty */0;
      }
      switch (ty2.TAG | 0) {
        case /* Format_arg_ty */8 :
            exit = 6;
            break;
        case /* Format_subst_ty */9 :
            exit = 7;
            break;
        case /* Alpha_ty */10 :
            exit = 1;
            break;
        case /* Theta_ty */11 :
            exit = 2;
            break;
        case /* Any_ty */12 :
            exit = 3;
            break;
        case /* Reader_ty */13 :
            exit = 4;
            break;
        case /* Ignored_reader_ty */14 :
            exit = 5;
            break;
        default:
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  846,
                  23
                ],
                Error: new Error()
              };
      }
    } else {
      switch (ty1.TAG | 0) {
        case /* Char_ty */0 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Char_ty */0 :
                    return {
                            TAG: /* Char_ty */0,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* String_ty */1 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* String_ty */1 :
                    return {
                            TAG: /* String_ty */1,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Int_ty */2 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Int_ty */2 :
                    return {
                            TAG: /* Int_ty */2,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Int32_ty */3 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Int32_ty */3 :
                    return {
                            TAG: /* Int32_ty */3,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Nativeint_ty */4 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Nativeint_ty */4 :
                    return {
                            TAG: /* Nativeint_ty */4,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Int64_ty */5 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Int64_ty */5 :
                    return {
                            TAG: /* Int64_ty */5,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Float_ty */6 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Float_ty */6 :
                    return {
                            TAG: /* Float_ty */6,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Bool_ty */7 :
            if (typeof ty2 === "number") {
              exit = 8;
            } else {
              switch (ty2.TAG | 0) {
                case /* Bool_ty */7 :
                    return {
                            TAG: /* Bool_ty */7,
                            _0: trans(ty1._0, ty2._0)
                          };
                case /* Format_arg_ty */8 :
                    exit = 6;
                    break;
                case /* Format_subst_ty */9 :
                    exit = 7;
                    break;
                case /* Alpha_ty */10 :
                    exit = 1;
                    break;
                case /* Theta_ty */11 :
                    exit = 2;
                    break;
                case /* Any_ty */12 :
                    exit = 3;
                    break;
                case /* Reader_ty */13 :
                    exit = 4;
                    break;
                case /* Ignored_reader_ty */14 :
                    exit = 5;
                    break;
                
              }
            }
            break;
        case /* Format_arg_ty */8 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      832,
                      26
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Format_arg_ty */8 :
                  return {
                          TAG: /* Format_arg_ty */8,
                          _0: trans(ty1._0, ty2._0),
                          _1: trans(ty1._1, ty2._1)
                        };
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        832,
                        26
                      ],
                      Error: new Error()
                    };
            }
            break;
        case /* Format_subst_ty */9 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      842,
                      28
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Format_arg_ty */8 :
                  exit = 6;
                  break;
              case /* Format_subst_ty */9 :
                  var ty = trans(symm(ty1._1), ty2._0);
                  var match = fmtty_rel_det(ty);
                  _1(match[1], /* Refl */0);
                  _1(match[3], /* Refl */0);
                  return {
                          TAG: /* Format_subst_ty */9,
                          _0: ty1._0,
                          _1: ty2._1,
                          _2: trans(ty1._2, ty2._2)
                        };
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  exit = 5;
                  break;
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        842,
                        28
                      ],
                      Error: new Error()
                    };
            }
            break;
        case /* Alpha_ty */10 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      810,
                      21
                    ],
                    Error: new Error()
                  };
            }
            if (ty2.TAG === /* Alpha_ty */10) {
              return {
                      TAG: /* Alpha_ty */10,
                      _0: trans(ty1._0, ty2._0)
                    };
            }
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    810,
                    21
                  ],
                  Error: new Error()
                };
        case /* Theta_ty */11 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      814,
                      21
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  return {
                          TAG: /* Theta_ty */11,
                          _0: trans(ty1._0, ty2._0)
                        };
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        814,
                        21
                      ],
                      Error: new Error()
                    };
            }
            break;
        case /* Any_ty */12 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      818,
                      19
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  return {
                          TAG: /* Any_ty */12,
                          _0: trans(ty1._0, ty2._0)
                        };
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        818,
                        19
                      ],
                      Error: new Error()
                    };
            }
            break;
        case /* Reader_ty */13 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      822,
                      22
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  return {
                          TAG: /* Reader_ty */13,
                          _0: trans(ty1._0, ty2._0)
                        };
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        822,
                        22
                      ],
                      Error: new Error()
                    };
            }
            break;
        case /* Ignored_reader_ty */14 :
            if (typeof ty2 === "number") {
              throw {
                    RE_EXN_ID: "Assert_failure",
                    _1: [
                      "camlinternalFormat.ml",
                      827,
                      30
                    ],
                    Error: new Error()
                  };
            }
            switch (ty2.TAG | 0) {
              case /* Alpha_ty */10 :
                  exit = 1;
                  break;
              case /* Theta_ty */11 :
                  exit = 2;
                  break;
              case /* Any_ty */12 :
                  exit = 3;
                  break;
              case /* Reader_ty */13 :
                  exit = 4;
                  break;
              case /* Ignored_reader_ty */14 :
                  return {
                          TAG: /* Ignored_reader_ty */14,
                          _0: trans(ty1._0, ty2._0)
                        };
              default:
                throw {
                      RE_EXN_ID: "Assert_failure",
                      _1: [
                        "camlinternalFormat.ml",
                        827,
                        30
                      ],
                      Error: new Error()
                    };
            }
            break;
        
      }
    }
    switch (exit) {
      case 1 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  811,
                  21
                ],
                Error: new Error()
              };
      case 2 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  815,
                  21
                ],
                Error: new Error()
              };
      case 3 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  819,
                  19
                ],
                Error: new Error()
              };
      case 4 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  823,
                  22
                ],
                Error: new Error()
              };
      case 5 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  828,
                  30
                ],
                Error: new Error()
              };
      case 6 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  833,
                  26
                ],
                Error: new Error()
              };
      case 7 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  843,
                  28
                ],
                Error: new Error()
              };
      case 8 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  847,
                  23
                ],
                Error: new Error()
              };
      
    }
  }

  var Type_mismatch = create("CamlinternalFormat.Type_mismatch");

  function type_padding(pad, fmtty) {
    if (typeof pad === "number") {
      return /* Padding_fmtty_EBB */{
              _0: /* No_padding */0,
              _1: fmtty
            };
    }
    if (!pad.TAG) {
      return /* Padding_fmtty_EBB */{
              _0: {
                TAG: /* Lit_padding */0,
                _0: pad._0,
                _1: pad._1
              },
              _1: fmtty
            };
    }
    if (typeof fmtty === "number") {
      throw {
            RE_EXN_ID: Type_mismatch,
            Error: new Error()
          };
    }
    if (fmtty.TAG === /* Int_ty */2) {
      return /* Padding_fmtty_EBB */{
              _0: {
                TAG: /* Arg_padding */1,
                _0: pad._0
              },
              _1: fmtty._0
            };
    }
    throw {
          RE_EXN_ID: Type_mismatch,
          Error: new Error()
        };
  }

  function type_padprec(pad, prec, fmtty) {
    var match = type_padding(pad, fmtty);
    if (typeof prec !== "number") {
      return /* Padprec_fmtty_EBB */{
              _0: match._0,
              _1: /* Lit_precision */{
                _0: prec._0
              },
              _2: match._1
            };
    }
    if (prec === 0) {
      return /* Padprec_fmtty_EBB */{
              _0: match._0,
              _1: /* No_precision */0,
              _2: match._1
            };
    }
    var rest = match._1;
    if (typeof rest === "number") {
      throw {
            RE_EXN_ID: Type_mismatch,
            Error: new Error()
          };
    }
    if (rest.TAG === /* Int_ty */2) {
      return /* Padprec_fmtty_EBB */{
              _0: match._0,
              _1: /* Arg_precision */1,
              _2: rest._0
            };
    }
    throw {
          RE_EXN_ID: Type_mismatch,
          Error: new Error()
        };
  }

  function type_ignored_format_substitution(sub_fmtty, fmt, fmtty) {
    if (typeof sub_fmtty === "number") {
      return /* Fmtty_fmt_EBB */{
              _0: /* End_of_fmtty */0,
              _1: type_format_gen(fmt, fmtty)
            };
    }
    switch (sub_fmtty.TAG | 0) {
      case /* Char_ty */0 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
          return /* Fmtty_fmt_EBB */{
                  _0: {
                    TAG: /* Char_ty */0,
                    _0: match._0
                  },
                  _1: match._1
                };
      case /* String_ty */1 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* String_ty */1) {
            var match$1 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* String_ty */1,
                      _0: match$1._0
                    },
                    _1: match$1._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int_ty */2 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Int_ty */2) {
            var match$2 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Int_ty */2,
                      _0: match$2._0
                    },
                    _1: match$2._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int32_ty */3 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Int32_ty */3) {
            var match$3 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Int32_ty */3,
                      _0: match$3._0
                    },
                    _1: match$3._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Nativeint_ty */4 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Nativeint_ty */4) {
            var match$4 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Nativeint_ty */4,
                      _0: match$4._0
                    },
                    _1: match$4._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int64_ty */5 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Int64_ty */5) {
            var match$5 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Int64_ty */5,
                      _0: match$5._0
                    },
                    _1: match$5._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Float_ty */6 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Float_ty */6) {
            var match$6 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Float_ty */6,
                      _0: match$6._0
                    },
                    _1: match$6._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Bool_ty */7 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Bool_ty */7) {
            var match$7 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Bool_ty */7,
                      _0: match$7._0
                    },
                    _1: match$7._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Format_arg_ty */8 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Format_arg_ty */8) {
            var sub2_fmtty$prime = fmtty._0;
            if (caml_notequal(/* Fmtty_EBB */{
                    _0: sub_fmtty._0
                  }, /* Fmtty_EBB */{
                    _0: sub2_fmtty$prime
                  })) {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            var match$8 = type_ignored_format_substitution(sub_fmtty._1, fmt, fmtty._1);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Format_arg_ty */8,
                      _0: sub2_fmtty$prime,
                      _1: match$8._0
                    },
                    _1: match$8._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Format_subst_ty */9 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Format_subst_ty */9) {
            var sub2_fmtty$prime$1 = fmtty._1;
            var sub1_fmtty$prime = fmtty._0;
            if (caml_notequal(/* Fmtty_EBB */{
                    _0: erase_rel(sub_fmtty._0)
                  }, /* Fmtty_EBB */{
                    _0: erase_rel(sub1_fmtty$prime)
                  })) {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            if (caml_notequal(/* Fmtty_EBB */{
                    _0: erase_rel(sub_fmtty._1)
                  }, /* Fmtty_EBB */{
                    _0: erase_rel(sub2_fmtty$prime$1)
                  })) {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            var sub_fmtty$prime = trans(symm(sub1_fmtty$prime), sub2_fmtty$prime$1);
            var match$9 = fmtty_rel_det(sub_fmtty$prime);
            _1(match$9[1], /* Refl */0);
            _1(match$9[3], /* Refl */0);
            var match$10 = type_ignored_format_substitution(erase_rel(sub_fmtty._2), fmt, fmtty._2);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Format_subst_ty */9,
                      _0: sub1_fmtty$prime,
                      _1: sub2_fmtty$prime$1,
                      _2: symm(match$10._0)
                    },
                    _1: match$10._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Alpha_ty */10 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Alpha_ty */10) {
            var match$11 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Alpha_ty */10,
                      _0: match$11._0
                    },
                    _1: match$11._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Theta_ty */11 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Theta_ty */11) {
            var match$12 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Theta_ty */11,
                      _0: match$12._0
                    },
                    _1: match$12._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Any_ty */12 :
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Reader_ty */13 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Reader_ty */13) {
            var match$13 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Reader_ty */13,
                      _0: match$13._0
                    },
                    _1: match$13._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Ignored_reader_ty */14 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Ignored_reader_ty */14) {
            var match$14 = type_ignored_format_substitution(sub_fmtty._0, fmt, fmtty._0);
            return /* Fmtty_fmt_EBB */{
                    _0: {
                      TAG: /* Ignored_reader_ty */14,
                      _0: match$14._0
                    },
                    _1: match$14._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      
    }
  }

  function type_format_gen(fmt, fmtty) {
    if (typeof fmt === "number") {
      return /* Fmt_fmtty_EBB */{
              _0: /* End_of_format */0,
              _1: fmtty
            };
    }
    switch (fmt.TAG | 0) {
      case /* Char */0 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Char */0,
                    _0: match._0
                  },
                  _1: match._1
                };
      case /* Caml_char */1 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG) {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          var match$1 = type_format_gen(fmt._0, fmtty._0);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Caml_char */1,
                    _0: match$1._0
                  },
                  _1: match$1._1
                };
      case /* String */2 :
          var match$2 = type_padding(fmt._0, fmtty);
          var fmtty_rest = match$2._1;
          if (typeof fmtty_rest === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest.TAG === /* String_ty */1) {
            var match$3 = type_format_gen(fmt._1, fmtty_rest._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* String */2,
                      _0: match$2._0,
                      _1: match$3._0
                    },
                    _1: match$3._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Caml_string */3 :
          var match$4 = type_padding(fmt._0, fmtty);
          var fmtty_rest$1 = match$4._1;
          if (typeof fmtty_rest$1 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$1.TAG === /* String_ty */1) {
            var match$5 = type_format_gen(fmt._1, fmtty_rest$1._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Caml_string */3,
                      _0: match$4._0,
                      _1: match$5._0
                    },
                    _1: match$5._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int */4 :
          var match$6 = type_padprec(fmt._1, fmt._2, fmtty);
          var fmtty_rest$2 = match$6._2;
          if (typeof fmtty_rest$2 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$2.TAG === /* Int_ty */2) {
            var match$7 = type_format_gen(fmt._3, fmtty_rest$2._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Int */4,
                      _0: fmt._0,
                      _1: match$6._0,
                      _2: match$6._1,
                      _3: match$7._0
                    },
                    _1: match$7._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int32 */5 :
          var match$8 = type_padprec(fmt._1, fmt._2, fmtty);
          var fmtty_rest$3 = match$8._2;
          if (typeof fmtty_rest$3 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$3.TAG === /* Int32_ty */3) {
            var match$9 = type_format_gen(fmt._3, fmtty_rest$3._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Int32 */5,
                      _0: fmt._0,
                      _1: match$8._0,
                      _2: match$8._1,
                      _3: match$9._0
                    },
                    _1: match$9._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Nativeint */6 :
          var match$10 = type_padprec(fmt._1, fmt._2, fmtty);
          var fmtty_rest$4 = match$10._2;
          if (typeof fmtty_rest$4 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$4.TAG === /* Nativeint_ty */4) {
            var match$11 = type_format_gen(fmt._3, fmtty_rest$4._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Nativeint */6,
                      _0: fmt._0,
                      _1: match$10._0,
                      _2: match$10._1,
                      _3: match$11._0
                    },
                    _1: match$11._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Int64 */7 :
          var match$12 = type_padprec(fmt._1, fmt._2, fmtty);
          var fmtty_rest$5 = match$12._2;
          if (typeof fmtty_rest$5 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$5.TAG === /* Int64_ty */5) {
            var match$13 = type_format_gen(fmt._3, fmtty_rest$5._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Int64 */7,
                      _0: fmt._0,
                      _1: match$12._0,
                      _2: match$12._1,
                      _3: match$13._0
                    },
                    _1: match$13._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Float */8 :
          var match$14 = type_padprec(fmt._1, fmt._2, fmtty);
          var fmtty_rest$6 = match$14._2;
          if (typeof fmtty_rest$6 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$6.TAG === /* Float_ty */6) {
            var match$15 = type_format_gen(fmt._3, fmtty_rest$6._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Float */8,
                      _0: fmt._0,
                      _1: match$14._0,
                      _2: match$14._1,
                      _3: match$15._0
                    },
                    _1: match$15._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Bool */9 :
          var match$16 = type_padding(fmt._0, fmtty);
          var fmtty_rest$7 = match$16._1;
          if (typeof fmtty_rest$7 === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty_rest$7.TAG === /* Bool_ty */7) {
            var match$17 = type_format_gen(fmt._1, fmtty_rest$7._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Bool */9,
                      _0: match$16._0,
                      _1: match$17._0
                    },
                    _1: match$17._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Flush */10 :
          var match$18 = type_format_gen(fmt._0, fmtty);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Flush */10,
                    _0: match$18._0
                  },
                  _1: match$18._1
                };
      case /* String_literal */11 :
          var match$19 = type_format_gen(fmt._1, fmtty);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* String_literal */11,
                    _0: fmt._0,
                    _1: match$19._0
                  },
                  _1: match$19._1
                };
      case /* Char_literal */12 :
          var match$20 = type_format_gen(fmt._1, fmtty);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Char_literal */12,
                    _0: fmt._0,
                    _1: match$20._0
                  },
                  _1: match$20._1
                };
      case /* Format_arg */13 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Format_arg_ty */8) {
            var sub_fmtty$prime = fmtty._0;
            if (caml_notequal(/* Fmtty_EBB */{
                    _0: fmt._1
                  }, /* Fmtty_EBB */{
                    _0: sub_fmtty$prime
                  })) {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            var match$21 = type_format_gen(fmt._2, fmtty._1);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Format_arg */13,
                      _0: fmt._0,
                      _1: sub_fmtty$prime,
                      _2: match$21._0
                    },
                    _1: match$21._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Format_subst */14 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Format_subst_ty */9) {
            var sub_fmtty1 = fmtty._0;
            if (caml_notequal(/* Fmtty_EBB */{
                    _0: erase_rel(fmt._1)
                  }, /* Fmtty_EBB */{
                    _0: erase_rel(sub_fmtty1)
                  })) {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            var match$22 = type_format_gen(fmt._2, erase_rel(fmtty._2));
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Format_subst */14,
                      _0: fmt._0,
                      _1: sub_fmtty1,
                      _2: match$22._0
                    },
                    _1: match$22._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Alpha */15 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Alpha_ty */10) {
            var match$23 = type_format_gen(fmt._0, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Alpha */15,
                      _0: match$23._0
                    },
                    _1: match$23._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Theta */16 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Theta_ty */11) {
            var match$24 = type_format_gen(fmt._0, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Theta */16,
                      _0: match$24._0
                    },
                    _1: match$24._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Formatting_lit */17 :
          var match$25 = type_format_gen(fmt._1, fmtty);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Formatting_lit */17,
                    _0: fmt._0,
                    _1: match$25._0
                  },
                  _1: match$25._1
                };
      case /* Formatting_gen */18 :
          var formatting_gen = fmt._0;
          var fmt0 = fmt._1;
          if (formatting_gen.TAG) {
            var match$26 = formatting_gen._0;
            var match$27 = type_format_gen(match$26._0, fmtty);
            var match$28 = type_format_gen(fmt0, match$27._1);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Formatting_gen */18,
                      _0: {
                        TAG: /* Open_box */1,
                        _0: /* Format */{
                          _0: match$27._0,
                          _1: match$26._1
                        }
                      },
                      _1: match$28._0
                    },
                    _1: match$28._1
                  };
          }
          var match$29 = formatting_gen._0;
          var match$30 = type_format_gen(match$29._0, fmtty);
          var match$31 = type_format_gen(fmt0, match$30._1);
          return /* Fmt_fmtty_EBB */{
                  _0: {
                    TAG: /* Formatting_gen */18,
                    _0: {
                      TAG: /* Open_tag */0,
                      _0: /* Format */{
                        _0: match$30._0,
                        _1: match$29._1
                      }
                    },
                    _1: match$31._0
                  },
                  _1: match$31._1
                };
      case /* Reader */19 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Reader_ty */13) {
            var match$32 = type_format_gen(fmt._0, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Reader */19,
                      _0: match$32._0
                    },
                    _1: match$32._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Scan_char_set */20 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* String_ty */1) {
            var match$33 = type_format_gen(fmt._2, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Scan_char_set */20,
                      _0: fmt._0,
                      _1: fmt._1,
                      _2: match$33._0
                    },
                    _1: match$33._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Scan_get_counter */21 :
          if (typeof fmtty === "number") {
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          }
          if (fmtty.TAG === /* Int_ty */2) {
            var match$34 = type_format_gen(fmt._1, fmtty._0);
            return /* Fmt_fmtty_EBB */{
                    _0: {
                      TAG: /* Scan_get_counter */21,
                      _0: fmt._0,
                      _1: match$34._0
                    },
                    _1: match$34._1
                  };
          }
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      case /* Ignored_param */23 :
          var ign = fmt._0;
          var fmt$1 = fmt._1;
          if (typeof ign === "number") {
            if (ign !== /* Ignored_reader */2) {
              return type_ignored_param_one(ign, fmt$1, fmtty);
            }
            if (typeof fmtty === "number") {
              throw {
                    RE_EXN_ID: Type_mismatch,
                    Error: new Error()
                  };
            }
            if (fmtty.TAG === /* Ignored_reader_ty */14) {
              var match$35 = type_format_gen(fmt$1, fmtty._0);
              return /* Fmt_fmtty_EBB */{
                      _0: {
                        TAG: /* Ignored_param */23,
                        _0: /* Ignored_reader */2,
                        _1: match$35._0
                      },
                      _1: match$35._1
                    };
            }
            throw {
                  RE_EXN_ID: Type_mismatch,
                  Error: new Error()
                };
          } else {
            switch (ign.TAG | 0) {
              case /* Ignored_format_arg */8 :
                  return type_ignored_param_one({
                              TAG: /* Ignored_format_arg */8,
                              _0: ign._0,
                              _1: ign._1
                            }, fmt$1, fmtty);
              case /* Ignored_format_subst */9 :
                  var match$36 = type_ignored_format_substitution(ign._1, fmt$1, fmtty);
                  var match$37 = match$36._1;
                  return /* Fmt_fmtty_EBB */{
                          _0: {
                            TAG: /* Ignored_param */23,
                            _0: {
                              TAG: /* Ignored_format_subst */9,
                              _0: ign._0,
                              _1: match$36._0
                            },
                            _1: match$37._0
                          },
                          _1: match$37._1
                        };
              default:
                return type_ignored_param_one(ign, fmt$1, fmtty);
            }
          }
      case /* Scan_next_char */22 :
      case /* Custom */24 :
          throw {
                RE_EXN_ID: Type_mismatch,
                Error: new Error()
              };
      
    }
  }

  function type_ignored_param_one(ign, fmt, fmtty) {
    var match = type_format_gen(fmt, fmtty);
    return /* Fmt_fmtty_EBB */{
            _0: {
              TAG: /* Ignored_param */23,
              _0: ign,
              _1: match._0
            },
            _1: match._1
          };
  }

  function type_format(fmt, fmtty) {
    var match = type_format_gen(fmt, fmtty);
    if (typeof match._1 === "number") {
      return match._0;
    }
    throw {
          RE_EXN_ID: Type_mismatch,
          Error: new Error()
        };
  }

  function recast(fmt, fmtty) {
    return type_format(fmt, erase_rel(symm(fmtty)));
  }

  function fix_padding(padty, width, str) {
    var len = str.length;
    var width$1 = abs(width);
    var padty$1 = width < 0 ? /* Left */0 : padty;
    if (width$1 <= len) {
      return str;
    }
    var res = make(width$1, padty$1 === /* Zeros */2 ? /* "0" */48 : /* " " */32);
    switch (padty$1) {
      case /* Left */0 :
          blit$1(str, 0, res, 0, len);
          break;
      case /* Right */1 :
          blit$1(str, 0, res, width$1 - len | 0, len);
          break;
      case /* Zeros */2 :
          if (len > 0 && (get(str, 0) === /* "+" */43 || get(str, 0) === /* "-" */45 || get(str, 0) === /* " " */32)) {
            res[0] = get(str, 0);
            blit$1(str, 1, res, (width$1 - len | 0) + 1 | 0, len - 1 | 0);
          } else if (len > 1 && get(str, 0) === /* "0" */48 && (get(str, 1) === /* "x" */120 || get(str, 1) === /* "X" */88)) {
            res[1] = get(str, 1);
            blit$1(str, 2, res, (width$1 - len | 0) + 2 | 0, len - 2 | 0);
          } else {
            blit$1(str, 0, res, width$1 - len | 0, len);
          }
          break;
      
    }
    return bytes_to_string(res);
  }

  function fix_int_precision(prec, str) {
    var prec$1 = abs(prec);
    var len = str.length;
    var c = get(str, 0);
    var exit = 0;
    if (c >= 58) {
      if (c >= 71) {
        if (c > 102 || c < 97) {
          return str;
        }
        exit = 2;
      } else {
        if (c < 65) {
          return str;
        }
        exit = 2;
      }
    } else if (c !== 32) {
      if (c < 43) {
        return str;
      }
      switch (c - 43 | 0) {
        case 0 :
        case 2 :
            exit = 1;
            break;
        case 1 :
        case 3 :
        case 4 :
            return str;
        case 5 :
            if ((prec$1 + 2 | 0) > len && len > 1 && (get(str, 1) === /* "x" */120 || get(str, 1) === /* "X" */88)) {
              var res = make(prec$1 + 2 | 0, /* "0" */48);
              res[1] = get(str, 1);
              blit$1(str, 2, res, (prec$1 - len | 0) + 4 | 0, len - 2 | 0);
              return bytes_to_string(res);
            }
            exit = 2;
            break;
        case 6 :
        case 7 :
        case 8 :
        case 9 :
        case 10 :
        case 11 :
        case 12 :
        case 13 :
        case 14 :
            exit = 2;
            break;
        
      }
    } else {
      exit = 1;
    }
    switch (exit) {
      case 1 :
          if ((prec$1 + 1 | 0) <= len) {
            return str;
          }
          var res$1 = make(prec$1 + 1 | 0, /* "0" */48);
          res$1[0] = c;
          blit$1(str, 1, res$1, (prec$1 - len | 0) + 2 | 0, len - 1 | 0);
          return bytes_to_string(res$1);
      case 2 :
          if (prec$1 <= len) {
            return str;
          }
          var res$2 = make(prec$1, /* "0" */48);
          blit$1(str, 0, res$2, prec$1 - len | 0, len);
          return bytes_to_string(res$2);
      
    }
  }

  function string_to_caml_string(str) {
    var str$1 = escaped$2(str);
    var l = str$1.length;
    var res = make(l + 2 | 0, /* "\"" */34);
    caml_blit_string(str$1, 0, res, 1, l);
    return bytes_to_string(res);
  }

  function format_of_iconv(param) {
    switch (param) {
      case /* Int_d */0 :
          return "%d";
      case /* Int_pd */1 :
          return "%+d";
      case /* Int_sd */2 :
          return "% d";
      case /* Int_i */3 :
          return "%i";
      case /* Int_pi */4 :
          return "%+i";
      case /* Int_si */5 :
          return "% i";
      case /* Int_x */6 :
          return "%x";
      case /* Int_Cx */7 :
          return "%#x";
      case /* Int_X */8 :
          return "%X";
      case /* Int_CX */9 :
          return "%#X";
      case /* Int_o */10 :
          return "%o";
      case /* Int_Co */11 :
          return "%#o";
      case /* Int_u */12 :
          return "%u";
      
    }
  }

  function format_of_iconvL(param) {
    switch (param) {
      case /* Int_d */0 :
          return "%Ld";
      case /* Int_pd */1 :
          return "%+Ld";
      case /* Int_sd */2 :
          return "% Ld";
      case /* Int_i */3 :
          return "%Li";
      case /* Int_pi */4 :
          return "%+Li";
      case /* Int_si */5 :
          return "% Li";
      case /* Int_x */6 :
          return "%Lx";
      case /* Int_Cx */7 :
          return "%#Lx";
      case /* Int_X */8 :
          return "%LX";
      case /* Int_CX */9 :
          return "%#LX";
      case /* Int_o */10 :
          return "%Lo";
      case /* Int_Co */11 :
          return "%#Lo";
      case /* Int_u */12 :
          return "%Lu";
      
    }
  }

  function format_of_iconvl(param) {
    switch (param) {
      case /* Int_d */0 :
          return "%ld";
      case /* Int_pd */1 :
          return "%+ld";
      case /* Int_sd */2 :
          return "% ld";
      case /* Int_i */3 :
          return "%li";
      case /* Int_pi */4 :
          return "%+li";
      case /* Int_si */5 :
          return "% li";
      case /* Int_x */6 :
          return "%lx";
      case /* Int_Cx */7 :
          return "%#lx";
      case /* Int_X */8 :
          return "%lX";
      case /* Int_CX */9 :
          return "%#lX";
      case /* Int_o */10 :
          return "%lo";
      case /* Int_Co */11 :
          return "%#lo";
      case /* Int_u */12 :
          return "%lu";
      
    }
  }

  function format_of_iconvn(param) {
    switch (param) {
      case /* Int_d */0 :
          return "%nd";
      case /* Int_pd */1 :
          return "%+nd";
      case /* Int_sd */2 :
          return "% nd";
      case /* Int_i */3 :
          return "%ni";
      case /* Int_pi */4 :
          return "%+ni";
      case /* Int_si */5 :
          return "% ni";
      case /* Int_x */6 :
          return "%nx";
      case /* Int_Cx */7 :
          return "%#nx";
      case /* Int_X */8 :
          return "%nX";
      case /* Int_CX */9 :
          return "%#nX";
      case /* Int_o */10 :
          return "%no";
      case /* Int_Co */11 :
          return "%#no";
      case /* Int_u */12 :
          return "%nu";
      
    }
  }

  function format_of_fconv(fconv, prec) {
    if (fconv === /* Float_F */15) {
      return "%.12g";
    }
    var prec$1 = abs(prec);
    var symb = char_of_fconv(fconv);
    var buf = {
      ind: 0,
      bytes: caml_create_bytes(16)
    };
    buffer_add_char(buf, /* "%" */37);
    bprint_fconv_flag(buf, fconv);
    buffer_add_char(buf, /* "." */46);
    buffer_add_string(buf, String(prec$1));
    buffer_add_char(buf, symb);
    return buffer_contents(buf);
  }

  function convert_int(iconv, n) {
    return caml_format_int(format_of_iconv(iconv), n);
  }

  function convert_int32(iconv, n) {
    return caml_int32_format(format_of_iconvl(iconv), n);
  }

  function convert_nativeint(iconv, n) {
    return caml_nativeint_format(format_of_iconvn(iconv), n);
  }

  function convert_int64(iconv, n) {
    return caml_int64_format(format_of_iconvL(iconv), n);
  }

  function convert_float(fconv, prec, x) {
    if (fconv >= 16) {
      var sign;
      if (fconv >= 17) {
        switch (fconv - 17 | 0) {
          case /* Float_sf */2 :
              sign = /* "-" */45;
              break;
          case /* Float_f */0 :
          case /* Float_e */3 :
              sign = /* "+" */43;
              break;
          case /* Float_pf */1 :
          case /* Float_pe */4 :
              sign = /* " " */32;
              break;
          
        }
      } else {
        sign = /* "-" */45;
      }
      var str = caml_hexstring_of_float(x, prec, sign);
      if (fconv >= 19) {
        return bytes_to_string(uppercase_ascii$1(bytes_of_string(str)));
      } else {
        return str;
      }
    }
    var str$1 = caml_format_float(format_of_fconv(fconv, prec), x);
    if (fconv !== /* Float_F */15) {
      return str$1;
    }
    var len = str$1.length;
    var is_valid = function (_i) {
      while(true) {
        var i = _i;
        if (i === len) {
          return false;
        }
        var match = get(str$1, i);
        var switcher = match - 46 | 0;
        if (switcher > 23 || switcher < 0) {
          if (switcher === 55) {
            return true;
          }
          _i = i + 1 | 0;
          continue ;
        }
        if (switcher > 22 || switcher < 1) {
          return true;
        }
        _i = i + 1 | 0;
        continue ;
      }  };
    var match = classify_float(x);
    if (match !== 3) {
      if (match >= 4) {
        return "nan";
      } else if (is_valid(0)) {
        return str$1;
      } else {
        return str$1 + ".";
      }
    } else if (x < 0.0) {
      return "neg_infinity";
    } else {
      return "infinity";
    }
  }

  function format_caml_char(c) {
    var str = escaped(c);
    var l = str.length;
    var res = make(l + 2 | 0, /* "'" */39);
    caml_blit_string(str, 0, res, 1, l);
    return bytes_to_string(res);
  }

  function string_of_fmtty(fmtty) {
    var buf = {
      ind: 0,
      bytes: caml_create_bytes(16)
    };
    bprint_fmtty(buf, fmtty);
    return buffer_contents(buf);
  }

  function make_printf(_k, o, _acc, _fmt) {
    while(true) {
      var fmt = _fmt;
      var acc = _acc;
      var k = _k;
      if (typeof fmt === "number") {
        return _2(k, o, acc);
      }
      switch (fmt.TAG | 0) {
        case /* Char */0 :
            var rest = fmt._0;
            return (function(k,acc,rest){
            return function (c) {
              var new_acc = {
                TAG: /* Acc_data_char */5,
                _0: acc,
                _1: c
              };
              return make_printf(k, o, new_acc, rest);
            }
            }(k,acc,rest));
        case /* Caml_char */1 :
            var rest$1 = fmt._0;
            return (function(k,acc,rest$1){
            return function (c) {
              var new_acc_1 = format_caml_char(c);
              var new_acc = {
                TAG: /* Acc_data_string */4,
                _0: acc,
                _1: new_acc_1
              };
              return make_printf(k, o, new_acc, rest$1);
            }
            }(k,acc,rest$1));
        case /* String */2 :
            return make_padding(k, o, acc, fmt._1, fmt._0, (function (str) {
                          return str;
                        }));
        case /* Caml_string */3 :
            return make_padding(k, o, acc, fmt._1, fmt._0, string_to_caml_string);
        case /* Int */4 :
            return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int, fmt._0);
        case /* Int32 */5 :
            return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int32, fmt._0);
        case /* Nativeint */6 :
            return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_nativeint, fmt._0);
        case /* Int64 */7 :
            return make_int_padding_precision(k, o, acc, fmt._3, fmt._1, fmt._2, convert_int64, fmt._0);
        case /* Float */8 :
            var fmt$1 = fmt._3;
            var pad = fmt._1;
            var prec = fmt._2;
            var fconv = fmt._0;
            if (typeof pad === "number") {
              if (typeof prec === "number") {
                if (prec !== 0) {
                  return (function(k,acc,fmt$1,fconv){
                  return function (p, x) {
                    var str = convert_float(fconv, p, x);
                    return make_printf(k, o, {
                                TAG: /* Acc_data_string */4,
                                _0: acc,
                                _1: str
                              }, fmt$1);
                  }
                  }(k,acc,fmt$1,fconv));
                } else {
                  return (function(k,acc,fmt$1,fconv){
                  return function (x) {
                    var str = convert_float(fconv, -6, x);
                    return make_printf(k, o, {
                                TAG: /* Acc_data_string */4,
                                _0: acc,
                                _1: str
                              }, fmt$1);
                  }
                  }(k,acc,fmt$1,fconv));
                }
              }
              var p = prec._0;
              return (function(k,acc,fmt$1,fconv,p){
              return function (x) {
                var str = convert_float(fconv, p, x);
                return make_printf(k, o, {
                            TAG: /* Acc_data_string */4,
                            _0: acc,
                            _1: str
                          }, fmt$1);
              }
              }(k,acc,fmt$1,fconv,p));
            }
            if (pad.TAG) {
              var padty = pad._0;
              if (typeof prec === "number") {
                if (prec !== 0) {
                  return (function(k,acc,fmt$1,fconv,padty){
                  return function (w, p, x) {
                    var str = fix_padding(padty, w, convert_float(fconv, p, x));
                    return make_printf(k, o, {
                                TAG: /* Acc_data_string */4,
                                _0: acc,
                                _1: str
                              }, fmt$1);
                  }
                  }(k,acc,fmt$1,fconv,padty));
                } else {
                  return (function(k,acc,fmt$1,fconv,padty){
                  return function (w, x) {
                    var str = convert_float(fconv, -6, x);
                    var str$prime = fix_padding(padty, w, str);
                    return make_printf(k, o, {
                                TAG: /* Acc_data_string */4,
                                _0: acc,
                                _1: str$prime
                              }, fmt$1);
                  }
                  }(k,acc,fmt$1,fconv,padty));
                }
              }
              var p$1 = prec._0;
              return (function(k,acc,fmt$1,fconv,padty,p$1){
              return function (w, x) {
                var str = fix_padding(padty, w, convert_float(fconv, p$1, x));
                return make_printf(k, o, {
                            TAG: /* Acc_data_string */4,
                            _0: acc,
                            _1: str
                          }, fmt$1);
              }
              }(k,acc,fmt$1,fconv,padty,p$1));
            }
            var w = pad._1;
            var padty$1 = pad._0;
            if (typeof prec === "number") {
              if (prec !== 0) {
                return (function(k,acc,fmt$1,fconv,padty$1,w){
                return function (p, x) {
                  var str = fix_padding(padty$1, w, convert_float(fconv, p, x));
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv,padty$1,w));
              } else {
                return (function(k,acc,fmt$1,fconv,padty$1,w){
                return function (x) {
                  var str = convert_float(fconv, -6, x);
                  var str$prime = fix_padding(padty$1, w, str);
                  return make_printf(k, o, {
                              TAG: /* Acc_data_string */4,
                              _0: acc,
                              _1: str$prime
                            }, fmt$1);
                }
                }(k,acc,fmt$1,fconv,padty$1,w));
              }
            }
            var p$2 = prec._0;
            return (function(k,acc,fmt$1,fconv,padty$1,w,p$2){
            return function (x) {
              var str = fix_padding(padty$1, w, convert_float(fconv, p$2, x));
              return make_printf(k, o, {
                          TAG: /* Acc_data_string */4,
                          _0: acc,
                          _1: str
                        }, fmt$1);
            }
            }(k,acc,fmt$1,fconv,padty$1,w,p$2));
        case /* Bool */9 :
            return make_padding(k, o, acc, fmt._1, fmt._0, string_of_bool);
        case /* Flush */10 :
            _fmt = fmt._0;
            _acc = {
              TAG: /* Acc_flush */7,
              _0: acc
            };
            continue ;
        case /* String_literal */11 :
            _fmt = fmt._1;
            _acc = {
              TAG: /* Acc_string_literal */2,
              _0: acc,
              _1: fmt._0
            };
            continue ;
        case /* Char_literal */12 :
            _fmt = fmt._1;
            _acc = {
              TAG: /* Acc_char_literal */3,
              _0: acc,
              _1: fmt._0
            };
            continue ;
        case /* Format_arg */13 :
            var rest$2 = fmt._2;
            var ty = string_of_fmtty(fmt._1);
            return (function(k,acc,rest$2,ty){
            return function (str) {
              return make_printf(k, o, {
                          TAG: /* Acc_data_string */4,
                          _0: acc,
                          _1: ty
                        }, rest$2);
            }
            }(k,acc,rest$2,ty));
        case /* Format_subst */14 :
            var rest$3 = fmt._2;
            var fmtty = fmt._1;
            return (function(k,acc,fmtty,rest$3){
            return function (param) {
              return make_printf(k, o, acc, concat_fmt(recast(param._0, fmtty), rest$3));
            }
            }(k,acc,fmtty,rest$3));
        case /* Alpha */15 :
            var rest$4 = fmt._0;
            return (function(k,acc,rest$4){
            return function (f, x) {
              return make_printf(k, o, {
                          TAG: /* Acc_delay */6,
                          _0: acc,
                          _1: (function (o) {
                              return _2(f, o, x);
                            })
                        }, rest$4);
            }
            }(k,acc,rest$4));
        case /* Theta */16 :
            var rest$5 = fmt._0;
            return (function(k,acc,rest$5){
            return function (f) {
              return make_printf(k, o, {
                          TAG: /* Acc_delay */6,
                          _0: acc,
                          _1: f
                        }, rest$5);
            }
            }(k,acc,rest$5));
        case /* Formatting_lit */17 :
            _fmt = fmt._1;
            _acc = {
              TAG: /* Acc_formatting_lit */0,
              _0: acc,
              _1: fmt._0
            };
            continue ;
        case /* Formatting_gen */18 :
            var match = fmt._0;
            if (match.TAG) {
              var rest$6 = fmt._1;
              var k$prime = (function(k,acc,rest$6){
              return function k$prime(koc, kacc) {
                return make_printf(k, koc, {
                            TAG: /* Acc_formatting_gen */1,
                            _0: acc,
                            _1: {
                              TAG: /* Acc_open_box */1,
                              _0: kacc
                            }
                          }, rest$6);
              }
              }(k,acc,rest$6));
              _fmt = match._0._0;
              _acc = /* End_of_acc */0;
              _k = k$prime;
              continue ;
            }
            var rest$7 = fmt._1;
            var k$prime$1 = (function(k,acc,rest$7){
            return function k$prime$1(koc, kacc) {
              return make_printf(k, koc, {
                          TAG: /* Acc_formatting_gen */1,
                          _0: acc,
                          _1: {
                            TAG: /* Acc_open_tag */0,
                            _0: kacc
                          }
                        }, rest$7);
            }
            }(k,acc,rest$7));
            _fmt = match._0._0;
            _acc = /* End_of_acc */0;
            _k = k$prime$1;
            continue ;
        case /* Reader */19 :
            throw {
                  RE_EXN_ID: "Assert_failure",
                  _1: [
                    "camlinternalFormat.ml",
                    1525,
                    4
                  ],
                  Error: new Error()
                };
        case /* Scan_char_set */20 :
            var rest$8 = fmt._2;
            var new_acc = {
              TAG: /* Acc_invalid_arg */8,
              _0: acc,
              _1: "Printf: bad conversion %["
            };
            return (function(k,rest$8,new_acc){
            return function (param) {
              return make_printf(k, o, new_acc, rest$8);
            }
            }(k,rest$8,new_acc));
        case /* Scan_get_counter */21 :
            var rest$9 = fmt._1;
            return (function(k,acc,rest$9){
            return function (n) {
              var new_acc_1 = caml_format_int("%u", n);
              var new_acc = {
                TAG: /* Acc_data_string */4,
                _0: acc,
                _1: new_acc_1
              };
              return make_printf(k, o, new_acc, rest$9);
            }
            }(k,acc,rest$9));
        case /* Scan_next_char */22 :
            var rest$10 = fmt._0;
            return (function(k,acc,rest$10){
            return function (c) {
              var new_acc = {
                TAG: /* Acc_data_char */5,
                _0: acc,
                _1: c
              };
              return make_printf(k, o, new_acc, rest$10);
            }
            }(k,acc,rest$10));
        case /* Ignored_param */23 :
            return make_ignored_param(k, o, acc, fmt._0, fmt._1);
        case /* Custom */24 :
            return make_custom(k, o, acc, fmt._2, fmt._0, _1(fmt._1, undefined));
        
      }
    }}

  function make_ignored_param(k, o, acc, ign, fmt) {
    if (typeof ign !== "number") {
      if (ign.TAG === /* Ignored_format_subst */9) {
        return make_from_fmtty(k, o, acc, ign._1, fmt);
      } else {
        return make_invalid_arg(k, o, acc, fmt);
      }
    }
    if (ign !== /* Ignored_reader */2) {
      return make_invalid_arg(k, o, acc, fmt);
    }
    throw {
          RE_EXN_ID: "Assert_failure",
          _1: [
            "camlinternalFormat.ml",
            1593,
            39
          ],
          Error: new Error()
        };
  }

  function make_from_fmtty(k, o, acc, fmtty, fmt) {
    if (typeof fmtty === "number") {
      return make_invalid_arg(k, o, acc, fmt);
    }
    switch (fmtty.TAG | 0) {
      case /* Char_ty */0 :
          var rest = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest, fmt);
          };
      case /* String_ty */1 :
          var rest$1 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$1, fmt);
          };
      case /* Int_ty */2 :
          var rest$2 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$2, fmt);
          };
      case /* Int32_ty */3 :
          var rest$3 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$3, fmt);
          };
      case /* Nativeint_ty */4 :
          var rest$4 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$4, fmt);
          };
      case /* Int64_ty */5 :
          var rest$5 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$5, fmt);
          };
      case /* Float_ty */6 :
          var rest$6 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$6, fmt);
          };
      case /* Bool_ty */7 :
          var rest$7 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$7, fmt);
          };
      case /* Format_arg_ty */8 :
          var rest$8 = fmtty._1;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$8, fmt);
          };
      case /* Format_subst_ty */9 :
          var rest$9 = fmtty._2;
          var ty = trans(symm(fmtty._0), fmtty._1);
          return function (param) {
            return make_from_fmtty(k, o, acc, concat_fmtty(ty, rest$9), fmt);
          };
      case /* Alpha_ty */10 :
          var rest$10 = fmtty._0;
          return function (param, param$1) {
            return make_from_fmtty(k, o, acc, rest$10, fmt);
          };
      case /* Theta_ty */11 :
          var rest$11 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$11, fmt);
          };
      case /* Any_ty */12 :
          var rest$12 = fmtty._0;
          return function (param) {
            return make_from_fmtty(k, o, acc, rest$12, fmt);
          };
      case /* Reader_ty */13 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  1616,
                  31
                ],
                Error: new Error()
              };
      case /* Ignored_reader_ty */14 :
          throw {
                RE_EXN_ID: "Assert_failure",
                _1: [
                  "camlinternalFormat.ml",
                  1617,
                  31
                ],
                Error: new Error()
              };
      
    }
  }

  function make_invalid_arg(k, o, acc, fmt) {
    return make_printf(k, o, {
                TAG: /* Acc_invalid_arg */8,
                _0: acc,
                _1: "Printf: bad conversion %_"
              }, fmt);
  }

  function make_padding(k, o, acc, fmt, pad, trans) {
    if (typeof pad === "number") {
      return function (x) {
        var new_acc_1 = _1(trans, x);
        var new_acc = {
          TAG: /* Acc_data_string */4,
          _0: acc,
          _1: new_acc_1
        };
        return make_printf(k, o, new_acc, fmt);
      };
    }
    if (pad.TAG) {
      var padty = pad._0;
      return function (w, x) {
        var new_acc_1 = fix_padding(padty, w, _1(trans, x));
        var new_acc = {
          TAG: /* Acc_data_string */4,
          _0: acc,
          _1: new_acc_1
        };
        return make_printf(k, o, new_acc, fmt);
      };
    }
    var width = pad._1;
    var padty$1 = pad._0;
    return function (x) {
      var new_acc_1 = fix_padding(padty$1, width, _1(trans, x));
      var new_acc = {
        TAG: /* Acc_data_string */4,
        _0: acc,
        _1: new_acc_1
      };
      return make_printf(k, o, new_acc, fmt);
    };
  }

  function make_int_padding_precision(k, o, acc, fmt, pad, prec, trans, iconv) {
    if (typeof pad === "number") {
      if (typeof prec === "number") {
        if (prec !== 0) {
          return function (p, x) {
            var str = fix_int_precision(p, _2(trans, iconv, x));
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: str
                      }, fmt);
          };
        } else {
          return function (x) {
            var str = _2(trans, iconv, x);
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: str
                      }, fmt);
          };
        }
      }
      var p = prec._0;
      return function (x) {
        var str = fix_int_precision(p, _2(trans, iconv, x));
        return make_printf(k, o, {
                    TAG: /* Acc_data_string */4,
                    _0: acc,
                    _1: str
                  }, fmt);
      };
    }
    if (pad.TAG) {
      var padty = pad._0;
      if (typeof prec === "number") {
        if (prec !== 0) {
          return function (w, p, x) {
            var str = fix_padding(padty, w, fix_int_precision(p, _2(trans, iconv, x)));
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: str
                      }, fmt);
          };
        } else {
          return function (w, x) {
            var str = fix_padding(padty, w, _2(trans, iconv, x));
            return make_printf(k, o, {
                        TAG: /* Acc_data_string */4,
                        _0: acc,
                        _1: str
                      }, fmt);
          };
        }
      }
      var p$1 = prec._0;
      return function (w, x) {
        var str = fix_padding(padty, w, fix_int_precision(p$1, _2(trans, iconv, x)));
        return make_printf(k, o, {
                    TAG: /* Acc_data_string */4,
                    _0: acc,
                    _1: str
                  }, fmt);
      };
    }
    var w = pad._1;
    var padty$1 = pad._0;
    if (typeof prec === "number") {
      if (prec !== 0) {
        return function (p, x) {
          var str = fix_padding(padty$1, w, fix_int_precision(p, _2(trans, iconv, x)));
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      } else {
        return function (x) {
          var str = fix_padding(padty$1, w, _2(trans, iconv, x));
          return make_printf(k, o, {
                      TAG: /* Acc_data_string */4,
                      _0: acc,
                      _1: str
                    }, fmt);
        };
      }
    }
    var p$2 = prec._0;
    return function (x) {
      var str = fix_padding(padty$1, w, fix_int_precision(p$2, _2(trans, iconv, x)));
      return make_printf(k, o, {
                  TAG: /* Acc_data_string */4,
                  _0: acc,
                  _1: str
                }, fmt);
    };
  }

  function make_custom(k, o, acc, rest, arity, f) {
    if (!arity) {
      return make_printf(k, o, {
                  TAG: /* Acc_data_string */4,
                  _0: acc,
                  _1: f
                }, rest);
    }
    var arity$1 = arity._0;
    return function (x) {
      return make_custom(k, o, acc, rest, arity$1, _1(f, x));
    };
  }

  function strput_acc(b, _acc) {
    while(true) {
      var acc = _acc;
      var exit = 0;
      if (typeof acc === "number") {
        return ;
      }
      switch (acc.TAG | 0) {
        case /* Acc_formatting_lit */0 :
            var s = string_of_formatting_lit(acc._1);
            strput_acc(b, acc._0);
            return add_string(b, s);
        case /* Acc_formatting_gen */1 :
            var acc$prime = acc._1;
            var p = acc._0;
            if (acc$prime.TAG) {
              strput_acc(b, p);
              add_string(b, "@[");
              _acc = acc$prime._0;
              continue ;
            }
            strput_acc(b, p);
            add_string(b, "@{");
            _acc = acc$prime._0;
            continue ;
        case /* Acc_string_literal */2 :
        case /* Acc_data_string */4 :
            exit = 1;
            break;
        case /* Acc_char_literal */3 :
        case /* Acc_data_char */5 :
            exit = 2;
            break;
        case /* Acc_delay */6 :
            strput_acc(b, acc._0);
            return add_string(b, _1(acc._1, undefined));
        case /* Acc_flush */7 :
            _acc = acc._0;
            continue ;
        case /* Acc_invalid_arg */8 :
            strput_acc(b, acc._0);
            throw {
                  RE_EXN_ID: "Invalid_argument",
                  _1: acc._1,
                  Error: new Error()
                };
        
      }
      switch (exit) {
        case 1 :
            strput_acc(b, acc._0);
            return add_string(b, acc._1);
        case 2 :
            strput_acc(b, acc._0);
            return add_char(b, acc._1);
        
      }
    }}
  /* No side effect */

  function ksprintf(k, param) {
    var k$prime = function (param, acc) {
      var buf = create$1(64);
      strput_acc(buf, acc);
      return _1(k, contents(buf));
    };
    return make_printf(k$prime, undefined, /* End_of_acc */0, param._0);
  }

  function sprintf(fmt) {
    return ksprintf((function (s) {
                  return s;
                }), fmt);
  }
  /* No side effect */

  function renderBbox(sprite, posx, posy) {
    var match = sprite.params.bboxOffset;
    var match$1 = sprite.params.bboxSize;
    var context = getContext();
    context.strokeStyle = "#FF0000";
    return context.strokeRect(posx + match[0], posy + match[1], match$1[0], match$1[1]);
  }

  function render(sprite, posx, posy) {
    var match = sprite.params.srcOffset;
    var match$1 = sprite.params.frameSize;
    var sw = match$1[0];
    var match$2 = sprite.params.frameSize;
    var sx = match[0] + sprite.frame * sw;
    var context = getContext();
    return context.drawImage(sprite.img, sx, match[1], sw, match$1[1], posx, posy, match$2[0], match$2[1]);
  }

  function drawBgd(bgd, off_x) {
    render(bgd, -off_x, 0);
    return render(bgd, bgd.params.frameSize[0] - off_x, 0);
  }

  function clearCanvas(param) {
    var canvas = getCanvas();
    var context = getContext();
    var cwidth = canvas.width;
    var cheight = canvas.height;
    return context.clearRect(0, 0, cwidth, cheight);
  }

  function hud(score, coins) {
    var score_string = _1(sprintf(/* Format */{
              _0: {
                TAG: /* Int */4,
                _0: /* Int_d */0,
                _1: {
                  TAG: /* Lit_padding */0,
                  _0: /* Zeros */2,
                  _1: 7
                },
                _2: /* No_precision */0,
                _3: /* End_of_format */0
              },
              _1: "%07d"
            }), score);
    var coin_string = String(coins);
    var context = getContext();
    context.font = "10px 'Press Start 2P'";
    context.fillText("Cx" + coin_string, 10, 18);
    return context.fillText(score_string, 260, 18);
  }

  function fps(fps_val) {
    var fps_str = String(fps_val | 0);
    return getContext().fillText(fps_str, 80, 18);
  }

  function blackScreen(texts) {
    var ctx = getContext();
    var fontSize = 20 / scale;
    var fontTxt = String(fontSize | 0) + "px";
    ctx.rect(0, 0, 512 / scale, 512 / scale);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = fontTxt + "'Press Start 2P'";
    forEach(texts, (function (param) {
            return ctx.fillText(param[0], param[1] / scale, param[2] / scale);
          }));
    ctx.fillStyle = "black";
    
  }

  function levelFinished(result, level, elapsed) {
    if (result) {
      return blackScreen(/* :: */{
                  _0: [
                    "You lose level " + (level + "!"),
                    80,
                    100
                  ],
                  _1: /* :: */{
                    _0: [
                      elapsed,
                      230,
                      160
                    ],
                    _1: /* [] */0
                  }
                });
    } else {
      return blackScreen(/* :: */{
                  _0: [
                    "You win level" + (level + "!"),
                    80,
                    100
                  ],
                  _1: /* :: */{
                    _0: [
                      elapsed,
                      230,
                      160
                    ],
                    _1: /* [] */0
                  }
                });
    }
  }
  /* No side effect */

  function mod_(x, y) {
    if (y === 0) {
      throw {
            RE_EXN_ID: "Division_by_zero",
            Error: new Error()
          };
    }
    return x % y;
  }
  /* No side effect */

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
    var bboxSize$1 = caml_equal(bboxSize, [
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

  function makeBlock(param) {
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
      spr.frame = mod_(spr.frame + 1 | 0, spr.params.maxFrames);
    } else {
      spr.ticks = curr_ticks + 1 | 0;
    }
    
  }
  /* brickParams Not a pure module */

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

  function make$1(velOpt, accOpt, partType, px, py) {
    var vel = velOpt !== undefined ? velOpt : [
        0,
        0
      ];
    var acc = accOpt !== undefined ? accOpt : [
        0,
        0
      ];
    var params = makeType(partType);
    var vel$1 = pairToXy(vel);
    var acc$1 = pairToXy(acc);
    return {
            params: params,
            px: px,
            py: py,
            vel: vel$1,
            acc: acc$1,
            kill: false,
            life: params.lifetime
          };
  }

  function makeScore(score, pos) {
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
    var partial_arg = [
      0.5,
      -0.7
    ];
    return function (param) {
      return make$1(partial_arg, undefined, t, pos, param);
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
  /* Sprite Not a pure module */

  var idCounter = {
    contents: min_int$1
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

  function makeItem$1(o, t) {
    if (t) {
      o.hasGravity = false;
      return ;
    }
    
  }

  function makeEnemy$1(o, t) {
    if (t >= 3) {
      o.speed = 3;
      return ;
    }
    
  }

  function newId(param) {
    idCounter.contents = idCounter.contents + 1 | 0;
    return idCounter.contents;
  }

  function make$2(hasGravityOpt, speedOpt, dirOpt, objTyp, spriteParams, px, py) {
    var hasGravity = hasGravityOpt !== undefined ? hasGravityOpt : true;
    var speed = speedOpt !== undefined ? speedOpt : 1.0;
    var dir = dirOpt !== undefined ? dirOpt : /* Left */0;
    var newObj = {
      objTyp: objTyp,
      sprite: makeFromParams(spriteParams),
      hasGravity: hasGravity,
      speed: speed,
      id: newId(),
      px: px,
      py: py,
      vx: 0.0,
      vy: 0.0,
      jumping: false,
      grounded: false,
      dir: dir,
      invuln: 0,
      kill: false,
      health: 1,
      crouch: false,
      score: 0
    };
    switch (objTyp.TAG | 0) {
      case /* Player */0 :
          newObj.speed = playerSpeed;
          break;
      case /* Enemy */1 :
          makeEnemy$1(newObj, objTyp._0);
          break;
      case /* Item */2 :
          makeItem$1(newObj, objTyp._0);
          break;
      case /* Block */3 :
          newObj.hasGravity = false;
          break;
      
    }
    return newObj;
  }

  function isPlayer(param) {
    var match = param.objTyp;
    if (match.TAG) {
      return false;
    } else {
      return true;
    }
  }

  function isEnemy(param) {
    var match = param.objTyp;
    if (match.TAG === /* Enemy */1) {
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
      case /* CLeft */0 :
          if (!player.crouch) {
            if (player.vx > -player.speed) {
              player.vx = player.vx - (0.4 + Math.abs(lr_acc));
            }
            player.dir = /* Left */0;
            return ;
          } else {
            return ;
          }
      case /* CRight */1 :
          if (!player.crouch) {
            if (player.vx < player.speed) {
              player.vx = player.vx + (0.4 + Math.abs(lr_acc));
            }
            player.dir = /* Right */1;
            return ;
          } else {
            return ;
          }
      case /* CUp */2 :
          if (!player.jumping && player.grounded) {
            return jump(player);
          } else {
            return ;
          }
      case /* CDown */3 :
          if (!player.jumping && player.grounded) {
            player.crouch = true;
            return ;
          } else {
            return ;
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

  function updatePlayer(player, n, keys) {
    var prev_jumping = player.jumping;
    var prev_dir = player.dir;
    var prev_vx = Math.abs(player.vx);
    forEach(keys, (function (param) {
            return updatePlayerKeys(player, param);
          }));
    var v = player.vx * friction;
    var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
    player.vx = vel_damped;
    var plSize = player.health <= 1 ? /* SmallM */1 : /* BigM */0;
    var playerTyp = !prev_jumping && player.jumping ? /* Jumping */1 : (
        prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vx) > 0 && !player.jumping ? /* Running */2 : (
            prev_dir !== player.dir && player.jumping && prev_jumping ? /* Jumping */1 : (
                player.vy === 0 && player.crouch ? /* Crouching */3 : (
                    player.vy === 0 && player.vx === 0 ? /* Standing */0 : undefined
                  )
              )
          )
      );
    if (playerTyp === undefined) {
      return ;
    }
    var newSprite = makeFromParams(makePlayer(plSize, playerTyp, player.dir));
    normalizePos(player, player.sprite.params, newSprite.params);
    player.objTyp = {
      TAG: /* Player */0,
      _0: plSize,
      _1: n
    };
    player.sprite = newSprite;
    
  }

  function updateVel$1(obj) {
    if (obj.grounded) {
      obj.vy = 0;
      return ;
    } else if (obj.hasGravity) {
      obj.vy = caml_float_min(obj.vy + gravity + Math.abs(obj.vy) * 0.01, maxYVel);
      return ;
    } else {
      return ;
    }
  }

  function updatePos$1(obj) {
    obj.px = obj.vx + obj.px;
    if (obj.hasGravity) {
      obj.py = obj.vy + obj.py;
      return ;
    }
    
  }

  function processObj(obj, level) {
    updateVel$1(obj);
    updatePos$1(obj);
    if (obj.py > levelHeight()) {
      obj.kill = true;
      return ;
    }
    
  }

  function collideBlock(dir, obj) {
    if (dir !== 1) {
      if (dir !== 0) {
        obj.vx = 0;
      } else {
        obj.vy = -0.001;
      }
    } else {
      obj.vy = 0;
      obj.grounded = true;
      obj.jumping = false;
    }
    
  }

  function reverseLeftRight(obj) {
    obj.vx = -obj.vx;
    obj.dir = obj.dir ? /* Left */0 : /* Right */1;
    
  }

  function evolveEnemy(player_dir, typ, spr, obj) {
    switch (typ) {
      case /* Goomba */0 :
          obj.kill = true;
          return ;
      case /* GKoopa */1 :
          var newObj = make$2(undefined, 3, obj.dir, {
                TAG: /* Enemy */1,
                _0: /* GKoopaShell */3
              }, makeEnemy(/* GKoopaShell */3, obj.dir), obj.px, obj.py);
          normalizePos(newObj, spr.params, newObj.sprite.params);
          return newObj;
      case /* RKoopa */2 :
          return make$2(undefined, 3, obj.dir, {
                      TAG: /* Enemy */1,
                      _0: /* RKoopaShell */4
                    }, makeEnemy(/* RKoopaShell */4, obj.dir), obj.px, obj.py);
      
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
    return make$2(false, undefined, obj.dir, {
                TAG: /* Block */3,
                _0: /* QBlockUsed */0
              }, makeBlock(/* QBlockUsed */0), obj.px, obj.py);
  }

  function spawnAbove(player_dir, obj, itemTyp) {
    var item = make$2(itemTyp !== /* Coin */1, undefined, /* Left */0, {
          TAG: /* Item */2,
          _0: itemTyp
        }, makeItem(itemTyp), obj.px, obj.py);
    item.py = item.py - item.sprite.params.frameSize[1];
    item.dir = player_dir ? /* Left */0 : /* Right */1;
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
      case /* Player */0 :
          if (match$1.TAG === /* Enemy */1) {
            return c1.invuln > 0;
          } else {
            return false;
          }
      case /* Enemy */1 :
          if (match$1.TAG === /* Item */2) {
            return true;
          } else {
            return false;
          }
      case /* Item */2 :
          switch (match$1.TAG | 0) {
            case /* Enemy */1 :
            case /* Item */2 :
                return true;
            case /* Player */0 :
            case /* Block */3 :
                return false;
            
          }
      case /* Block */3 :
          return false;
      
    }
  }

  function checkCollision(o1, o2) {
    var b1 = getAabb(o1);
    var b2 = getAabb(o2);
    if (colBypass(o1, o2)) {
      return ;
    }
    var vx = b1.center.x - b2.center.x;
    var vy = b1.center.y - b2.center.y;
    var hwidths = b1.half.x + b2.half.x;
    var hheights = b1.half.y + b2.half.y;
    if (!(Math.abs(vx) < hwidths && Math.abs(vy) < hheights)) {
      return ;
    }
    var ox = hwidths - Math.abs(vx);
    var oy = hheights - Math.abs(vy);
    if (ox + 0.2 > oy) {
      if (vy > 0) {
        o1.py = o1.py + oy;
        return /* North */0;
      } else {
        o1.py = o1.py - oy;
        return /* South */1;
      }
    } else if (vx > 0) {
      o1.px = o1.px + ox;
      return /* West */3;
    } else {
      o1.px = o1.px - ox;
      return /* East */2;
    }
  }

  function kill(obj) {
    var t = obj.objTyp;
    switch (t.TAG | 0) {
      case /* Player */0 :
          return /* [] */0;
      case /* Enemy */1 :
          var score = obj.score > 0 ? /* :: */({
                _0: makeScore(obj.score, obj.px)(obj.py),
                _1: /* [] */0
              }) : /* [] */0;
          var remains = t._0 !== 0 ? /* [] */0 : /* :: */({
                _0: make$1(undefined, undefined, /* GoombaSquish */0, obj.px, obj.py),
                _1: /* [] */0
              });
          return $at(score, remains);
      case /* Item */2 :
          if (t._0) {
            return /* [] */0;
          } else {
            return /* :: */{
                    _0: makeScore(obj.score, obj.px)(obj.py),
                    _1: /* [] */0
                  };
          }
      case /* Block */3 :
          var t$1 = t._0;
          if (typeof t$1 !== "number") {
            return /* [] */0;
          }
          if (t$1 !== 1) {
            return /* [] */0;
          }
          var p1 = make$1([
                -5,
                -5
              ], [
                0,
                0.2
              ], /* BrickChunkL */1, obj.px, obj.py);
          var p2 = make$1([
                -3,
                -4
              ], [
                0,
                0.2
              ], /* BrickChunkL */1, obj.px, obj.py);
          var p3 = make$1([
                3,
                -4
              ], [
                0,
                0.2
              ], /* BrickChunkR */2, obj.px, obj.py);
          var p4 = make$1([
                5,
                -5
              ], [
                0,
                0.2
              ], /* BrickChunkR */2, obj.px, obj.py);
          return /* :: */{
                  _0: p1,
                  _1: /* :: */{
                    _0: p2,
                    _1: /* :: */{
                      _0: p3,
                      _1: /* :: */{
                        _0: p4,
                        _1: /* [] */0
                      }
                    }
                  }
                };
      
    }
  }
  /* Sprite Not a pure module */

  function make$3(param, param$1) {
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
    return y + 20.0 >= vMaxY;
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
  /* No side effect */

  var Bottom = create("Array.Bottom");
  /* No side effect */

  function cmn(q, a, b, x, s, t) {
    var a$1 = ((a + q | 0) + x | 0) + t | 0;
    return ((a$1 << s) | (a$1 >>> (32 - s | 0)) | 0) + b | 0;
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
    for(var i = 0; i <= 15; ++i){
      md5blk[i] = 0;
    }
    var i_end = n / 64 | 0;
    for(var i$1 = 1; i$1 <= i_end; ++i$1){
      for(var j = 0; j <= 15; ++j){
        var k = ((i$1 << 6) - 64 | 0) + (j << 2) | 0;
        md5blk[j] = ((s$1.charCodeAt(k) + (s$1.charCodeAt(k + 1 | 0) << 8) | 0) + (s$1.charCodeAt(k + 2 | 0) << 16) | 0) + (s$1.charCodeAt(k + 3 | 0) << 24) | 0;
      }
      cycle(state, md5blk);
    }
    var s_tail = s$1.slice((i_end << 6));
    for(var kk = 0; kk <= 15; ++kk){
      md5blk[kk] = 0;
    }
    var i_end$1 = s_tail.length - 1 | 0;
    for(var i$2 = 0; i$2 <= i_end$1; ++i$2){
      md5blk[i$2 / 4 | 0] = md5blk[i$2 / 4 | 0] | (s_tail.charCodeAt(i$2) << (i$2 % 4 << 3));
    }
    var i$3 = i_end$1 + 1 | 0;
    md5blk[i$3 / 4 | 0] = md5blk[i$3 / 4 | 0] | (128 << (i$3 % 4 << 3));
    if (i$3 > 55) {
      cycle(state, md5blk);
      for(var i$4 = 0; i$4 <= 15; ++i$4){
        md5blk[i$4] = 0;
      }
    }
    md5blk[14] = (n << 3);
    cycle(state, md5blk);
    return String.fromCharCode(state[0] & 255, (state[0] >> 8) & 255, (state[0] >> 16) & 255, (state[0] >> 24) & 255, state[1] & 255, (state[1] >> 8) & 255, (state[1] >> 16) & 255, (state[1] >> 24) & 255, state[2] & 255, (state[2] >> 8) & 255, (state[2] >> 16) & 255, (state[2] >> 24) & 255, state[3] & 255, (state[3] >> 8) & 255, (state[3] >> 16) & 255, (state[3] >> 24) & 255);
  }
  /* No side effect */

  function string(str) {
    return caml_md5_string(str, 0, str.length);
  }
  /* No side effect */

  function full_init(s, seed) {
    var combine = function (accu, x) {
      return string(accu + String(x));
    };
    var extract = function (d) {
      return ((get(d, 0) + (get(d, 1) << 8) | 0) + (get(d, 2) << 16) | 0) + (get(d, 3) << 24) | 0;
    };
    var seed$1 = seed.length === 0 ? [0] : seed;
    var l = seed$1.length;
    for(var i = 0; i <= 54; ++i){
      caml_array_set(s.st, i, i);
    }
    var accu = "x";
    for(var i$1 = 0 ,i_finish = 54 + (
        55 > l ? 55 : l
      ) | 0; i$1 <= i_finish; ++i$1){
      var j = i$1 % 55;
      var k = i$1 % l;
      accu = combine(accu, caml_array_get(seed$1, k));
      caml_array_set(s.st, j, (caml_array_get(s.st, j) ^ extract(accu)) & 1073741823);
    }
    s.idx = 0;
    
  }

  function bits(s) {
    s.idx = (s.idx + 1 | 0) % 55;
    var curval = caml_array_get(s.st, s.idx);
    var newval = caml_array_get(s.st, (s.idx + 24 | 0) % 55) + (curval ^ (curval >>> 25) & 31) | 0;
    var newval30 = newval & 1073741823;
    caml_array_set(s.st, s.idx, newval30);
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
    while(true) {
      var r = bits(s);
      var v = r % bound;
      if ((r - v | 0) <= ((1073741823 - bound | 0) + 1 | 0)) {
        return v;
      }
      continue ;
    }}

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

  function init(seed) {
    return full_init($$default, [seed]);
  }
  /* No side effect */

  function memPos(_objs, x, y) {
    while(true) {
      var objs = _objs;
      if (!objs) {
        return false;
      }
      var match = objs._0;
      var px = match.px;
      var py = match.py;
      if (x === px && y === py) {
        return true;
      }
      _objs = objs._1;
      continue ;
    }}

  function trimEdge(x, y, level) {
    var pixx = blockw(level) * 16;
    var pixy = blockh() * 16;
    return !(x < 128 || pixx - x < 528 || y === 0 || pixy - y < 48);
  }

  function convertCoinToObj(param) {
    return make$2(false, undefined, undefined, {
                TAG: /* Item */2,
                _0: /* Coin */1
              }, makeItem(/* Coin */1), param[1], param[2]);
  }

  function addCoins(objects, x, y0, level) {
    var y = y0 - 16;
    if (bool$1() && trimEdge(x, y, level) && !memPos(objects.contents, x, y)) {
      objects.contents = /* :: */{
        _0: convertCoinToObj([
              /* QBlock */{
                _0: /* Coin */1
              },
              x,
              y
            ]),
        _1: objects.contents
      };
      return ;
    }
    
  }

  function convertEnemyToObj(param) {
    var enemyTyp = param[0];
    var obj = make$2(undefined, undefined, undefined, {
          TAG: /* Enemy */1,
          _0: enemyTyp
        }, makeEnemy(enemyTyp, /* Left */0), param[1], param[2]);
    setVelToSpeed(obj);
    return obj;
  }

  function randomEnemyTyp(param) {
    var match = $$int$1(3);
    if (match !== 0) {
      if (match !== 1) {
        return /* Goomba */0;
      } else {
        return /* GKoopa */1;
      }
    } else {
      return /* RKoopa */2;
    }
  }

  function addEnemyOnBlock(objects, x, y, level) {
    var placeEnemy = $$int$1(enemyDensity(level));
    if (placeEnemy === 0 && !memPos(objects.contents, x, y - 16)) {
      objects.contents = /* :: */{
        _0: convertEnemyToObj([
              randomEnemyTyp(),
              x,
              y - 16
            ]),
        _1: objects.contents
      };
      return ;
    }
    
  }

  function addBlock(objects, blockTyp, xBlock, yBlock, level) {
    var x = xBlock * 16;
    var y = yBlock * 16;
    if (!(!memPos(objects.contents, x, y) && trimEdge(x, y, level))) {
      return ;
    }
    var obj = make$2(undefined, undefined, undefined, {
          TAG: /* Block */3,
          _0: blockTyp
        }, makeBlock(blockTyp), x, y);
    objects.contents = /* :: */{
      _0: obj,
      _1: objects.contents
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
    while(true) {
      var num = _num;
      var cbx = _cbx;
      if (num === 0) {
        return ;
      }
      addBlock(blocks, typ, cbx, cby, level);
      _num = num - 1 | 0;
      _cbx = cbx + 1;
      continue ;
    }}

  function randomStairTyp(param) {
    if (bool$1()) {
      return /* UnBBlock */2;
    } else {
      return /* Brick */1;
    }
  }

  function chooseBlockPattern(cbx, cby, blocks, level) {
    if (cbx > blockw(level) || cby > blockh()) {
      return ;
    }
    var stairTyp = randomStairTyp();
    var lifeBlock = $$int$1(5) === 0;
    var middleBlock = lifeBlock ? /* QBlock */({
          _0: /* Mushroom */0
        }) : stairTyp;
    var match = $$int$1(5);
    switch (match) {
      case 0 :
          addBlock(blocks, stairTyp, cbx, cby, level);
          addBlock(blocks, middleBlock, cbx + 1, cby, level);
          return addBlock(blocks, stairTyp, cbx + 2, cby, level);
      case 1 :
          var numClouds = $$int$1(5) + 5 | 0;
          if (cby < 5) {
            return generateClouds(cbx, cby, /* Cloud */3, numClouds, blocks, level);
          } else {
            return ;
          }
      case 2 :
          if (blockh() - cby === 1) {
            return generateGroundStairs(cbx, cby, stairTyp, blocks, level);
          } else {
            return ;
          }
      case 3 :
          if (stairTyp === /* Brick */1 && blockh() - cby > 3) {
            return generateAirdownStairs(cbx, cby, stairTyp, blocks, level);
          } else if (blockh() - cby > 2) {
            return generateAirupStairs(cbx, cby, stairTyp, blocks, level);
          } else {
            return addBlock(blocks, stairTyp, cbx, cby, level);
          }
      default:
        if (cby + 3 - blockh() === 2) {
          return addBlock(blocks, stairTyp, cbx, cby, level);
        } else if (cby + 3 - blockh() === 1) {
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
    while(true) {
      var cby = _cby;
      var cbx = _cbx;
      if (cbx > blockw(level) - 32) {
        return ;
      }
      if (cby > blockh() - 1 || cbx < 15) {
        _cby = 0;
        _cbx = cbx + 1;
        continue ;
      }
      if (cby === 0 || blockh() - 1 !== cby || $$int$1(10) !== 0) {
        _cby = cby + 1;
        continue ;
      }
      objects.contents = /* :: */{
        _0: convertEnemyToObj([
              randomEnemyTyp(),
              cbx * 16,
              cby * 16
            ]),
        _1: objects.contents
      };
      _cby = cby + 1;
      continue ;
    }}

  function generateBlocks(objects, _cbx, _cby, level) {
    while(true) {
      var cby = _cby;
      var cbx = _cbx;
      if (blockw(level) - cbx < 33) {
        return ;
      }
      if (cby > blockh() - 1) {
        _cby = 0;
        _cbx = cbx + 1;
        continue ;
      }
      if (memPos(objects.contents, cbx, cby) || cby === 0) {
        _cby = cby + 1;
        continue ;
      }
      if ($$int$1(20) === 0) {
        chooseBlockPattern(cbx, cby, objects, level);
        _cby = cby + 1;
        continue ;
      }
      _cby = cby + 1;
      continue ;
    }}

  function generatePanel(level) {
    return make$2(undefined, undefined, undefined, {
                TAG: /* Block */3,
                _0: /* Panel */4
              }, makeBlock(/* Panel */4), blockw(level) * 16 - 256, blockh() * 16 * 2 / 3);
  }

  function convertBlockToObj(param) {
    var blockTyp = param[0];
    return make$2(undefined, undefined, undefined, {
                TAG: /* Block */3,
                _0: blockTyp
              }, makeBlock(blockTyp), param[1], param[2]);
  }

  function generateGround(objects, _inc, level) {
    while(true) {
      var inc = _inc;
      if (inc > blockw(level)) {
        return ;
      }
      if (inc > 10) {
        var skip = $$int$1(10);
        if (skip === 7 && blockw(level) - inc > 32) {
          _inc = inc + 1;
          continue ;
        }
        objects.contents = /* :: */{
          _0: convertBlockToObj([
                /* Ground */5,
                inc * 16,
                blockh() * 16
              ]),
          _1: objects.contents
        };
        _inc = inc + 1;
        continue ;
      }
      objects.contents = /* :: */{
        _0: convertBlockToObj([
              /* Ground */5,
              inc * 16,
              blockh() * 16
            ]),
        _1: objects.contents
      };
      _inc = inc + 1;
      continue ;
    }}

  function generateHelper(level) {
    var objects = {
      contents: /* [] */0
    };
    generateBlocks(objects, 0, 0, level);
    generateGround(objects, 0, level);
    generateEnemiesOnGround(objects, 0, 0, level);
    var panel = generatePanel(level);
    return /* :: */{
            _0: panel,
            _1: objects.contents
          };
  }

  function generate(level) {
    init(randomSeed());
    var initial = performance.now();
    var objects = generateHelper(level);
    var player1 = make$2(undefined, undefined, undefined, {
          TAG: /* Player */0,
          _0: /* SmallM */1,
          _1: /* One */0
        }, makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), 100, 224);
    var player2 = make$2(undefined, undefined, undefined, {
          TAG: /* Player */0,
          _0: /* SmallM */1,
          _1: /* Two */1
        }, makePlayer(/* SmallM */1, /* Standing */0, /* Left */0), 120, 224);
    var elapsed = performance.now() - initial;
    console.log("generated", length(objects), "objects in " + (elapsed.toString() + " milliseconds"));
    return [
            player1,
            player2,
            objects
          ];
  }
  /* Object Not a pure module */

  var collidObjs = {
    contents: /* [] */0
  };

  var particles = {
    contents: /* [] */0
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
    var delta = (time - t0) / 1000;
    if (time - initialTime.contents < 1000.0) {
      return 0;
    } else {
      return 1 / delta;
    }
  }

  function updateScore(state, i) {
    state.score = state.score + i | 0;
    
  }

  function playerAttackEnemy(o1, enemyTyp, s2, o2, state) {
    o1.invuln = 10;
    o1.jumping = false;
    o1.grounded = true;
    if (enemyTyp >= 3) {
      var r2 = evolveEnemy(o1.dir, enemyTyp, s2, o2);
      o1.vy = -dampenJump;
      o1.py = o1.py - 5;
      return [
              undefined,
              r2
            ];
    }
    decHealth(o2);
    o1.vy = -dampenJump;
    if (state.multiplier === 8) {
      updateScore(state, 800);
      o2.score = 800;
      return [
              undefined,
              evolveEnemy(o1.dir, enemyTyp, s2, o2)
            ];
    }
    var score = Math.imul(100, state.multiplier);
    updateScore(state, score);
    o2.score = score;
    state.multiplier = (state.multiplier << 1);
    return [
            undefined,
            evolveEnemy(o1.dir, enemyTyp, s2, o2)
          ];
  }

  function enemyAttackPlayer(o1, t2, s2, o2) {
    if (t2 >= 3) {
      var r2 = o2.vx === 0 ? evolveEnemy(o1.dir, t2, s2, o2) : (decHealth(o1), o1.invuln = invuln, undefined);
      return [
              undefined,
              r2
            ];
    }
    decHealth(o1);
    o1.invuln = invuln;
    return [
            undefined,
            undefined
          ];
  }

  function collEnemyEnemy(t1, s1, o1, t2, s2, o2, dir) {
    if (t1 !== 3) {
      if (t1 < 4) {
        if (t2 >= 3) {
          if (o2.vx === 0) {
            revDir(o1, t1, s1);
            return [
                    undefined,
                    undefined
                  ];
          } else {
            decHealth(o1);
            return [
                    undefined,
                    undefined
                  ];
          }
        } else if (dir >= 2) {
          revDir(o1, t1, s1);
          revDir(o2, t2, s2);
          return [
                  undefined,
                  undefined
                ];
        } else {
          return [
                  undefined,
                  undefined
                ];
        }
      }
      if (t2 >= 3) {
        decHealth(o1);
        decHealth(o2);
        return [
                undefined,
                undefined
              ];
      }
      
    } else if (t2 >= 3) {
      decHealth(o1);
      decHealth(o2);
      return [
              undefined,
              undefined
            ];
    }
    if (o1.vx === 0) {
      revDir(o2, t2, s2);
      return [
              undefined,
              undefined
            ];
    } else {
      decHealth(o2);
      return [
              undefined,
              undefined
            ];
    }
  }

  function processCollision(dir, obj1, obj2, state) {
    var t2;
    var t1 = obj1.objTyp;
    switch (t1.TAG | 0) {
      case /* Player */0 :
          var t = obj2.objTyp;
          switch (t.TAG | 0) {
            case /* Player */0 :
                if (dir >= 2) {
                  obj2.vx = obj2.vx + obj1.vx;
                  return [
                          undefined,
                          undefined
                        ];
                } else {
                  return [
                          undefined,
                          undefined
                        ];
                }
            case /* Enemy */1 :
                var typ = t._0;
                var s2 = obj2.sprite;
                if (dir !== 1) {
                  return enemyAttackPlayer(obj1, typ, s2, obj2);
                } else {
                  return playerAttackEnemy(obj1, typ, s2, obj2, state);
                }
            case /* Item */2 :
                t2 = t._0;
                break;
            case /* Block */3 :
                var t$1 = t._0;
                if (dir !== 0) {
                  var exit = 0;
                  if (typeof t$1 === "number" && t$1 === 4) {
                    state.status = /* Finished */{
                      levelResult: /* Won */0,
                      finishTime: performance.now()
                    };
                    return [
                            undefined,
                            undefined
                          ];
                  }
                  exit = 2;
                  if (exit === 2) {
                    if (dir !== 1) {
                      collideBlock(dir, obj1);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      state.multiplier = 1;
                      collideBlock(dir, obj1);
                      return [
                              undefined,
                              undefined
                            ];
                    }
                  }
                  
                } else {
                  if (typeof t$1 === "number") {
                    if (t$1 !== 1) {
                      if (t$1 !== 4) {
                        collideBlock(dir, obj1);
                        return [
                                undefined,
                                undefined
                              ];
                      } else {
                        state.status = /* Finished */{
                          levelResult: /* Won */0,
                          finishTime: performance.now()
                        };
                        return [
                                undefined,
                                undefined
                              ];
                      }
                    } else if (t1._0 === /* BigM */0) {
                      collideBlock(dir, obj1);
                      decHealth(obj2);
                      return [
                              undefined,
                              undefined
                            ];
                    } else {
                      collideBlock(dir, obj1);
                      return [
                              undefined,
                              undefined
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
            
          }
          break;
      case /* Enemy */1 :
          var t1$1 = t1._0;
          var s1 = obj1.sprite;
          var t2$1 = obj2.objTyp;
          switch (t2$1.TAG | 0) {
            case /* Player */0 :
                if (dir !== 0) {
                  return enemyAttackPlayer(obj1, t1$1, s1, obj2);
                } else {
                  return playerAttackEnemy(obj1, t1$1, s1, obj2, state);
                }
            case /* Enemy */1 :
                var s2$1 = obj2.sprite;
                return collEnemyEnemy(t1$1, s1, obj1, t2$1._0, s2$1, obj2, dir);
            case /* Item */2 :
                return [
                        undefined,
                        undefined
                      ];
            case /* Block */3 :
                var t2$2 = t2$1._0;
                if (dir >= 2) {
                  if (t1$1 >= 3) {
                    if (typeof t2$2 === "number") {
                      if (t2$2 !== 1) {
                        revDir(obj1, t1$1, s1);
                        return [
                                undefined,
                                undefined
                              ];
                      } else {
                        decHealth(obj2);
                        reverseLeftRight(obj1);
                        return [
                                undefined,
                                undefined
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
                          undefined,
                          undefined
                        ];
                }
                collideBlock(dir, obj1);
                return [
                        undefined,
                        undefined
                      ];
            
          }
      case /* Item */2 :
          var match = obj2.objTyp;
          switch (match.TAG | 0) {
            case /* Player */0 :
                t2 = t1._0;
                break;
            case /* Enemy */1 :
            case /* Item */2 :
                return [
                        undefined,
                        undefined
                      ];
            case /* Block */3 :
                if (dir >= 2) {
                  reverseLeftRight(obj1);
                  return [
                          undefined,
                          undefined
                        ];
                } else {
                  collideBlock(dir, obj1);
                  return [
                          undefined,
                          undefined
                        ];
                }
            
          }
          break;
      case /* Block */3 :
          return [
                  undefined,
                  undefined
                ];
      
    }
    if (t2) {
      state.coins = state.coins + 1 | 0;
      decHealth(obj2);
      updateScore(state, 100);
      return [
              undefined,
              undefined
            ];
    } else {
      decHealth(obj2);
      if (obj1.health === 2) ; else {
        obj1.health = obj1.health + 1 | 0;
      }
      obj1.vx = 0;
      obj1.vy = 0;
      updateScore(state, 1000);
      obj2.score = 1000;
      return [
              undefined,
              undefined
            ];
    }
  }

  function viewportFilter(obj, state) {
    if (inViewport(state.viewport, obj.px, obj.py) || isPlayer(obj)) {
      return true;
    } else {
      return outOfViewportBelow(state.viewport, obj.py);
    }
  }

  function broadPhase(allCollids, state) {
    return keep(allCollids, (function (o) {
                  return viewportFilter(o, state);
                }));
  }

  function narrowPhase(obj, cs, state) {
    var _cs = cs;
    var _acc = /* [] */0;
    while(true) {
      var acc = _acc;
      var cs$1 = _cs;
      if (!cs$1) {
        return acc;
      }
      var h = cs$1._0;
      var newObjs;
      if (equals(obj, h)) {
        newObjs = [
          undefined,
          undefined
        ];
      } else {
        var dir = checkCollision(obj, h);
        newObjs = dir !== undefined && h.id !== obj.id ? processCollision(dir, obj, h, state) : [
            undefined,
            undefined
          ];
      }
      var o = newObjs[0];
      var acc$1;
      if (o !== undefined) {
        var o2 = newObjs[1];
        acc$1 = o2 !== undefined ? /* :: */({
              _0: o,
              _1: /* :: */{
                _0: o2,
                _1: acc
              }
            }) : /* :: */({
              _0: o,
              _1: acc
            });
      } else {
        var o$1 = newObjs[1];
        acc$1 = o$1 !== undefined ? /* :: */({
              _0: o$1,
              _1: acc
            }) : acc;
      }
      _acc = acc$1;
      _cs = cs$1._1;
      continue ;
    }}

  function checkCollisions(obj, state, objects) {
    var match = obj.objTyp;
    if (match.TAG === /* Block */3) {
      return /* [] */0;
    }
    var broad = broadPhase(objects, state);
    return narrowPhase(obj, broad, state);
  }

  function updateObject0(obj, state, objects, level) {
    var spr = obj.sprite;
    obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
    if (!((!obj.kill || isPlayer(obj)) && viewportFilter(obj, state))) {
      return /* [] */0;
    }
    obj.grounded = false;
    processObj(obj);
    var evolved = checkCollisions(obj, state, objects);
    var vptAdjXy = fromCoord(state.viewport, obj.px, obj.py);
    render(spr, vptAdjXy.x, vptAdjXy.y);
    if (checkBboxEnabled()) {
      renderBbox(spr, vptAdjXy.x, vptAdjXy.y);
    }
    if (obj.vx !== 0 || !isEnemy(obj)) {
      updateAnimation(spr);
    }
    return evolved;
  }

  function updateObject(obj, state, objects, level) {
    var match = obj.objTyp;
    if (match.TAG) {
      var evolved = updateObject0(obj, state, objects);
      if (!obj.kill) {
        collidObjs.contents = /* :: */{
          _0: obj,
          _1: $at(evolved, collidObjs.contents)
        };
      }
      var newParts = obj.kill ? kill(obj) : /* [] */0;
      particles.contents = $at(newParts, particles.contents);
      return ;
    }
    var n = match._1;
    var keys = translateKeys(n);
    obj.crouch = false;
    updatePlayer(obj, n, keys);
    var evolved$1 = updateObject0(obj, state, objects);
    collidObjs.contents = $at(evolved$1, collidObjs.contents);
    
  }

  function updateParticle(state, part) {
    $$process(part);
    var x = part.px - state.viewport.px;
    var y = part.py - state.viewport.py;
    render(part.params.sprite, x, y);
    if (!part.kill) {
      particles.contents = /* :: */{
        _0: part,
        _1: particles.contents
      };
      return ;
    }
    
  }

  function updateLoop(player1, player2, level, objects) {
    var viewport = make$3(getCanvasSizeScaled(), mapDim(level));
    update(viewport, player1.px, player1.py);
    var state = {
      bgd: makeBgd(),
      coins: 0,
      level: level,
      multiplier: 1,
      score: 0,
      status: /* Playing */0,
      viewport: viewport
    };
    var updateHelper = function (objects, parts) {
      var match = state.status;
      var exit = 0;
      if (match) {
        var finishTime = match.finishTime;
        if (performance.now() - finishTime > delayWhenFinished) {
          var levelResult = match.levelResult;
          var timeToStart = restartAfter - (performance.now() - finishTime) / 1000;
          if (timeToStart > 0) {
            levelFinished(levelResult, String(state.level), String(timeToStart | 0));
            requestAnimationFrame(function (param) {
                  return updateHelper(collidObjs.contents, particles.contents);
                });
            return ;
          }
          var level$1 = levelResult === /* Won */0 ? level + 1 | 0 : level;
          var match$1 = generate(level$1);
          return updateLoop(match$1[0], match$1[1], level$1, match$1[2]);
        }
        exit = 1;
      } else {
        exit = 1;
      }
      if (exit === 1) {
        var fps$1 = calcFps();
        collidObjs.contents = /* [] */0;
        particles.contents = /* [] */0;
        clearCanvas();
        var vposXInt = state.viewport.px / 5 | 0;
        var bgdWidth = state.bgd.params.frameSize[0] | 0;
        drawBgd(state.bgd, mod_(vposXInt, bgdWidth));
        updateObject(player1, state, /* :: */{
              _0: player2,
              _1: objects
            });
        updateObject(player2, state, /* :: */{
              _0: player1,
              _1: objects
            });
        if (player1.kill === true) {
          var match$2 = state.status;
          var exit$1 = 0;
          if (!(match$2 && match$2.levelResult)) {
            exit$1 = 2;
          }
          if (exit$1 === 2) {
            state.status = /* Finished */{
              levelResult: /* Lost */1,
              finishTime: performance.now()
            };
          }
          
        }
        update(state.viewport, player1.px, player1.py);
        forEach(objects, (function (obj) {
                return updateObject(obj, state, objects);
              }));
        forEach(parts, (function (part) {
                return updateParticle(state, part);
              }));
        fps(fps$1);
        hud(state.score, state.coins);
        requestAnimationFrame(function (param) {
              return updateHelper(collidObjs.contents, particles.contents);
            });
        return ;
      }
      
    };
    return updateHelper(objects, /* [] */0);
  }
  /* Object Not a pure module */

  function preload(param) {
    var loadCount = {
      contents: 0
    };
    var numImages = images.length;
    return forEachU(images, (function (img_src) {
                  var img = document.createElement("img");
                  img.src = spritesDir + img_src;
                  img.addEventListener("load", (function (param) {
                          loadCount.contents = loadCount.contents + 1 | 0;
                          if (loadCount.contents === numImages) {
                            var match = generate(1);
                            updateLoop(match[0], match[1], 1, match[2]);
                          }
                          return true;
                        }), true);
                  
                }));
  }

  window.onload = (function (param) {
      preload();
      return true;
    });
  /*  Not a pure module */

}());
