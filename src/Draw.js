

import * as Load from "./Load.js";
import * as Config from "./Config.js";
import * as $$String from "rescript/lib/es6/string.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";

function renderBbox(sprite, posx, posy) {
  var match = sprite.params.bboxOffset;
  var match$1 = sprite.params.bboxSize;
  var context = Load.getContext(undefined);
  context.strokeStyle = "#FF0000";
  return context.strokeRect(posx + match[0], posy + match[1], match$1[0], match$1[1]);
}

function render(sprite, posx, posy) {
  var match = sprite.params.srcOffset;
  var match$1 = sprite.params.frameSize;
  var sw = match$1[0];
  var match$2 = sprite.params.frameSize;
  var sx = match[0] + sprite.frame * sw;
  var context = Load.getContext(undefined);
  return context.drawImage(sprite.img, sx, match[1], sw, match$1[1], posx, posy, match$2[0], match$2[1]);
}

function drawBgd(bgd, off_x) {
  render(bgd, -off_x, 0);
  return render(bgd, bgd.params.frameSize[0] - off_x, 0);
}

function clearCanvas(param) {
  var canvas = Load.getCanvas(undefined);
  var context = Load.getContext(undefined);
  var cwidth = canvas.width;
  var cheight = canvas.height;
  return context.clearRect(0, 0, cwidth, cheight);
}

function scoreString(score) {
  var b = "       ";
  var blen = b.length;
  var s = String(score);
  var slen = s.length;
  if (slen <= blen) {
    return $$String.sub(b, 0, blen - slen | 0) + s;
  } else {
    return s;
  }
}

function scoreAndCoins(score, coins) {
  var coin_string = String(coins);
  var context = Load.getContext(undefined);
  context.font = "10px 'Press Start 2P'";
  context.fillText("Cx" + coin_string, 8, 18);
  return context.fillText(scoreString(score), 264, 18);
}

function fps(fps_val) {
  var fps_str = String(fps_val | 0);
  return Load.getContext(undefined).fillText(fps_str, 169, 18);
}

function blackScreen(texts) {
  var ctx = Load.getContext(undefined);
  var fontSize = 20 / Config.scale;
  var fontTxt = String(fontSize | 0) + "px";
  ctx.rect(0, 0, 512 / Config.scale, 512 / Config.scale);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = fontTxt + "'Press Start 2P'";
  Belt_List.forEach(texts, (function (param) {
          return ctx.fillText(param[0], param[1] / Config.scale, param[2] / Config.scale);
        }));
  ctx.fillStyle = "black";
  
}

function levelFinished(result, level, elapsed) {
  if (result) {
    return blackScreen({
                hd: [
                  "You lose level " + (level + "!"),
                  80,
                  100
                ],
                tl: {
                  hd: [
                    elapsed,
                    230,
                    160
                  ],
                  tl: /* [] */0
                }
              });
  } else {
    return blackScreen({
                hd: [
                  "You win level" + (level + "!"),
                  80,
                  100
                ],
                tl: {
                  hd: [
                    elapsed,
                    230,
                    160
                  ],
                  tl: /* [] */0
                }
              });
  }
}

export {
  renderBbox ,
  render ,
  drawBgd ,
  clearCanvas ,
  scoreString ,
  scoreAndCoins ,
  fps ,
  blackScreen ,
  levelFinished ,
  
}
/* No side effect */
