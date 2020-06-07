type imageElement = {
  [@live]
  mutable src: string,
};

type canvasRenderingContext2D = {
  clearRect: (. float, float, float, float) => unit,
  drawImage:
    (. imageElement, float, float, float, float, float, float, float, float) =>
    unit,
  fill: (. unit) => unit,
  [@live]
  mutable fillStyle: string,
  fillText: (. string, float, float) => unit,
  [@live]
  mutable font: string,
  rect: (. float, float, float, float) => unit,
  scale: (. float, float) => unit,
  strokeRect: (. float, float, float, float) => unit,
  [@live]
  mutable strokeStyle: string,
};

type canvasElement = {
  getContext: (. string) => canvasRenderingContext2D,
  height: int,
  width: int,
};

[@bs.val] external document: Dom.document = "document";

[@bs.val] external window: Dom.window = "window";

type performance = {now: (. unit) => float};
[@bs.val] external performance: performance = "performance";

/* external createImg: (_ [@bs.as "img"]) -> document -> imageElement = "createElement" [@@bs.send] */
[@bs.send]
external createImg: (Dom.document, [@bs.as "img"] _) => imageElement =
  "createElement";

[@bs.val]
external requestAnimationFrame: (float => unit) => unit =
  "requestAnimationFrame";

[@bs.return null_to_opt] [@bs.send]
external getElementById: (Dom.document, string) => option(Dom.element) =
  "getElementById";

[@bs.send]
external addEventListener:
  (Dom.document, string, Dom.event_like('a) => bool, bool) => unit =
  "addEventListener";

[@bs.send]
external addEventListenerImg:
  (imageElement, string, Dom.event_like('a) => bool, bool) => unit =
  "addEventListener";

type renderingContext;

external keyboardEventToJsObj: Dom.keyboardEvent => Js.t({..}) = "%identity";

external elementToCanvasElement: Dom.element => canvasElement = "%identity";

external windowToJsObj: Dom.window => Js.t({..}) = "%identity";