(function () {
'use strict';

var images = [
  "blocks.png",
  "items.png",
  "enemies.png",
  "mario-small.png"
];

var map_dim = /* tuple */[
  2400,
  256
];

var canvasId = "canvas";

var root_dir = "sprites/";

var level_width = 2400;

var level_height = 256;


/* No side effect */

var failure = /* tuple */[
  "Failure",
  -2
];

var invalid_argument = /* tuple */[
  "Invalid_argument",
  -3
];

var division_by_zero = /* tuple */[
  "Division_by_zero",
  -5
];

var assert_failure = /* tuple */[
  "Assert_failure",
  -10
];

failure.tag = 248;

invalid_argument.tag = 248;

division_by_zero.tag = 248;

assert_failure.tag = 248;


/*  Not a pure module */

function caml_array_sub(x, offset, len) {
  var result = new Array(len);
  var j = 0;
  var i = offset;
  while(j < len) {
    result[j] = x[i];
    j = j + 1 | 0;
    i = i + 1 | 0;
  }
  return result;
}

function caml_array_set(xs, index, newval) {
  if (index < 0 || index >= xs.length) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
  }
  xs[index] = newval;
  
}

function caml_array_get(xs, index) {
  if (index < 0 || index >= xs.length) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
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
  }
}

function _1(o, a0) {
  var arity = o.length;
  if (arity === 1) {
    return o(a0);
  } else {
    switch (arity) {
      case 1 :
          return o(a0);
      case 2 :
          return (function (param) {
              return o(a0, param);
            });
      case 3 :
          return (function (param, param$1) {
              return o(a0, param, param$1);
            });
      case 4 :
          return (function (param, param$1, param$2) {
              return o(a0, param, param$1, param$2);
            });
      case 5 :
          return (function (param, param$1, param$2, param$3) {
              return o(a0, param, param$1, param$2, param$3);
            });
      case 6 :
          return (function (param, param$1, param$2, param$3, param$4) {
              return o(a0, param, param$1, param$2, param$3, param$4);
            });
      case 7 :
          return (function (param, param$1, param$2, param$3, param$4, param$5) {
              return o(a0, param, param$1, param$2, param$3, param$4, param$5);
            });
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
    return (function (a0) {
        return _1(o, a0);
      });
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
          return (function (param) {
              return o(a0, a1, param);
            });
      case 4 :
          return (function (param, param$1) {
              return o(a0, a1, param, param$1);
            });
      case 5 :
          return (function (param, param$1, param$2) {
              return o(a0, a1, param, param$1, param$2);
            });
      case 6 :
          return (function (param, param$1, param$2, param$3) {
              return o(a0, a1, param, param$1, param$2, param$3);
            });
      case 7 :
          return (function (param, param$1, param$2, param$3, param$4) {
              return o(a0, a1, param, param$1, param$2, param$3, param$4);
            });
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
    return (function (a0, a1) {
        return _2(o, a0, a1);
      });
  }
}


/* No side effect */

function __(tag, block) {
  block.tag = tag;
  return block;
}


/* No side effect */

function caml_int_min(x, y) {
  if (x < y) {
    return x;
  } else {
    return y;
  }
}

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

var for_in = (function(o,foo){
        for (var x in o) { foo(x); }});

function caml_equal(_a, _b) {
  while(true) {
    var b = _b;
    var a = _a;
    if (a === b) {
      return true;
    }
    var a_type = typeof a;
    if (a_type === "string" || a_type === "number" || a_type === "boolean" || a_type === "undefined" || a === null) {
      return false;
    }
    var b_type = typeof b;
    if (a_type === "function" || b_type === "function") {
      throw [
            invalid_argument,
            "equal: functional value"
          ];
    }
    if (b_type === "number" || b_type === "undefined" || b === null) {
      return false;
    }
    var tag_a = a.tag | 0;
    var tag_b = b.tag | 0;
    if (tag_a === 250) {
      _a = a[0];
      continue ;
    }
    if (tag_b === 250) {
      _b = b[0];
      continue ;
    }
    if (tag_a === 248) {
      return a[1] === b[1];
    }
    if (tag_a === 251) {
      throw [
            invalid_argument,
            "equal: abstract value"
          ];
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
        }
      } else if ((a instanceof Date && b instanceof Date)) {
        return !(a > b || a < b);
      } else {
        var result = {
          contents: true
        };
        var do_key_a = (function(b,result){
        return function do_key_a(key) {
          if (!b.hasOwnProperty(key)) {
            result.contents = false;
            return ;
          }
          
        }
        }(b,result));
        var do_key_b = (function(a,b,result){
        return function do_key_b(key) {
          if (!a.hasOwnProperty(key) || !caml_equal(b[key], a[key])) {
            result.contents = false;
            return ;
          }
          
        }
        }(a,b,result));
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
}


/* No side effect */

var id = {
  contents: 0
};

function caml_fresh_oo_id(param) {
  id.contents = id.contents + 1;
  return id.contents;
}

function create(str) {
  var v_001 = caml_fresh_oo_id(undefined);
  var v = /* tuple */[
    str,
    v_001
  ];
  v.tag = 248;
  return v;
}

function caml_is_extension(e) {
  if (e === undefined) {
    return false;
  }
  if (e.tag === 248) {
    return true;
  }
  var slot = e[0];
  if (slot !== undefined) {
    return slot.tag === 248;
  } else {
    return false;
  }
}


/* No side effect */

/* No side effect */

var $$Error = create("Caml_js_exceptions.Error");

function internalToOCamlException(e) {
  if (caml_is_extension(e)) {
    return e;
  } else {
    return [
            $$Error,
            e
          ];
  }
}


/* No side effect */

var Bottom = create("Array.Bottom");


/* No side effect */

function mod_(x, y) {
  if (y === 0) {
    throw division_by_zero;
  }
  return x % y;
}

var imul = (Math.imul || function (x,y) {
  y |= 0; return ((((x >> 16) * y) << 16) + (x & 0xffff) * y)|0; 
});


/* imul Not a pure module */

/* Caml_int32 Not a pure module */

/* No side effect */

/* No side effect */

/* No side effect */

function caml_create_bytes(len) {
  if (len < 0) {
    throw [
          invalid_argument,
          "String.create"
        ];
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
  var i = 0;
  var len = a.length;
  var s = "";
  var s_len = len;
  if (i === 0 && len <= 4096 && len === a.length) {
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
  }
  return s;
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

/* No side effect */

function sub$3(s, ofs, len) {
  if (ofs < 0 || len < 0 || ofs > (s.length - len | 0)) {
    throw [
          invalid_argument,
          "String.sub / Bytes.sub"
        ];
  }
  var r = caml_create_bytes(len);
  caml_blit_bytes(s, ofs, r, 0, len);
  return r;
}


/* No side effect */

function sub$2(s, ofs, len) {
  return bytes_to_string(sub$3(bytes_of_string(s), ofs, len));
}


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

/* No side effect */

function caml_sys_random_seed(param) {
  return [((Date.now() | 0) ^ 4294967295) * Math.random() | 0];
}


/* No side effect */

function get$1(s, i) {
  if (i >= s.length || i < 0) {
    throw [
          invalid_argument,
          "index out of bounds"
        ];
  }
  return s.charCodeAt(i);
}


/* No side effect */

/* No side effect */

/* No side effect */

function failwith(s) {
  throw [
        failure,
        s
      ];
}

var Exit = create("Pervasives.Exit");

var min_int$3 = -2147483648;

function $at(l1, l2) {
  if (l1) {
    return /* :: */[
            l1[0],
            $at(l1[1], l2)
          ];
  } else {
    return l2;
  }
}


/* No side effect */

function string(str) {
  return caml_md5_string(str, 0, str.length);
}


/* No side effect */

/* No side effect */

function full_init(s, seed) {
  var combine = function (accu, x) {
    return string(accu + String(x));
  };
  var extract = function (d) {
    return ((get$1(d, 0) + (get$1(d, 1) << 8) | 0) + (get$1(d, 2) << 16) | 0) + (get$1(d, 3) << 24) | 0;
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
    throw [
          invalid_argument,
          "Random.int"
        ];
  }
  while(true) {
    var r = bits(s);
    var v = r % bound;
    if ((r - v | 0) <= ((1073741823 - bound | 0) + 1 | 0)) {
      return v;
    }
    continue ;
  }
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

function full_init$1(seed) {
  return full_init($$default, seed);
}

function self_init(param) {
  return full_init$1(caml_sys_random_seed(undefined));
}


/* No side effect */

function render_bbox(sprite, param) {
  var context = sprite.context;
  var match = sprite.params.bbox_offset;
  var match$1 = sprite.params.bbox_size;
  context.strokeStyle = "#FF0000";
  return context.strokeRect(param[0] + match[0], param[1] + match[1], match$1[0], match$1[1]);
}

function render(sprite, param) {
  var context = sprite.context;
  var match = sprite.params.src_offset;
  var match$1 = sprite.params.frame_size;
  var sw = match$1[0];
  var match$2 = sprite.params.frame_size;
  var sx = match[0] + sprite.frame.contents * sw;
  return context.drawImage(sprite.img, sx, match[1], sw, match$1[1], param[0], param[1], match$2[0], match$2[1]);
}

function draw_bgd(bgd, off_x) {
  render(bgd, /* tuple */[
        -off_x,
        0
      ]);
  return render(bgd, /* tuple */[
              bgd.params.frame_size[0] - off_x,
              0
            ]);
}

function clear_canvas(canvas) {
  var context = canvas.getContext("2d");
  var cwidth = canvas.width;
  var cheight = canvas.height;
  return context.clearRect(0, 0, cwidth, cheight);
}

function hud(canvas, score, coins) {
  var score_string = String(score);
  var coin_string = String(coins);
  var context = canvas.getContext("2d");
  context.font = "10px 'Press Start 2P'";
  context.fillText("Score: " + score_string, canvas.width - 140, 18);
  return context.fillText("Coins: " + coin_string, 120, 18);
}

function fps(canvas, fps_val) {
  var fps_str = String(fps_val | 0);
  var context = canvas.getContext("2d");
  return context.fillText(fps_str, 10, 18);
}

function gameWon(ctx) {
  ctx.rect(0, 0, 512, 512);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P'";
  return ctx.fillText("You win!", 180, 128);
}

function gameLost(ctx, elapsed) {
  ctx.rect(0, 0, 512, 512);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "20px 'Press Start 2P'";
  ctx.fillText("GAME OVER. You lose! ", 60, 128);
  return ctx.fillText(String(elapsed), 230, 200);
}


/* No side effect */

function setup_sprite(bbox_offsetOpt, bbox_sizeOpt, img_src, max_frames, max_ticks, frame_size, src_offset) {
  var bbox_offset = bbox_offsetOpt !== undefined ? bbox_offsetOpt : /* tuple */[
      0,
      0
    ];
  var bbox_size = bbox_sizeOpt !== undefined ? bbox_sizeOpt : /* tuple */[
      0,
      0
    ];
  var bbox_size$1 = caml_equal(bbox_size, /* tuple */[
        0,
        0
      ]) ? frame_size : bbox_size;
  var img_src$1 = "./sprites/" + img_src;
  return {
          max_frames: max_frames,
          max_ticks: max_ticks,
          img_src: img_src$1,
          frame_size: frame_size,
          src_offset: src_offset,
          bbox_offset: bbox_offset,
          bbox_size: bbox_size$1
        };
}

function make_enemy(param) {
  var dir = param[1];
  switch (param[0]) {
    case /* Goomba */0 :
        return setup_sprite(/* tuple */[
                    1,
                    1
                  ], /* tuple */[
                    14,
                    14
                  ], "enemies.png", 2, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    128
                  ]);
    case /* GKoopa */1 :
        if (dir) {
          return setup_sprite(/* tuple */[
                      1,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      32,
                      69
                    ]);
        } else {
          return setup_sprite(/* tuple */[
                      4,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      0,
                      69
                    ]);
        }
    case /* RKoopa */2 :
        if (dir) {
          return setup_sprite(/* tuple */[
                      1,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      32,
                      5
                    ]);
        } else {
          return setup_sprite(/* tuple */[
                      4,
                      10
                    ], /* tuple */[
                      11,
                      16
                    ], "enemies.png", 2, 10, /* tuple */[
                      16,
                      27
                    ], /* tuple */[
                      0,
                      5
                    ]);
        }
    case /* GKoopaShell */3 :
        return setup_sprite(/* tuple */[
                    2,
                    2
                  ], /* tuple */[
                    12,
                    13
                  ], "enemies.png", 4, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    96
                  ]);
    case /* RKoopaShell */4 :
        return setup_sprite(/* tuple */[
                    2,
                    2
                  ], /* tuple */[
                    12,
                    13
                  ], "enemies.png", 4, 10, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    32
                  ]);
    
  }
}

function make_particle(param) {
  switch (param) {
    case /* GoombaSquish */0 :
        return setup_sprite(undefined, undefined, "enemies.png", 1, 0, /* tuple */[
                    16,
                    16
                  ], /* tuple */[
                    0,
                    144
                  ]);
    case /* BrickChunkL */1 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, /* tuple */[
                    8,
                    8
                  ], /* tuple */[
                    0,
                    0
                  ]);
    case /* BrickChunkR */2 :
        return setup_sprite(undefined, undefined, "chunks.png", 1, 0, /* tuple */[
                    8,
                    8
                  ], /* tuple */[
                    8,
                    0
                  ]);
    case /* Score100 */3 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    8
                  ], /* tuple */[
                    0,
                    0
                  ]);
    case /* Score200 */4 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    9
                  ]);
    case /* Score400 */5 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    18
                  ]);
    case /* Score800 */6 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    12,
                    9
                  ], /* tuple */[
                    0,
                    27
                  ]);
    case /* Score1000 */7 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    0
                  ]);
    case /* Score2000 */8 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    9
                  ]);
    case /* Score4000 */9 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    18
                  ]);
    case /* Score8000 */10 :
        return setup_sprite(undefined, undefined, "score.png", 1, 0, /* tuple */[
                    14,
                    9
                  ], /* tuple */[
                    13,
                    27
                  ]);
    
  }
}

function make_type$1(typ, dir) {
  switch (typ.tag | 0) {
    case /* SPlayer */0 :
        var pt = typ[0];
        var spr_type = /* tuple */[
          typ[1],
          dir
        ];
        if (pt) {
          var typ$1 = spr_type[0];
          if (spr_type[1]) {
            switch (typ$1) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              1,
                              1
                            ], /* tuple */[
                              11,
                              15
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              32
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              15
                            ], "mario-small.png", 2, 10, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              48
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              15
                            ], "mario-small.png", 3, 5, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              32
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              1,
                              5
                            ], /* tuple */[
                              14,
                              10
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              64
                            ]);
              
            }
          } else {
            switch (typ$1) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              3,
                              1
                            ], /* tuple */[
                              11,
                              15
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              0
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              15
                            ], "mario-small.png", 2, 10, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              16
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              15
                            ], "mario-small.png", 3, 5, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              16,
                              0
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              1,
                              5
                            ], /* tuple */[
                              14,
                              10
                            ], "mario-small.png", 1, 0, /* tuple */[
                              16,
                              16
                            ], /* tuple */[
                              0,
                              64
                            ]);
              
            }
          }
        } else {
          var typ$2 = spr_type[0];
          if (spr_type[1]) {
            switch (typ$2) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              1,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              16,
                              69
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              48,
                              70
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 4, 10, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              0,
                              101
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              2,
                              10
                            ], /* tuple */[
                              13,
                              17
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              32,
                              69
                            ]);
              
            }
          } else {
            switch (typ$2) {
              case /* Standing */0 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              16,
                              5
                            ]);
              case /* Jumping */1 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              12,
                              25
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              26
                            ], /* tuple */[
                              48,
                              6
                            ]);
              case /* Running */2 :
                  return setup_sprite(/* tuple */[
                              2,
                              1
                            ], /* tuple */[
                              13,
                              25
                            ], "mario-big.png", 4, 10, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              0,
                              37
                            ]);
              case /* Crouching */3 :
                  return setup_sprite(/* tuple */[
                              2,
                              10
                            ], /* tuple */[
                              13,
                              17
                            ], "mario-big.png", 1, 0, /* tuple */[
                              16,
                              27
                            ], /* tuple */[
                              32,
                              5
                            ]);
              
            }
          }
        }
    case /* SEnemy */1 :
        return make_enemy(/* tuple */[
                    typ[0],
                    dir
                  ]);
    case /* SItem */2 :
        var param = typ[0];
        if (param) {
          return setup_sprite(/* tuple */[
                      3,
                      0
                    ], /* tuple */[
                      12,
                      16
                    ], "items.png", 3, 15, /* tuple */[
                      16,
                      16
                    ], /* tuple */[
                      0,
                      80
                    ]);
        } else {
          return setup_sprite(/* tuple */[
                      2,
                      0
                    ], /* tuple */[
                      12,
                      16
                    ], "items.png", 1, 0, /* tuple */[
                      16,
                      16
                    ], /* tuple */[
                      0,
                      0
                    ]);
        }
    case /* SBlock */3 :
        var param$1 = typ[0];
        if (typeof param$1 !== "number") {
          return setup_sprite(undefined, undefined, "blocks.png", 4, 15, /* tuple */[
                      16,
                      16
                    ], /* tuple */[
                      0,
                      16
                    ]);
        }
        switch (param$1) {
          case /* QBlockUsed */0 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          32
                        ]);
          case /* Brick */1 :
              return setup_sprite(undefined, undefined, "blocks.png", 5, 10, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          0
                        ]);
          case /* UnBBlock */2 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          48
                        ]);
          case /* Cloud */3 :
              return setup_sprite(undefined, undefined, "blocks.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          64
                        ]);
          case /* Panel */4 :
              return setup_sprite(undefined, undefined, "panel.png", 3, 15, /* tuple */[
                          26,
                          26
                        ], /* tuple */[
                          0,
                          0
                        ]);
          case /* Ground */5 :
              return setup_sprite(undefined, undefined, "ground.png", 1, 0, /* tuple */[
                          16,
                          16
                        ], /* tuple */[
                          0,
                          32
                        ]);
          
        }
    
  }
}

function make_from_params(params, context) {
  var img = document.createElement("img");
  img.src = params.img_src;
  return {
          params: params,
          context: context,
          frame: {
            contents: 0
          },
          ticks: {
            contents: 0
          },
          img: img
        };
}

function make$4(spawn, dir, context) {
  var params = make_type$1(spawn, dir);
  return make_from_params(params, context);
}

function make_bgd(context) {
  var params = setup_sprite(undefined, undefined, "bgd-1.png", 1, 0, /* tuple */[
        512,
        256
      ], /* tuple */[
        0,
        0
      ]);
  return make_from_params(params, context);
}

function make_particle$1(ptyp, context) {
  var params = make_particle(ptyp);
  return make_from_params(params, context);
}

function transform_enemy(enemy_typ, spr, dir) {
  var params = make_enemy(/* tuple */[
        enemy_typ,
        dir
      ]);
  var img = document.createElement("img");
  img.src = params.img_src;
  spr.params = params;
  spr.img = img;
  
}

function update_animation(spr) {
  var curr_ticks = spr.ticks.contents;
  if (curr_ticks >= spr.params.max_ticks) {
    spr.ticks.contents = 0;
    spr.frame.contents = mod_(spr.frame.contents + 1 | 0, spr.params.max_frames);
    return ;
  } else {
    spr.ticks.contents = curr_ticks + 1 | 0;
    return ;
  }
}


/* No side effect */

function pair_to_xy(pair) {
  return {
          x: pair[0],
          y: pair[1]
        };
}

function make_type$2(typ, ctx) {
  if (typ === 2 || typ === 1) {
    return {
            sprite: make_particle$1(typ, ctx),
            lifetime: 300
          };
  } else {
    return {
            sprite: make_particle$1(typ, ctx),
            lifetime: 30
          };
  }
}

function make$5(velOpt, accOpt, part_type, pos, ctx) {
  var vel = velOpt !== undefined ? velOpt : /* tuple */[
      0,
      0
    ];
  var acc = accOpt !== undefined ? accOpt : /* tuple */[
      0,
      0
    ];
  var params = make_type$2(part_type, ctx);
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

function make_score(score, pos, ctx) {
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
  return make$5(/* tuple */[
              0.5,
              -0.7
            ], undefined, t, pos, ctx);
}

function update_vel$1(part) {
  part.vel.x = part.vel.x + part.acc.x;
  part.vel.y = part.vel.y + part.acc.y;
  
}

function $$process(part) {
  part.life = part.life - 1 | 0;
  if (part.life === 0) {
    part.kill = true;
  }
  update_vel$1(part);
  part.pos.x = part.vel.x + part.pos.x;
  part.pos.y = part.vel.y + part.pos.y;
  
}


/* No side effect */

/* No side effect */

/* No side effect */

function forEachU$1(a, f) {
  for(var i = 0 ,i_finish = a.length; i < i_finish; ++i){
    f(a[i]);
  }
  
}


/* No side effect */

/* No side effect */

function copyAuxCont(_cellX, _prec) {
  while(true) {
    var prec = _prec;
    var cellX = _cellX;
    if (!cellX) {
      return prec;
    }
    var next = /* :: */[
      cellX[0],
      /* [] */0
    ];
    prec[1] = next;
    _prec = next;
    _cellX = cellX[1];
    continue ;
  }
}

function copyAuxWitFilter(f, _cellX, _prec) {
  while(true) {
    var prec = _prec;
    var cellX = _cellX;
    if (!cellX) {
      return ;
    }
    var t = cellX[1];
    var h = cellX[0];
    if (f(h)) {
      var next = /* :: */[
        h,
        /* [] */0
      ];
      prec[1] = next;
      _prec = next;
      _cellX = t;
      continue ;
    }
    _cellX = t;
    continue ;
  }
}

function concat$3(xs, ys) {
  if (!xs) {
    return ys;
  }
  var cell = /* :: */[
    xs[0],
    /* [] */0
  ];
  copyAuxCont(xs[1], cell)[1] = ys;
  return cell;
}

function forEachU(_xs, f) {
  while(true) {
    var xs = _xs;
    if (!xs) {
      return ;
    }
    f(xs[0]);
    _xs = xs[1];
    continue ;
  }
}

function forEach(xs, f) {
  return forEachU(xs, __1(f));
}

function reduceU(_l, _accu, f) {
  while(true) {
    var accu = _accu;
    var l = _l;
    if (!l) {
      return accu;
    }
    _accu = f(accu, l[0]);
    _l = l[1];
    continue ;
  }
}

function reduce(l, accu, f) {
  return reduceU(l, accu, __2(f));
}

function keepU(_xs, p) {
  while(true) {
    var xs = _xs;
    if (!xs) {
      return /* [] */0;
    }
    var t = xs[1];
    var h = xs[0];
    if (p(h)) {
      var cell = /* :: */[
        h,
        /* [] */0
      ];
      copyAuxWitFilter(p, t, cell);
      return cell;
    }
    _xs = t;
    continue ;
  }
}

function keep(xs, p) {
  return keepU(xs, __1(p));
}


/* No side effect */

var id_counter = {
  contents: min_int$3
};

function setup_obj(has_gravityOpt, speedOpt, param) {
  var has_gravity = has_gravityOpt !== undefined ? has_gravityOpt : true;
  var speed = speedOpt !== undefined ? speedOpt : 1;
  return {
          has_gravity: has_gravity,
          speed: speed
        };
}

function set_vel_to_speed(obj) {
  var speed = obj.params.speed;
  var match = obj.dir;
  if (match) {
    obj.vel.x = speed;
    return ;
  } else {
    obj.vel.x = -speed;
    return ;
  }
}

function make_type(t) {
  switch (t.tag | 0) {
    case /* SPlayer */0 :
        return setup_obj(undefined, 2.8, undefined);
    case /* SEnemy */1 :
        var param = t[0];
        if (param >= 3) {
          return setup_obj(undefined, 3, undefined);
        } else {
          return setup_obj(undefined, undefined, undefined);
        }
    case /* SItem */2 :
        var param$1 = t[0];
        if (param$1) {
          return setup_obj(false, undefined, undefined);
        } else {
          return setup_obj(undefined, undefined, undefined);
        }
    case /* SBlock */3 :
        return setup_obj(false, undefined, undefined);
    
  }
}

function new_id(param) {
  id_counter.contents = id_counter.contents + 1 | 0;
  return id_counter.contents;
}

function make$3(dirOpt, spawnable, context, pos) {
  var dir = dirOpt !== undefined ? dirOpt : /* Left */0;
  var spr = make$4(spawnable, dir, context);
  var params = make_type(spawnable);
  var id = new_id(undefined);
  var obj = {
    params: params,
    pos: pos,
    vel: {
      x: 0.0,
      y: 0.0
    },
    id: id,
    jumping: false,
    grounded: false,
    dir: dir,
    invuln: 0,
    kill: false,
    health: 1,
    crouch: false,
    score: 0
  };
  return /* tuple */[
          spr,
          obj
        ];
}

function spawn(spawnable, context, pos) {
  var match = make$3(undefined, spawnable, context, pos);
  var obj = match[1];
  var spr = match[0];
  switch (spawnable.tag | 0) {
    case /* SPlayer */0 :
        return /* Player */__(0, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SEnemy */1 :
        set_vel_to_speed(obj);
        return /* Enemy */__(1, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SItem */2 :
        return /* Item */__(2, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    case /* SBlock */3 :
        return /* Block */__(3, [
                  spawnable[0],
                  spr,
                  obj
                ]);
    
  }
}

function get_sprite(param) {
  return param[1];
}

function get_obj(param) {
  return param[2];
}

function is_player(param) {
  if (param.tag) {
    return false;
  } else {
    return true;
  }
}

function is_enemy(param) {
  if (param.tag === /* Enemy */1) {
    return true;
  } else {
    return false;
  }
}

function equals(col1, col2) {
  return col1[2].id === col2[2].id;
}

function normalize_pos(pos, p1, p2) {
  var match = p1.bbox_offset;
  var match$1 = p2.bbox_offset;
  var match$2 = p1.bbox_size;
  var match$3 = p2.bbox_size;
  pos.x = pos.x - (match$3[0] + match$1[0]) + (match$2[0] + match[0]);
  pos.y = pos.y - (match$3[1] + match$1[1]) + (match$2[1] + match[1]);
  
}

function update_player(player, keys, context) {
  var prev_jumping = player.jumping;
  var prev_dir = player.dir;
  var prev_vx = Math.abs(player.vel.x);
  forEach(keys, (function (param) {
          var lr_acc = player.vel.x * 0.2;
          switch (param) {
            case /* CLeft */0 :
                if (!player.crouch) {
                  if (player.vel.x > -player.params.speed) {
                    player.vel.x = player.vel.x - (0.4 - lr_acc);
                  }
                  player.dir = /* Left */0;
                  return ;
                } else {
                  return ;
                }
            case /* CRight */1 :
                if (!player.crouch) {
                  if (player.vel.x < player.params.speed) {
                    player.vel.x = player.vel.x + (0.4 + lr_acc);
                  }
                  player.dir = /* Right */1;
                  return ;
                } else {
                  return ;
                }
            case /* CUp */2 :
                if (!player.jumping && player.grounded) {
                  player.jumping = true;
                  player.grounded = false;
                  player.vel.y = caml_float_max(player.vel.y - (5.7 + Math.abs(player.vel.x) * 0.25), -6);
                  return ;
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
        }));
  var v = player.vel.x * 0.9;
  var vel_damped = Math.abs(v) < 0.1 ? 0 : v;
  player.vel.x = vel_damped;
  var pl_typ = player.health <= 1 ? /* SmallM */1 : /* BigM */0;
  if (!prev_jumping && player.jumping) {
    return /* tuple */[
            pl_typ,
            make$4(/* SPlayer */__(0, [
                    pl_typ,
                    /* Jumping */1
                  ]), player.dir, context)
          ];
  } else if (prev_dir !== player.dir || prev_vx === 0 && Math.abs(player.vel.x) > 0 && !player.jumping) {
    return /* tuple */[
            pl_typ,
            make$4(/* SPlayer */__(0, [
                    pl_typ,
                    /* Running */2
                  ]), player.dir, context)
          ];
  } else if (prev_dir !== player.dir && player.jumping && prev_jumping) {
    return /* tuple */[
            pl_typ,
            make$4(/* SPlayer */__(0, [
                    pl_typ,
                    /* Jumping */1
                  ]), player.dir, context)
          ];
  } else if (player.vel.y === 0 && player.crouch) {
    return /* tuple */[
            pl_typ,
            make$4(/* SPlayer */__(0, [
                    pl_typ,
                    /* Crouching */3
                  ]), player.dir, context)
          ];
  } else if (player.vel.y === 0 && player.vel.x === 0) {
    return /* tuple */[
            pl_typ,
            make$4(/* SPlayer */__(0, [
                    pl_typ,
                    /* Standing */0
                  ]), player.dir, context)
          ];
  } else {
    return ;
  }
}

function update_vel(obj) {
  if (obj.grounded) {
    obj.vel.y = 0;
    return ;
  } else if (obj.params.has_gravity) {
    obj.vel.y = caml_float_min(obj.vel.y + 0.2 + Math.abs(obj.vel.y) * 0.01, 4.5);
    return ;
  } else {
    return ;
  }
}

function update_pos(obj) {
  obj.pos.x = obj.vel.x + obj.pos.x;
  if (obj.params.has_gravity) {
    obj.pos.y = obj.vel.y + obj.pos.y;
    return ;
  }
  
}

function process_obj(obj, mapy) {
  update_vel(obj);
  update_pos(obj);
  if (obj.pos.y > mapy) {
    obj.kill = true;
    return ;
  }
  
}

function collide_block(dir, obj) {
  if (dir !== 1) {
    if (dir !== 0) {
      obj.vel.x = 0;
      return ;
    } else {
      obj.vel.y = -0.001;
      return ;
    }
  } else {
    obj.vel.y = 0;
    obj.grounded = true;
    obj.jumping = false;
    return ;
  }
}

function reverse_left_right(obj) {
  obj.vel.x = -obj.vel.x;
  obj.dir = obj.dir ? /* Left */0 : /* Right */1;
  
}

function evolve_enemy(player_dir, typ, spr, obj, context) {
  switch (typ) {
    case /* Goomba */0 :
        obj.kill = true;
        return ;
    case /* GKoopa */1 :
        var match = make$3(obj.dir, /* SEnemy */__(1, [/* GKoopaShell */3]), context, obj.pos);
        var new_obj = match[1];
        var new_spr = match[0];
        normalize_pos(new_obj.pos, spr.params, new_spr.params);
        return /* Enemy */__(1, [
                  /* GKoopaShell */3,
                  new_spr,
                  new_obj
                ]);
    case /* RKoopa */2 :
        var match$1 = make$3(obj.dir, /* SEnemy */__(1, [/* RKoopaShell */4]), context, obj.pos);
        var new_obj$1 = match$1[1];
        var new_spr$1 = match$1[0];
        normalize_pos(new_obj$1.pos, spr.params, new_spr$1.params);
        return /* Enemy */__(1, [
                  /* RKoopaShell */4,
                  new_spr$1,
                  new_obj$1
                ]);
    case /* GKoopaShell */3 :
    case /* RKoopaShell */4 :
        break;
    
  }
  obj.dir = player_dir;
  if (obj.vel.x !== 0) {
    obj.vel.x = 0;
  } else {
    set_vel_to_speed(obj);
  }
  
}

function rev_dir(o, t, s) {
  reverse_left_right(o);
  var old_params = s.params;
  transform_enemy(t, s, o.dir);
  return normalize_pos(o.pos, old_params, s.params);
}

function dec_health(obj) {
  var health = obj.health - 1 | 0;
  if (health === 0) {
    obj.kill = true;
    return ;
  } else if (obj.invuln === 0) {
    obj.health = health;
    return ;
  } else {
    return ;
  }
}

function evolve_block(obj, context) {
  dec_health(obj);
  var match = make$3(undefined, /* SBlock */__(3, [/* QBlockUsed */0]), context, obj.pos);
  return /* Block */__(3, [
            /* QBlockUsed */0,
            match[0],
            match[1]
          ]);
}

function spawn_above(player_dir, obj, typ, context) {
  var item = spawn(/* SItem */__(2, [typ]), context, obj.pos);
  var item_obj = item[2];
  item_obj.pos.y = item_obj.pos.y - item[1].params.frame_size[1];
  item_obj.dir = player_dir ? /* Left */0 : /* Right */1;
  set_vel_to_speed(item_obj);
  return item;
}

function get_aabb(obj) {
  var spr = obj[1].params;
  var obj$1 = obj[2];
  var match = spr.bbox_offset;
  var box = obj$1.pos.x + match[0];
  var boy = obj$1.pos.y + match[1];
  var match$1 = spr.bbox_size;
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

function col_bypass(c1, c2) {
  var o1 = c1[2];
  var o2 = c2[2];
  var ctypes;
  switch (c1.tag | 0) {
    case /* Player */0 :
        ctypes = c2.tag === /* Enemy */1 ? c1[2].invuln > 0 : false;
        break;
    case /* Enemy */1 :
        ctypes = c2.tag === /* Item */2 ? true : false;
        break;
    case /* Item */2 :
        switch (c2.tag | 0) {
          case /* Enemy */1 :
          case /* Item */2 :
              ctypes = true;
              break;
          case /* Player */0 :
          case /* Block */3 :
              ctypes = false;
              break;
          
        }
        break;
    case /* Block */3 :
        ctypes = false;
        break;
    
  }
  if (o1.kill || o2.kill) {
    return true;
  } else {
    return ctypes;
  }
}

function check_collision(c1, c2) {
  var b1 = get_aabb(c1);
  var b2 = get_aabb(c2);
  var o1 = c1[2];
  if (col_bypass(c1, c2)) {
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
  if (ox >= oy) {
    if (vy > 0) {
      o1.pos.y = o1.pos.y + oy;
      return /* North */0;
    } else {
      o1.pos.y = o1.pos.y - oy;
      return /* South */1;
    }
  } else if (vx > 0) {
    o1.pos.x = o1.pos.x + ox;
    return /* West */3;
  } else {
    o1.pos.x = o1.pos.x - ox;
    return /* East */2;
  }
}

function kill(collid, ctx) {
  switch (collid.tag | 0) {
    case /* Player */0 :
        return /* [] */0;
    case /* Enemy */1 :
        var o = collid[2];
        var pos_000 = o.pos.x;
        var pos_001 = o.pos.y;
        var pos = /* tuple */[
          pos_000,
          pos_001
        ];
        var score = o.score > 0 ? /* :: */[
            make_score(o.score, pos, ctx),
            /* [] */0
          ] : /* [] */0;
        var remains = collid[0] !== 0 ? /* [] */0 : /* :: */[
            make$5(undefined, undefined, /* GoombaSquish */0, pos, ctx),
            /* [] */0
          ];
        return $at(score, remains);
    case /* Item */2 :
        var o$1 = collid[2];
        if (collid[0]) {
          return /* [] */0;
        } else {
          return /* :: */[
                  make_score(o$1.score, /* tuple */[
                        o$1.pos.x,
                        o$1.pos.y
                      ], ctx),
                  /* [] */0
                ];
        }
    case /* Block */3 :
        var o$2 = collid[2];
        var t = collid[0];
        if (typeof t !== "number") {
          return /* [] */0;
        }
        if (t !== 1) {
          return /* [] */0;
        }
        var pos_000$1 = o$2.pos.x;
        var pos_001$1 = o$2.pos.y;
        var pos$1 = /* tuple */[
          pos_000$1,
          pos_001$1
        ];
        var p1 = make$5(/* tuple */[
              -5,
              -5
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkL */1, pos$1, ctx);
        var p2 = make$5(/* tuple */[
              -3,
              -4
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkL */1, pos$1, ctx);
        var p3 = make$5(/* tuple */[
              3,
              -4
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkR */2, pos$1, ctx);
        var p4 = make$5(/* tuple */[
              5,
              -5
            ], /* tuple */[
              0,
              0.2
            ], /* BrickChunkR */2, pos$1, ctx);
        return /* :: */[
                p1,
                /* :: */[
                  p2,
                  /* :: */[
                    p3,
                    /* :: */[
                      p4,
                      /* [] */0
                    ]
                  ]
                ]
              ];
    
  }
}

var invuln = 60;

var dampen_jump = 4;


/* No side effect */

function getPos(param) {
  return param.pos;
}

function make$8(param, param$1) {
  return {
          pos: {
            x: 0,
            y: 0
          },
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

function calc_viewport_point(cc, vc, mc) {
  var vc_half = vc / 2;
  return caml_float_min(caml_float_max(cc - vc_half, 0), caml_float_min(mc - vc, Math.abs(cc - vc_half)));
}

function in_viewport(v, pos) {
  var v_min_x = v.pos.x - 32;
  var v_max_x = v.pos.x + v.v_dim.x;
  var v_min_y = v.pos.y - 32;
  var v_max_y = v.pos.y + v.v_dim.y;
  var x = pos.x;
  var y = pos.y;
  if (x >= v_min_x && x <= v_max_x && y >= v_min_y) {
    return y <= v_max_y;
  } else {
    return false;
  }
}

function out_of_viewport_below(v, y) {
  var v_max_y = v.pos.y + v.v_dim.y;
  return y >= v_max_y;
}

function coord_to_viewport(viewport, coord) {
  return {
          x: coord.x - viewport.pos.x,
          y: coord.y - viewport.pos.y
        };
}

function update(vpt, ctr) {
  var new_x = calc_viewport_point(ctr.x, vpt.v_dim.x, vpt.m_dim.x);
  var new_y = calc_viewport_point(ctr.y, vpt.v_dim.y, vpt.m_dim.y);
  var pos = {
    x: new_x,
    y: new_y
  };
  return {
          pos: pos,
          v_dim: vpt.v_dim,
          m_dim: vpt.m_dim
        };
}


/* No side effect */

function mem_loc(checkloc, _loclist) {
  while(true) {
    var loclist = _loclist;
    if (!loclist) {
      return false;
    }
    if (caml_equal(checkloc, loclist[0][1])) {
      return true;
    }
    _loclist = loclist[1];
    continue ;
  }
}

function convert_list(lst) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  return $at(/* :: */[
              /* tuple */[
                h[0],
                {
                  x: h[1].x * 16,
                  y: h[1].y * 16
                }
              ],
              /* [] */0
            ], convert_list(lst[1]));
}

function choose_enemy_typ(typ) {
  switch (typ) {
    case 0 :
        return /* RKoopa */2;
    case 1 :
        return /* GKoopa */1;
    case 2 :
        return /* Goomba */0;
    default:
      return failwith("Shouldn't reach here");
  }
}

function choose_sblock_typ(typ) {
  switch (typ) {
    case 0 :
        return /* Brick */1;
    case 1 :
        return /* UnBBlock */2;
    case 2 :
        return /* Cloud */3;
    case 3 :
        return /* QBlock */[/* Mushroom */0];
    case 4 :
        return /* Ground */5;
    default:
      return failwith("Shouldn't reach here");
  }
}

function avoid_overlap(_lst, currentLst) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst[1];
    var h = lst[0];
    if (!mem_loc(h[1], currentLst)) {
      return $at(/* :: */[
                  h,
                  /* [] */0
                ], avoid_overlap(t, currentLst));
    }
    _lst = t;
    continue ;
  }
}

function trim_edges(_lst, blockw, blockh) {
  while(true) {
    var lst = _lst;
    if (!lst) {
      return /* [] */0;
    }
    var t = lst[1];
    var h = lst[0];
    var cx = h[1].x;
    var cy = h[1].y;
    var pixx = blockw * 16;
    var pixy = blockh * 16;
    if (!(cx < 128 || pixx - cx < 528 || cy === 0 || pixy - cy < 48)) {
      return $at(/* :: */[
                  h,
                  /* [] */0
                ], trim_edges(t, blockw, blockh));
    }
    _lst = t;
    continue ;
  }
}

function generate_ground_stairs(cbx, cby, typ) {
  var four_000 = /* tuple */[
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var four_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    /* :: */[
      /* tuple */[
        typ,
        {
          x: cbx + 2,
          y: cby
        }
      ],
      /* :: */[
        /* tuple */[
          typ,
          {
            x: cbx + 3,
            y: cby
          }
        ],
        /* [] */0
      ]
    ]
  ];
  var four = /* :: */[
    four_000,
    four_001
  ];
  var three_000 = /* tuple */[
    typ,
    {
      x: cbx + 1,
      y: cby - 1
    }
  ];
  var three_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 2,
        y: cby - 1
      }
    ],
    /* :: */[
      /* tuple */[
        typ,
        {
          x: cbx + 3,
          y: cby - 1
        }
      ],
      /* [] */0
    ]
  ];
  var three = /* :: */[
    three_000,
    three_001
  ];
  var two_000 = /* tuple */[
    typ,
    {
      x: cbx + 2,
      y: cby - 2
    }
  ];
  var two_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 3,
        y: cby - 2
      }
    ],
    /* [] */0
  ];
  var two = /* :: */[
    two_000,
    two_001
  ];
  var one_000 = /* tuple */[
    typ,
    {
      x: cbx + 3,
      y: cby - 3
    }
  ];
  var one = /* :: */[
    one_000,
    /* [] */0
  ];
  return $at(four, $at(three, $at(two, one)));
}

function generate_airup_stairs(cbx, cby, typ) {
  var one_000 = /* tuple */[
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var one_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    /* [] */0
  ];
  var one = /* :: */[
    one_000,
    one_001
  ];
  var two_000 = /* tuple */[
    typ,
    {
      x: cbx + 3,
      y: cby - 1
    }
  ];
  var two_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 4,
        y: cby - 1
      }
    ],
    /* [] */0
  ];
  var two = /* :: */[
    two_000,
    two_001
  ];
  var three_000 = /* tuple */[
    typ,
    {
      x: cbx + 4,
      y: cby - 2
    }
  ];
  var three_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 5,
        y: cby - 2
      }
    ],
    /* :: */[
      /* tuple */[
        typ,
        {
          x: cbx + 6,
          y: cby - 2
        }
      ],
      /* [] */0
    ]
  ];
  var three = /* :: */[
    three_000,
    three_001
  ];
  return $at(one, $at(two, three));
}

function generate_airdown_stairs(cbx, cby, typ) {
  var three_000 = /* tuple */[
    typ,
    {
      x: cbx,
      y: cby
    }
  ];
  var three_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 1,
        y: cby
      }
    ],
    /* :: */[
      /* tuple */[
        typ,
        {
          x: cbx + 2,
          y: cby
        }
      ],
      /* [] */0
    ]
  ];
  var three = /* :: */[
    three_000,
    three_001
  ];
  var two_000 = /* tuple */[
    typ,
    {
      x: cbx + 2,
      y: cby + 1
    }
  ];
  var two_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 3,
        y: cby + 1
      }
    ],
    /* [] */0
  ];
  var two = /* :: */[
    two_000,
    two_001
  ];
  var one_000 = /* tuple */[
    typ,
    {
      x: cbx + 5,
      y: cby + 2
    }
  ];
  var one_001 = /* :: */[
    /* tuple */[
      typ,
      {
        x: cbx + 6,
        y: cby + 2
      }
    ],
    /* [] */0
  ];
  var one = /* :: */[
    one_000,
    one_001
  ];
  return $at(three, $at(two, one));
}

function generate_clouds(cbx, cby, typ, num) {
  if (num === 0) {
    return /* [] */0;
  } else {
    return $at(/* :: */[
                /* tuple */[
                  typ,
                  {
                    x: cbx,
                    y: cby
                  }
                ],
                /* [] */0
              ], generate_clouds(cbx + 1, cby, typ, num - 1 | 0));
  }
}

function generate_coins(_block_coord) {
  while(true) {
    var block_coord = _block_coord;
    var place_coin = $$int$1(2);
    if (!block_coord) {
      return /* [] */0;
    }
    var t = block_coord[1];
    var h = block_coord[0];
    if (place_coin === 0) {
      var xc = h[1].x;
      var yc = h[1].y;
      return $at(/* :: */[
                  /* tuple */[
                    0,
                    {
                      x: xc,
                      y: yc - 16
                    }
                  ],
                  /* [] */0
                ], generate_coins(t));
    }
    _block_coord = t;
    continue ;
  }
}

function choose_block_pattern(blockw, blockh, cbx, cby, prob) {
  if (cbx > blockw || cby > blockh) {
    return /* [] */0;
  }
  var block_typ = $$int$1(4);
  var stair_typ = $$int$1(2);
  var life_block_chance = $$int$1(5);
  var middle_block = life_block_chance === 0 ? 3 : stair_typ;
  switch (prob) {
    case 0 :
        if (blockw - cbx > 2) {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* :: */[
                    /* tuple */[
                      middle_block,
                      {
                        x: cbx + 1,
                        y: cby
                      }
                    ],
                    /* :: */[
                      /* tuple */[
                        stair_typ,
                        {
                          x: cbx + 2,
                          y: cby
                        }
                      ],
                      /* [] */0
                    ]
                  ]
                ];
        } else if (blockw - cbx > 1) {
          return /* :: */[
                  /* tuple */[
                    block_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* :: */[
                    /* tuple */[
                      block_typ,
                      {
                        x: cbx + 1,
                        y: cby
                      }
                    ],
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  /* tuple */[
                    block_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* [] */0
                ];
        }
    case 1 :
        var num_clouds = $$int$1(5) + 5 | 0;
        if (cby < 5) {
          return generate_clouds(cbx, cby, 2, num_clouds);
        } else {
          return /* [] */0;
        }
    case 2 :
        if (blockh - cby === 1) {
          return generate_ground_stairs(cbx, cby, stair_typ);
        } else {
          return /* [] */0;
        }
    case 3 :
        if (stair_typ === 0 && blockh - cby > 3) {
          return generate_airdown_stairs(cbx, cby, stair_typ);
        } else if (blockh - cby > 2) {
          return generate_airup_stairs(cbx, cby, stair_typ);
        } else {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* [] */0
                ];
        }
    case 4 :
        if (cby + 3 - blockh === 2) {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* [] */0
                ];
        } else if (cby + 3 - blockh === 1) {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* :: */[
                    /* tuple */[
                      stair_typ,
                      {
                        x: cbx,
                        y: cby + 1
                      }
                    ],
                    /* [] */0
                  ]
                ];
        } else {
          return /* :: */[
                  /* tuple */[
                    stair_typ,
                    {
                      x: cbx,
                      y: cby
                    }
                  ],
                  /* :: */[
                    /* tuple */[
                      stair_typ,
                      {
                        x: cbx,
                        y: cby + 1
                      }
                    ],
                    /* :: */[
                      /* tuple */[
                        stair_typ,
                        {
                          x: cbx,
                          y: cby + 2
                        }
                      ],
                      /* [] */0
                    ]
                  ]
                ];
        }
    case 5 :
        return /* :: */[
                /* tuple */[
                  3,
                  {
                    x: cbx,
                    y: cby
                  }
                ],
                /* [] */0
              ];
    default:
      return failwith("Shouldn't reach here");
  }
}

function generate_enemies(blockw, blockh, _cbx, _cby, acc) {
  while(true) {
    var cby = _cby;
    var cbx = _cbx;
    if (cbx > blockw - 32) {
      return /* [] */0;
    }
    if (cby > blockh - 1 || cbx < 15) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (mem_loc({
            x: cbx,
            y: cby
          }, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = $$int$1(30);
    if (prob < 3 && blockh - 1 === cby) {
      var enemy_000 = /* tuple */[
        prob,
        {
          x: cbx * 16,
          y: cby * 16
        }
      ];
      var enemy = /* :: */[
        enemy_000,
        /* [] */0
      ];
      return $at(enemy, generate_enemies(blockw, blockh, cbx, cby + 1, acc));
    }
    _cby = cby + 1;
    continue ;
  }
}

function generate_block_enemies(_block_coord) {
  while(true) {
    var block_coord = _block_coord;
    var place_enemy = $$int$1(20);
    var enemy_typ = $$int$1(3);
    if (!block_coord) {
      return /* [] */0;
    }
    var t = block_coord[1];
    var h = block_coord[0];
    if (place_enemy === 0) {
      var xc = h[1].x;
      var yc = h[1].y;
      return $at(/* :: */[
                  /* tuple */[
                    enemy_typ,
                    {
                      x: xc,
                      y: yc - 16
                    }
                  ],
                  /* [] */0
                ], generate_block_enemies(t));
    }
    _block_coord = t;
    continue ;
  }
}

function generate_block_locs(blockw, blockh, _cbx, _cby, _acc) {
  while(true) {
    var acc = _acc;
    var cby = _cby;
    var cbx = _cbx;
    if (blockw - cbx < 33) {
      return acc;
    }
    if (cby > blockh - 1) {
      _cby = 0;
      _cbx = cbx + 1;
      continue ;
    }
    if (mem_loc({
            x: cbx,
            y: cby
          }, acc) || cby === 0) {
      _cby = cby + 1;
      continue ;
    }
    var prob = $$int$1(100);
    if (prob < 5) {
      var newacc = choose_block_pattern(blockw, blockh, cbx, cby, prob);
      var undup_lst = avoid_overlap(newacc, acc);
      var called_acc = $at(acc, undup_lst);
      _acc = called_acc;
      _cby = cby + 1;
      continue ;
    }
    _cby = cby + 1;
    continue ;
  }
}

function generate_panel(context, blockw, blockh) {
  return spawn(/* SBlock */__(3, [/* Panel */4]), context, {
              x: blockw * 16 - 256,
              y: blockh * 16 * 2 / 3
            });
}

function generate_ground(blockw, blockh, _inc, _acc) {
  while(true) {
    var acc = _acc;
    var inc = _inc;
    if (inc > blockw) {
      return acc;
    }
    if (inc > 10) {
      var skip = $$int$1(10);
      var newacc = $at(acc, /* :: */[
            /* tuple */[
              4,
              {
                x: inc * 16,
                y: blockh * 16
              }
            ],
            /* [] */0
          ]);
      if (skip === 7 && blockw - inc > 32) {
        _inc = inc + 1;
        continue ;
      }
      _acc = newacc;
      _inc = inc + 1;
      continue ;
    }
    var newacc$1 = $at(acc, /* :: */[
          /* tuple */[
            4,
            {
              x: inc * 16,
              y: blockh * 16
            }
          ],
          /* [] */0
        ]);
    _acc = newacc$1;
    _inc = inc + 1;
    continue ;
  }
}

function convert_to_block_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  var sblock_typ = choose_sblock_typ(h[0]);
  var ob = spawn(/* SBlock */__(3, [sblock_typ]), context, h[1]);
  return $at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_block_obj(lst[1], context));
}

function convert_to_enemy_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var h = lst[0];
  var senemy_typ = choose_enemy_typ(h[0]);
  var ob = spawn(/* SEnemy */__(1, [senemy_typ]), context, h[1]);
  return $at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_enemy_obj(lst[1], context));
}

function convert_to_coin_obj(lst, context) {
  if (!lst) {
    return /* [] */0;
  }
  var ob = spawn(/* SItem */__(2, [/* Coin */1]), context, lst[0][1]);
  return $at(/* :: */[
              ob,
              /* [] */0
            ], convert_to_coin_obj(lst[1], context));
}

function generate_helper(blockw, blockh, _cx, _cy, context) {
  var block_locs = generate_block_locs(blockw, blockh, 0, 0, /* [] */0);
  var converted_block_locs = trim_edges(convert_list(block_locs), blockw, blockh);
  var obj_converted_block_locs = convert_to_block_obj(converted_block_locs, context);
  var ground_blocks = generate_ground(blockw, blockh, 0, /* [] */0);
  var obj_converted_ground_blocks = convert_to_block_obj(ground_blocks, context);
  var block_locations = $at(block_locs, ground_blocks);
  var all_blocks = $at(obj_converted_block_locs, obj_converted_ground_blocks);
  var enemy_locs = generate_enemies(blockw, blockh, 0, 0, block_locations);
  var obj_converted_enemies = convert_to_enemy_obj(enemy_locs, context);
  var coin_locs = generate_coins(converted_block_locs);
  var undup_coin_locs = trim_edges(avoid_overlap(coin_locs, converted_block_locs), blockw, blockh);
  var converted_block_coin_locs = $at(converted_block_locs, coin_locs);
  var enemy_block_locs = generate_block_enemies(converted_block_locs);
  var undup_enemy_block_locs = avoid_overlap(enemy_block_locs, converted_block_coin_locs);
  var obj_enemy_blocks = convert_to_enemy_obj(undup_enemy_block_locs, context);
  var coin_objects = convert_to_coin_obj(undup_coin_locs, context);
  var obj_panel = generate_panel(context, blockw, blockh);
  return $at(all_blocks, $at(obj_converted_enemies, $at(coin_objects, $at(obj_enemy_blocks, /* :: */[
                          obj_panel,
                          /* [] */0
                        ]))));
}

function generate(w, h, context) {
  var blockw = w / 16;
  var blockh = h / 16 - 1;
  var collide_list = generate_helper(blockw, blockh, 0, 0, context);
  var player = spawn(/* SPlayer */__(0, [
          /* SmallM */1,
          /* Standing */0
        ]), context, {
        x: 100,
        y: 224
      });
  return /* tuple */[
          player,
          collide_list
        ];
}

function init$4(param) {
  return self_init(undefined);
}


/* No side effect */

var pressed_keys = {
  left: false,
  right: false,
  up: false,
  down: false,
  bbox: 0
};

var collid_objs = {
  contents: /* [] */0
};

var particles = {
  contents: /* [] */0
};

var last_time = {
  contents: 0
};

function calc_fps(t0, t1) {
  var delta = (t1 - t0) / 1000;
  return 1 / delta;
}

function update_score(state, i) {
  state.score = state.score + i | 0;
  
}

function playerAttackEnemy(o1, typ, s2, o2, state, context) {
  o1.invuln = 10;
  o1.jumping = false;
  o1.grounded = true;
  if (typ >= 3) {
    var r2 = evolve_enemy(o1.dir, typ, s2, o2, context);
    o1.vel.y = -dampen_jump;
    o1.pos.y = o1.pos.y - 5;
    return /* tuple */[
            undefined,
            r2
          ];
  }
  dec_health(o2);
  o1.vel.y = -dampen_jump;
  if (state.multiplier === 8) {
    update_score(state, 800);
    o2.score = 800;
    return /* tuple */[
            undefined,
            evolve_enemy(o1.dir, typ, s2, o2, context)
          ];
  }
  var score = imul(100, state.multiplier);
  update_score(state, score);
  o2.score = score;
  state.multiplier = (state.multiplier << 1);
  return /* tuple */[
          undefined,
          evolve_enemy(o1.dir, typ, s2, o2, context)
        ];
}

function enemyAttackPlayer(o1, t2, s2, o2, context) {
  if (t2 >= 3) {
    var r2 = o2.vel.x === 0 ? evolve_enemy(o1.dir, t2, s2, o2, context) : (dec_health(o1), o1.invuln = invuln, undefined);
    return /* tuple */[
            undefined,
            r2
          ];
  }
  dec_health(o1);
  o1.invuln = invuln;
  return /* tuple */[
          undefined,
          undefined
        ];
}

function col_enemy_enemy(t1, s1, o1, t2, s2, o2, dir) {
  if (t1 !== 3) {
    if (t1 < 4) {
      if (t2 >= 3) {
        if (o2.vel.x === 0) {
          rev_dir(o1, t1, s1);
          return /* tuple */[
                  undefined,
                  undefined
                ];
        } else {
          dec_health(o1);
          return /* tuple */[
                  undefined,
                  undefined
                ];
        }
      } else if (dir >= 2) {
        rev_dir(o1, t1, s1);
        rev_dir(o2, t2, s2);
        return /* tuple */[
                undefined,
                undefined
              ];
      } else {
        return /* tuple */[
                undefined,
                undefined
              ];
      }
    }
    if (t2 >= 3) {
      dec_health(o1);
      dec_health(o2);
      return /* tuple */[
              undefined,
              undefined
            ];
    }
    
  } else if (t2 >= 3) {
    dec_health(o1);
    dec_health(o2);
    return /* tuple */[
            undefined,
            undefined
          ];
  }
  if (o1.vel.x === 0) {
    rev_dir(o2, t2, s2);
    return /* tuple */[
            undefined,
            undefined
          ];
  } else {
    dec_health(o2);
    return /* tuple */[
            undefined,
            undefined
          ];
  }
}

function process_collision(dir, c1, c2, state) {
  var context = state.ctx;
  var exit$$1 = 0;
  var o1;
  var typ;
  var s2;
  var o2;
  var o1$1;
  var t2;
  var o2$1;
  switch (c1.tag | 0) {
    case /* Player */0 :
        var o1$2 = c1[2];
        switch (c2.tag | 0) {
          case /* Player */0 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Enemy */1 :
              var o2$2 = c2[2];
              var s2$1 = c2[1];
              var typ$1 = c2[0];
              if (dir !== 1) {
                return enemyAttackPlayer(o1$2, typ$1, s2$1, o2$2, context);
              }
              o1 = o1$2;
              typ = typ$1;
              s2 = s2$1;
              o2 = o2$2;
              exit$$1 = 1;
              break;
          case /* Item */2 :
              o1$1 = o1$2;
              t2 = c2[0];
              o2$1 = c2[2];
              exit$$1 = 2;
              break;
          case /* Block */3 :
              var o2$3 = c2[2];
              var t = c2[0];
              if (dir !== 0) {
                var exit$1 = 0;
                if (typeof t === "number" && t === 4) {
                  state.status = /* Won */1;
                  return /* tuple */[
                          undefined,
                          undefined
                        ];
                }
                exit$1 = 3;
                if (exit$1 === 3) {
                  if (dir !== 1) {
                    collide_block(dir, o1$2);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  } else {
                    state.multiplier = 1;
                    collide_block(dir, o1$2);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  }
                }
                
              } else {
                if (typeof t === "number") {
                  if (t !== 1) {
                    if (t !== 4) {
                      collide_block(dir, o1$2);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    } else {
                      state.status = /* Won */1;
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    }
                  } else if (c1[0] === /* BigM */0) {
                    collide_block(dir, o1$2);
                    dec_health(o2$3);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  } else {
                    collide_block(dir, o1$2);
                    return /* tuple */[
                            undefined,
                            undefined
                          ];
                  }
                }
                var updated_block = evolve_block(o2$3, context);
                var spawned_item = spawn_above(o1$2.dir, o2$3, t[0], context);
                collide_block(dir, o1$2);
                return /* tuple */[
                        spawned_item,
                        updated_block
                      ];
              }
              break;
          
        }
        break;
    case /* Enemy */1 :
        var o1$3 = c1[2];
        var s1 = c1[1];
        var t1 = c1[0];
        switch (c2.tag | 0) {
          case /* Player */0 :
              var o1$4 = c2[2];
              if (dir !== 0) {
                return enemyAttackPlayer(o1$4, t1, s1, o1$3, context);
              }
              o1 = o1$4;
              typ = t1;
              s2 = s1;
              o2 = o1$3;
              exit$$1 = 1;
              break;
          case /* Enemy */1 :
              return col_enemy_enemy(t1, s1, o1$3, c2[0], c2[1], c2[2], dir);
          case /* Item */2 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              var o2$4 = c2[2];
              var t2$1 = c2[0];
              if (dir >= 2) {
                if (t1 >= 3) {
                  if (typeof t2$1 === "number") {
                    if (t2$1 !== 1) {
                      rev_dir(o1$3, t1, s1);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    } else {
                      dec_health(o2$4);
                      reverse_left_right(o1$3);
                      return /* tuple */[
                              undefined,
                              undefined
                            ];
                    }
                  }
                  var updated_block$1 = evolve_block(o2$4, context);
                  var spawned_item$1 = spawn_above(o1$3.dir, o2$4, t2$1[0], context);
                  rev_dir(o1$3, t1, s1);
                  return /* tuple */[
                          updated_block$1,
                          spawned_item$1
                        ];
                }
                rev_dir(o1$3, t1, s1);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
              collide_block(dir, o1$3);
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          
        }
        break;
    case /* Item */2 :
        var o2$5 = c1[2];
        switch (c2.tag | 0) {
          case /* Player */0 :
              o1$1 = c2[2];
              t2 = c1[0];
              o2$1 = o2$5;
              exit$$1 = 2;
              break;
          case /* Enemy */1 :
          case /* Item */2 :
              return /* tuple */[
                      undefined,
                      undefined
                    ];
          case /* Block */3 :
              if (dir >= 2) {
                reverse_left_right(o2$5);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              } else {
                collide_block(dir, o2$5);
                return /* tuple */[
                        undefined,
                        undefined
                      ];
              }
          
        }
        break;
    case /* Block */3 :
        return /* tuple */[
                undefined,
                undefined
              ];
    
  }
  switch (exit$$1) {
    case 1 :
        return playerAttackEnemy(o1, typ, s2, o2, state, context);
    case 2 :
        if (t2) {
          state.coins = state.coins + 1 | 0;
          dec_health(o2$1);
          update_score(state, 100);
          return /* tuple */[
                  undefined,
                  undefined
                ];
        } else {
          dec_health(o2$1);
          if (o1$1.health === 2) {
            
          } else {
            o1$1.health = o1$1.health + 1 | 0;
          }
          o1$1.vel.x = 0;
          o1$1.vel.y = 0;
          update_score(state, 1000);
          o2$1.score = 1000;
          return /* tuple */[
                  undefined,
                  undefined
                ];
        }
    
  }
}

function broad_phase(collid, all_collids, state) {
  var obj = get_obj(collid);
  return keep(all_collids, (function (_c) {
                if (in_viewport(state.vpt, obj.pos) || is_player(collid)) {
                  return true;
                } else {
                  return out_of_viewport_below(state.vpt, obj.pos.y);
                }
              }));
}

function narrow_phase(c, cs, state) {
  var _cs = cs;
  var _acc = /* [] */0;
  while(true) {
    var acc = _acc;
    var cs$1 = _cs;
    if (!cs$1) {
      return acc;
    }
    var h = cs$1[0];
    var c_obj = get_obj(c);
    var new_objs;
    if (equals(c, h)) {
      new_objs = /* tuple */[
        undefined,
        undefined
      ];
    } else {
      var dir = check_collision(c, h);
      new_objs = dir !== undefined && get_obj(h).id !== c_obj.id ? process_collision(dir, c, h, state) : /* tuple */[
          undefined,
          undefined
        ];
    }
    var o = new_objs[0];
    var acc$1;
    if (o !== undefined) {
      var o2 = new_objs[1];
      acc$1 = o2 !== undefined ? /* :: */[
          o,
          /* :: */[
            o2,
            acc
          ]
        ] : /* :: */[
          o,
          acc
        ];
    } else {
      var o$1 = new_objs[1];
      acc$1 = o$1 !== undefined ? /* :: */[
          o$1,
          acc
        ] : acc;
    }
    _acc = acc$1;
    _cs = cs$1[1];
    continue ;
  }
}

function check_collisions(collid, all_collids, state) {
  if (collid.tag === /* Block */3) {
    return /* [] */0;
  }
  var broad = broad_phase(collid, all_collids, state);
  return narrow_phase(collid, broad, state);
}

function update_collidable(state, collid, all_collids) {
  var obj = get_obj(collid);
  var spr = get_sprite(collid);
  obj.invuln = obj.invuln > 0 ? obj.invuln - 1 | 0 : 0;
  var viewport_filter = in_viewport(state.vpt, obj.pos) || is_player(collid) || out_of_viewport_below(state.vpt, obj.pos.y);
  if (!(!obj.kill && viewport_filter)) {
    return /* [] */0;
  }
  obj.grounded = false;
  process_obj(obj, state.map);
  var evolved = check_collisions(collid, all_collids, state);
  var vpt_adj_xy = coord_to_viewport(state.vpt, obj.pos);
  render(spr, /* tuple */[
        vpt_adj_xy.x,
        vpt_adj_xy.y
      ]);
  if (pressed_keys.bbox === 1) {
    render_bbox(spr, /* tuple */[
          vpt_adj_xy.x,
          vpt_adj_xy.y
        ]);
  }
  if (obj.vel.x !== 0 || !is_enemy(collid)) {
    update_animation(spr);
  }
  return evolved;
}

function translate_keys(param) {
  var ctrls_000 = /* tuple */[
    pressed_keys.left,
    /* CLeft */0
  ];
  var ctrls_001 = /* :: */[
    /* tuple */[
      pressed_keys.right,
      /* CRight */1
    ],
    /* :: */[
      /* tuple */[
        pressed_keys.up,
        /* CUp */2
      ],
      /* :: */[
        /* tuple */[
          pressed_keys.down,
          /* CDown */3
        ],
        /* [] */0
      ]
    ]
  ];
  var ctrls = /* :: */[
    ctrls_000,
    ctrls_001
  ];
  return reduce(ctrls, /* [] */0, (function (a, x) {
                if (x[0]) {
                  return /* :: */[
                          x[1],
                          a
                        ];
                } else {
                  return a;
                }
              }));
}

function run_update_collid(state, collid, all_collids) {
  if (collid.tag) {
    var obj = get_obj(collid);
    var evolved = update_collidable(state, collid, all_collids);
    if (!obj.kill) {
      collid_objs.contents = /* :: */[
        collid,
        $at(collid_objs.contents, evolved)
      ];
    }
    var new_parts = obj.kill ? kill(collid, state.ctx) : /* [] */0;
    particles.contents = $at(particles.contents, new_parts);
    return collid;
  }
  var o = collid[2];
  var keys = translate_keys(undefined);
  o.crouch = false;
  var match = update_player(o, keys, state.ctx);
  var player;
  if (match !== undefined) {
    var new_spr = match[1];
    normalize_pos(o.pos, collid[1].params, new_spr.params);
    player = /* Player */__(0, [
        match[0],
        new_spr,
        o
      ]);
  } else {
    player = collid;
  }
  var evolved$1 = update_collidable(state, player, all_collids);
  collid_objs.contents = $at(collid_objs.contents, evolved$1);
  return player;
}

function run_update_particle(state, part) {
  $$process(part);
  var x = part.pos.x - getPos(state.vpt).x;
  var y = part.pos.y - getPos(state.vpt).y;
  render(part.params.sprite, /* tuple */[
        x,
        y
      ]);
  if (!part.kill) {
    particles.contents = /* :: */[
      part,
      particles.contents
    ];
    return ;
  }
  
}

function updateLoop(canvas, param) {
  var player = param[0];
  var ctx = canvas.getContext("2d");
  var cwidth = canvas.width / 1;
  var cheight = canvas.height / 1;
  var viewport = make$8(/* tuple */[
        cwidth,
        cheight
      ], map_dim);
  var state = {
    bgd: make_bgd(ctx),
    ctx: ctx,
    vpt: update(viewport, get_obj(player).pos),
    map: map_dim[1],
    score: 0,
    coins: 0,
    multiplier: 1,
    status: /* Playing */0
  };
  state.ctx.scale(1, 1);
  var updateHelper = function (time, state, _player, _objs, _parts) {
    while(true) {
      var parts = _parts;
      var objs = _objs;
      var player = _player;
      var t = state.status;
      if (typeof t === "number") {
        if (t !== 0) {
          return gameWon(state.ctx);
        }
        collid_objs.contents = /* [] */0;
        particles.contents = /* [] */0;
        var fps$$1 = calc_fps(last_time.contents, time);
        last_time.contents = time;
        clear_canvas(canvas);
        var vpos_x_int = getPos(state.vpt).x / 5 | 0;
        var bgd_width = state.bgd.params.frame_size[0] | 0;
        draw_bgd(state.bgd, mod_(vpos_x_int, bgd_width));
        var player$1 = run_update_collid(state, player, objs);
        if (get_obj(player$1).kill === true) {
          state.status = /* Lost */[time];
          _parts = particles.contents;
          _objs = collid_objs.contents;
          _player = player$1;
          continue ;
        }
        var state$1 = {
          bgd: state.bgd,
          ctx: state.ctx,
          vpt: update(state.vpt, get_obj(player$1).pos),
          map: state.map,
          score: state.score,
          coins: state.coins,
          multiplier: state.multiplier,
          status: state.status
        };
        forEach(objs, (function(objs,state$1){
            return function (obj) {
              return run_update_collid(state$1, obj, objs);
            }
            }(objs,state$1)));
        forEach(parts, (function(state$1){
            return function (part) {
              return run_update_particle(state$1, part);
            }
            }(state$1)));
        fps(canvas, fps$$1);
        hud(canvas, state$1.score, state$1.coins);
        requestAnimationFrame((function(player$1,state$1){
            return function (t) {
              return updateHelper(t, state$1, player$1, collid_objs.contents, particles.contents);
            }
            }(player$1,state$1)));
        return ;
      }
      var timeToStart = 5 - ((time - t[0] | 0) / 1000 | 0) | 0;
      if (timeToStart > 0) {
        gameLost(state.ctx, timeToStart);
        requestAnimationFrame((function(player){
            return function (t) {
              return updateHelper(t, state, player, collid_objs.contents, particles.contents);
            }
            }(player)));
        return ;
      }
      var match = generate(level_width, level_height, state.ctx);
      return updateLoop(canvas, /* tuple */[
                  match[0],
                  match[1]
                ]);
    }
  };
  return updateHelper(0, state, player, param[1], /* [] */0);
}

function keydown(evt) {
  var match = evt.keyCode;
  if (match >= 41) {
    switch (match) {
      case 65 :
          pressed_keys.left = true;
          break;
      case 66 :
          pressed_keys.bbox = (pressed_keys.bbox + 1 | 0) % 2;
          break;
      case 68 :
          pressed_keys.right = true;
          break;
      case 83 :
          pressed_keys.down = true;
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
          pressed_keys.up = true;
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
          pressed_keys.left = true;
          break;
      case 0 :
      case 6 :
          pressed_keys.up = true;
          break;
      case 7 :
          pressed_keys.right = true;
          break;
      case 8 :
          pressed_keys.down = true;
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
          pressed_keys.right = false;
        }
      } else {
        pressed_keys.up = false;
      }
    } else {
      pressed_keys.down = false;
    }
  } else if (match >= 41) {
    if (match !== 65) {
      
    } else {
      pressed_keys.left = false;
    }
  } else if (match >= 32) {
    switch (match - 32 | 0) {
      case 1 :
      case 2 :
      case 3 :
      case 4 :
          break;
      case 5 :
          pressed_keys.left = false;
          break;
      case 0 :
      case 6 :
          pressed_keys.up = false;
          break;
      case 7 :
          pressed_keys.right = false;
          break;
      case 8 :
          pressed_keys.down = false;
          break;
      
    }
  }
  return true;
}


/* No side effect */

function load(param) {
  self_init(undefined);
  var el = document.getElementById(canvasId);
  var canvas = el !== null ? el : (console.log("cant find canvas " + (canvasId + " \n")), failwith("fail"));
  var context = canvas.getContext("2d");
  document.addEventListener("keydown", keydown, true);
  document.addEventListener("keyup", keyup, true);
  init$4(undefined);
  return updateLoop(canvas, generate(level_width, level_height, context));
}

function preload(param) {
  var loadCount = {
    contents: 0
  };
  var numImages = images.length;
  return forEachU$1(images, (function (img_src) {
                var img = document.createElement("img");
                img.src = root_dir + img_src;
                img.addEventListener("load", (function (param) {
                        loadCount.contents = loadCount.contents + 1 | 0;
                        if (loadCount.contents === numImages) {
                          load(undefined);
                        }
                        return true;
                      }), true);
                
              }));
}

window.onload = (function (param) {
    preload(undefined);
    return true;
  });


/*  Not a pure module */

}());
