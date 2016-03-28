(function() {
    var tetromino = null;

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

    var screenElement = document.getElementById("screen");
    screenElement.addEventListener("click", startGame);
    
    if (Tetrez.config.isDebugMode) {
        // This setTimeout is necessary because of a bug in OSX Safari,
        // where sometimes the canvas does not have a height of 100%
        // because the window.innerHeight variable isn't ready
        setTimeout(function() {
            screenElement.click();
        }, 1000);
    }
}());