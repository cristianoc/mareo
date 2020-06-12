

import * as Caml_primitive from "bs-platform/lib/es6/caml_primitive.js";

function getPos(param) {
  return param.pos;
}

function make(param, param$1) {
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

function calcViewportPoint(cc, vc, mc) {
  var vc_half = vc / 2;
  return Caml_primitive.caml_float_min(Caml_primitive.caml_float_max(cc - vc_half, 0), Caml_primitive.caml_float_min(mc - vc, Math.abs(cc - vc_half)));
}

function inViewport(v, px, py) {
  var v_min_x = v.pos.x - 32;
  var v_max_x = v.pos.x + v.v_dim.x;
  var v_min_y = v.pos.y - 32;
  var v_max_y = v.pos.y + v.v_dim.y;
  if (px >= v_min_x && px <= v_max_x && py >= v_min_y) {
    return py <= v_max_y;
  } else {
    return false;
  }
}

function outOfViewportBelow(v, y) {
  var vMaxY = v.pos.y + v.v_dim.y;
  return y >= vMaxY;
}

function fromCoord(viewport, px, py) {
  return {
          x: px - viewport.pos.x,
          y: py - viewport.pos.y
        };
}

function update(vpt, px, py) {
  var newX = calcViewportPoint(px, vpt.v_dim.x, vpt.m_dim.x);
  var newY = calcViewportPoint(py, vpt.v_dim.y, vpt.m_dim.y);
  var pos = {
    x: newX,
    y: newY
  };
  return {
          pos: pos,
          v_dim: vpt.v_dim,
          m_dim: vpt.m_dim
        };
}

export {
  getPos ,
  make ,
  calcViewportPoint ,
  inViewport ,
  outOfViewportBelow ,
  fromCoord ,
  update ,
  
}
/* No side effect */
