

import * as Caml_primitive from "../../../node_modules/bs-platform/lib/es6/caml_primitive.js";

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

function calc_viewport_point(cc, vc, mc) {
  var vc_half = vc / 2;
  return Caml_primitive.caml_float_min(Caml_primitive.caml_float_max(cc - vc_half, 0), Caml_primitive.caml_float_min(mc - vc, Math.abs(cc - vc_half)));
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

export {
  make ,
  calc_viewport_point ,
  in_viewport ,
  out_of_viewport_below ,
  coord_to_viewport ,
  update ,
  
}
/* No side effect */
