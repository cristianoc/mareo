[@bs.config {no_export: no_export}];

open Belt;

module Html = Html;

module Pg = Procedural_generator;

let loadCount = ref(0);

let imgsToLoad = 4;

let level_width = 2400.;

let level_height = 256.;

// Canvas is chosen from the index.html file. The context is obtained from
// the canvas. Listeners are added. A level is generated and the general
// update_loop method is called to make the level playable.
let load = _ => {
  Random.self_init();
  let canvas_id = "canvas";
  let canvas =
    switch (Html.getElementById(Html.document, canvas_id)) {
    | None =>
      print_endline("cant find canvas " ++ canvas_id ++ " \n");
      failwith("fail");
    | Some(el) => Html.elementToCanvasElement(el)
    };
  let context = Html.canvasElementToJsObj(canvas)##getContext("2d");
  Html.addEventListener(Html.document, "keydown", Director.keydown, true);
  Html.addEventListener(Html.document, "keyup", Director.keyup, true);
  Pg.init();
  Director.update_loop(
    canvas,
    Pg.generate(level_width, level_height, context),
    (level_width, level_height),
  );
};

let inc_counter = _ => {
  loadCount := loadCount^ + 1;
  if (loadCount^ == imgsToLoad) {
    load();
  } else {
    ();
  };
};

// Used for concurrency issues.
let preload = _ => {
  let root_dir = "sprites/";
  let imgs = ["blocks.png", "items.png", "enemies.png", "mario-small.png"];
  List.map(
    imgs,
    img_src => {
      let img_src = root_dir ++ img_src;
      let img = Html.createImg(Html.document);
      Html.imageElementToJsObj(img)##src #= img_src;
      ignore(
        Html.addEventListenerImg(
          img,
          "load",
          _ev => {
            inc_counter();
            true;
          },
          true,
        ),
      );
    },
  );
};

Html.windowToJsObj(Html.window)##onload
#= (
     _ => {
       ignore(preload());
       true;
     }
   );