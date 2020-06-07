

import * as Config from "./Config.js";
import * as Random from "../../../node_modules/bs-platform/lib/es6/random.js";
import * as Director from "./Director.js";
import * as Generator from "./Generator.js";
import * as Belt_Array from "../../../node_modules/bs-platform/lib/es6/belt_Array.js";
import * as Pervasives from "../../../node_modules/bs-platform/lib/es6/pervasives.js";

function load(param) {
  Random.self_init(undefined);
  var el = document.getElementById(Config.canvasId);
  var canvas = el !== null ? el : (console.log("cant find canvas " + (Config.canvasId + " \n")), Pervasives.failwith("fail"));
  var context = canvas.getContext("2d");
  document.addEventListener("keydown", Director.keydown, true);
  document.addEventListener("keyup", Director.keyup, true);
  Generator.init(undefined);
  return Director.updateLoop(canvas, Generator.generate(context));
}

function preload(param) {
  var loadCount = {
    contents: 0
  };
  var numImages = Config.images.length;
  return Belt_Array.forEachU(Config.images, (function (img_src) {
                var img = document.createElement("img");
                img.src = Config.root_dir + img_src;
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

export {
  
}
/*  Not a pure module */
