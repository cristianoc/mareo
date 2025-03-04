

import * as Caml from "rescript/lib/es6/caml.js";

function make(param, param$1) {
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
  return Caml.caml_float_min(Caml.caml_float_max(cc - vc_half, 0), Caml.caml_float_min(mc - vc, Math.abs(cc - vc_half)));
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

export {
  make ,
  calcViewportPoint ,
  inViewport ,
  outOfViewportBelow ,
  fromCoord ,
  update ,
  
}
/* No side effect */
