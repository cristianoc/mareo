

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
        var context = el.getContext("2d");
        document.addEventListener("keydown", Keys.keydown, true);
        document.addEventListener("keyup", Keys.keyup, true);
        return [
                el,
                context
              ];
      }
      console.log("cant find canvas " + (Config.canvasId + " \n"));
      throw {
            RE_EXN_ID: "Assert_failure",
            _1: [
              "Load.re",
              9,
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
  return CamlinternalLazy.force(canvasAndContext)[0];
}

function getContext(param) {
  return CamlinternalLazy.force(canvasAndContext)[1];
}

export {
  canvasAndContext ,
  getCanvasAndContext ,
  getCanvas ,
  getContext ,
  
}
/* No side effect */
