

import * as Config from "./Config.js";
import * as Director from "./Director.js";
import * as Generator from "./Generator.js";
import * as Belt_Array from "bs-platform/lib/es6/belt_Array.js";

function preload(param) {
  var loadCount = {
    contents: 0
  };
  var numImages = Config.images.length;
  return Belt_Array.forEachU(Config.images, (function (img_src) {
                var img = document.createElement("img");
                img.src = Config.spritesDir + img_src;
                img.addEventListener("load", (function (param) {
                        loadCount.contents = loadCount.contents + 1 | 0;
                        if (loadCount.contents === numImages) {
                          var match = Generator.generate(1);
                          Director.updateLoop(match[0], match[1], 1, match[2]);
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
