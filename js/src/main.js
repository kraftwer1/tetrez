(function() {
    var titleScreen = document.getElementById("titleScreen");
    var gameOverScreen = document.getElementById("gameOverScreen");

    var startGame = function() {
        titleScreen.addEventListener("transitionend", function(e) {
            e.target.style.display = "none";
        });

        titleScreen.classList.add("transparent");
        
        // This starts the game
        Tetrez.controller.init();

        // Make sure the game can be started only once
        titleScreen.removeEventListener("click", startGame);
    };

    // Prevent elastic scrolling (e.g. iOS Safari)
    window.addEventListener("touchmove", function(e) {
        e.preventDefault();
    });

    gameOverScreen.addEventListener("click", function() {
        location.reload();
    });

    var audioLoadQueue = new createjs.LoadQueue;
    audioLoadQueue.installPlugin(createjs.Sound);

    // Game can be played when everything is loaded
    audioLoadQueue.on("complete", function() {
        titleScreen.addEventListener("click", startGame);

        document.getElementById("loading").style.display = "none";
        document.getElementById("play").style.display = "block";

        if (Tetrez.config.isDebugMode) {
            // This setTimeout is necessary because of a bug in OSX Safari,
            // where sometimes the canvas does not have a height of 100%
            // because the window.innerHeight variable isn't ready
            setTimeout(function() {
                titleScreen.click();
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
    audioLoadQueue.loadFile({ src: "sounds/bass1.mp3", id: "bass1" });
    audioLoadQueue.loadFile({ src: "sounds/bass2.mp3", id: "bass2" });
    audioLoadQueue.loadFile({ src: "sounds/bass3.mp3", id: "bass3" });
    audioLoadQueue.loadFile({ src: "sounds/bass4.mp3", id: "bass4" });
}());