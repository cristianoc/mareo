let canvasAndContext =
  lazy(
    {
      Random.self_init();
      switch (Html.getElementById(Html.document, Config.canvasId)) {
      | None =>
        print_endline("cant find canvas " ++ Config.canvasId ++ " \n");
        assert(false);
      | Some(el) =>
        let canvas = Html.elementToCanvasElement(el);
        let context = canvas.getContext(. "2d");
        Html.addEventListener(Html.document, "keydown", Keys.keydown, true);
        Html.addEventListener(Html.document, "keyup", Keys.keyup, true);
        (canvas, context);
      };
    }
  );

let getCanvasAndContext = () => Lazy.force(canvasAndContext);

let getCanvas = () => getCanvasAndContext()->fst;

let getContext = () => getCanvasAndContext()->snd;