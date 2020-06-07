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

// Used for concurrency issues.
let preload = () => {
  let loadCount = ref(0);
  let numImages = Config.images->Array.length;
  Config.images->Array.forEachU((. img_src) => {
    let img = Html.createImg(Html.document);
    img.src = Config.root_dir ++ img_src;
    img->Html.addEventListenerImg(
      "load",
      _ => {
        loadCount := loadCount^ + 1;
        if (loadCount^ == numImages) {
          load();
        };
        true;
      },
      true,
    );
  });
};

Html.windowToJsObj(Html.window)##onload
#= (
     _ => {
       preload();
       true;
     }
   );