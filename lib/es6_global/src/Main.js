

import * as Random from "../../../node_modules/bs-platform/lib/es6/random.js";
import * as Director from "./Director.js";
import * as Belt_List from "../../../node_modules/bs-platform/lib/es6/belt_List.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";
import * as Procedural_generator from "./Procedural_generator.js";

var loadCount = {
  contents: 0
};

function inc_counter(param) {
  loadCount.contents = loadCount.contents + 1 | 0;
  if (loadCount.contents === 4) {
    Random.self_init(undefined);
    var canvas_id = "canvas";
    var el = document.getElementById(canvas_id);
    var canvas = el !== null ? el : (console.log("cant find canvas canvas \n"), Pervasives.failwith("fail"));
    var context = canvas.getContext("2d");
    document.addEventListener("keydown", Director.keydown, true);
    document.addEventListener("keyup", Director.keyup, true);
    Procedural_generator.init(undefined);
    return Director.update_loop(canvas, Procedural_generator.generate(2400, 256, context), /* tuple */[
                2400,
                256
              ]);
  }
  
}

function preload(param) {
  return Belt_List.map(/* :: */[
              "blocks.png",
              /* :: */[
                "items.png",
                /* :: */[
                  "enemies.png",
                  /* :: */[
                    "mario-small.png",
                    /* [] */0
                  ]
                ]
              ]
            ], (function (img_src) {
                var img_src$1 = "sprites/" + img_src;
                var img = document.createElement("img");
                img.src = img_src$1;
                img.addEventListener("load", (function (_ev) {
                        inc_counter(undefined);
                        return true;
                      }), true);
                
              }));
}

window.onload = (function (param) {
    preload(undefined);
    return true;
  });

export {
  
}
/*  Not a pure module */
