[@bs.config {no_export: no_export}];

open Belt;

module Html = Html;

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
  let context = canvas.getContext(. "2d");
  Html.addEventListener(Html.document, "keydown", Director.keydown, true);
  Html.addEventListener(Html.document, "keyup", Director.keyup, true);
  Generator.init();
  Director.update_loop(
    canvas,
    Generator.generate(Config.level_width, Config.level_height, context),
  );
};

let inc_counter = {
  let loadCount = ref(0);
  _ => {
    loadCount := loadCount^ + 1;
    if (loadCount^ == Config.images->Array.length) {
      load();
    } else {
      ();
    };
  };
};

// Used for concurrency issues.
let preload = _ => {
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