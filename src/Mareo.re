open Belt;

module Html = Html;

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
          Generator.init();
          Director.updateLoop(Generator.generate());
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