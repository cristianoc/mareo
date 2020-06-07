[@bs.config {no_export: no_export}];

open Belt;

module Html = Html;

// Canvas is chosen from the index.html file. The context is obtained from
// the canvas. Listeners are added. A level is generated and the general
// update_loop method is called to make the level playable.
let load = () => {
  Random.self_init();
  let canvas =
    switch (Html.getElementById(Html.document, Config.canvasId)) {
    | None =>
      print_endline("cant find canvas " ++ Config.canvasId ++ " \n");
      failwith("fail");
    | Some(el) => Html.elementToCanvasElement(el)
    };
  let context = canvas.getContext(. "2d");
  Html.addEventListener(Html.document, "keydown", Director.keydown, true);
  Html.addEventListener(Html.document, "keyup", Director.keyup, true);
  Generator.init();
  Director.updateLoop(
    canvas,
    Generator.generate(Config.level_width, Config.level_height, context),
  );
};

let inc_counter = {
  let loadCount = ref(0);
  () => {
    loadCount := loadCount^ + 1;
    if (loadCount^ == Config.images->Array.length) {
      load();
    } else {
      ();
    };
  };
};

// Used for concurrency issues.
let preload = () => {
  Array.forEachU(
    Config.images,
    (. img_src) => {
      let img_src = Config.root_dir ++ img_src;
      let img = Html.createImg(Html.document);
      img.src = img_src;
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