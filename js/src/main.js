(function() {
    var screenElement = document.getElementById("screen");

    // Prevent elastic scrolling (e.g. iOS Safari)
    window.addEventListener("touchmove", function(e) {
        event.preventDefault();
    });

    var startGame = function() {
        screenElement.addEventListener("transitionend", function(e) {
            e.target.style.display = "none";
        });

        screenElement.classList.add("transparent");
        
        // This starts the game
        Tetrez.controller.init();

        // Make sure the game can be started only once
        screenElement.removeEventListener("click", startGame);
    };

    var audioLoadQueue = new createjs.LoadQueue;
    audioLoadQueue.installPlugin(createjs.Sound);

    // Game can be played when everything is loaded
    audioLoadQueue.on("complete", function() {
        screenElement.addEventListener("click", startGame);

        document.getElementById("loading").style.display = "none";
        document.getElementById("play").style.display = "block";

        if (Tetrez.config.isDebugMode) {
            // This setTimeout is necessary because of a bug in OSX Safari,
            // where sometimes the canvas does not have a height of 100%
            // because the window.innerHeight variable isn't ready
            setTimeout(function() {
                screenElement.click();
            }, 1000);
        }
    });

    audioLoadQueue.loadFile({ src: "sounds/hh.mp3", id: "hh" });
    audioLoadQueue.loadFile({ src: "sounds/bd.mp3", id: "bd" });
    audioLoadQueue.loadFile({ src: "sounds/chord.mp3", id: "chord" });
    audioLoadQueue.loadFile({ src: "sounds/halfbd.mp3", id: "halfbd" });
    audioLoadQueue.loadFile({ src: "sounds/sweep.mp3", id: "sweep" });
    audioLoadQueue.loadFile({ src: "sounds/trance.mp3", id: "trance" });
    audioLoadQueue.loadFile({ src: "sounds/sunrise.mp3", id: "sunrise" });
    audioLoadQueue.loadFile({ src: "sounds/wood.mp3", id: "wood" });
}());