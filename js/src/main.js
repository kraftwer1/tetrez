(function() {
    var tetromino = null;

    // Prevent elastic scrolling (e.g. iOS Safari)
    document.body.addEventListener("touchmove", function(e) {
        event.preventDefault();
    });

    var startGame = function() {
        screenElement.addEventListener("transitionend", function(e) {
            e.target.style.display = "none";
        });

        screenElement.classList.add("transparent");
        
        Tetrez.controller.start();

        // Make sure the game can be started only once
        screenElement.removeEventListener("click", startGame);
    };

    var screenElement = document.getElementById("screen");
    screenElement.addEventListener("click", startGame);
    
    if (Tetrez.config.isDebugMode) screenElement.click();
}());