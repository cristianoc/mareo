

import * as Keys from "./Keys.js";
import * as Config from "./Config.js";
import * as Random from "bs-platform/lib/es6/random.js";
import * as CamlinternalLazy from "bs-platform/lib/es6/camlinternalLazy.js";

var canvasAndContext = {
  RE_LAZY_DONE: false,
  value: (function () {
      Random.init(34);
      var el = document.getElementById(Config.canvasId);
      if (el !== null) {
        var width = el.width;
        var height = el.height;
        var context = el.getContext("2d");
        context.scale(Config.scale, Config.scale);
        document.addEventListener("keydown", Keys.keydown, true);
        document.addEventListener("keyup", Keys.keyup, true);
        return {
                canvasElement: el,
                sizeScaled: [
                  width / Config.scale,
                  height / Config.scale
                ],
                context: context
              };
      }
      console.log("cant find canvas " + (Config.canvasId + " \n"));
      throw {
            RE_EXN_ID: "Assert_failure",
            _1: [
              "Load.re",
              15,
              8
            ],
            Error: new Error()
          };
    })
};

function getCanvasAndContext(param) {
  return CamlinternalLazy.force(canvasAndContext);
}

function getCanvas(param) {
  return CamlinternalLazy.force(canvasAndContext).canvasElement;
}

function getContext(param) {
  return CamlinternalLazy.force(canvasAndContext).context;
}

function getCanvasSizeScaled(param) {
  return CamlinternalLazy.force(canvasAndContext).sizeScaled;
}

export {
  canvasAndContext ,
  getCanvasAndContext ,
  getCanvas ,
  getContext ,
  getCanvasSizeScaled ,
  
}
/* No side effect */
