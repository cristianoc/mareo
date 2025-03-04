

import * as Keys from "./Keys.js";
import * as Config from "./Config.js";
import * as CamlinternalLazy from "rescript/lib/es6/camlinternalLazy.js";

var canvasAndContext = {
  LAZY_DONE: false,
  VAL: (function () {
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
              "Load.res",
              11,
              4
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
