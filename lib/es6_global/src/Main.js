

import * as Config from "./Config.js";
import * as Random from "../../../node_modules/bs-platform/lib/es6/random.js";
import * as Director from "./Director.js";
import * as Generator from "./Generator.js";
import * as Belt_Array from "../../../node_modules/bs-platform/lib/es6/belt_Array.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";

var loadCount = {
  contents: 0
};

function inc_counter(param) {
  loadCount.contents = loadCount.contents + 1 | 0;
  if (loadCount.contents === Config.images.length) {
    Random.self_init(undefined);
    var el = document.getElementById(Config.canvasId);
    var canvas = el !== null ? el : (console.log("cant find canvas " + (Config.canvasId + " \n")), Pervasives.failwith("fail"));
    var context = canvas.getContext("2d");
    document.addEventListener("keydown", Director.keydown, true);
    document.addEventListener("keyup", Director.keyup, true);
    Generator.init(undefined);
    return Director.updateLoop(canvas, Generator.generate(Config.level_width, Config.level_height, context));
  }
  
}

function preload(param) {
  return Belt_Array.forEachU(Config.images, (function (img_src) {
                var img_src$1 = Config.root_dir + img_src;
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
