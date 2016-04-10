(function() {
    var isGameOver = false;
    var gameInterval;
    var hasFallingTetromino = false;
    var isPressingDown = false;

    var resetGameInterval = function() {
        clearInterval(gameInterval);
        gameInterval = setInterval(moveDown, Tetrez.config.initSpeed);
    };

    Tetrez.field.onRowComplete = function(completedRows) {
        if (Tetrez.config.isDebugMode) completedRows *= 4;

        switch (completedRows) {
            case 4:
                Tetrez.view.rotate({
                    x: Math.PI / 8
                });
            break;

            case 8:
                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 12:
                Tetrez.view.rotate({
                    x: Math.PI / 8
                });
            break;

            case 16:
                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 20:
                Tetrez.view.rotate({
                    y: Math.PI / 2
                });
            break;

            case 24:
                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 28:
                Tetrez.view.rotate({
                    x: -Math.PI / 8
                });
            break;

            case 32:
                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 36:
                Tetrez.view.rotate({
                    x: -Math.PI / 8
                });

                Tetrez.field.resetCompletedRows();
            break;
        }

        if (Tetrez.config.isDebugMode) console.log("Rows completed", completedRows);
    };

    var right = function() {
        // Flip left and right between 90° - and 270° to confuse the user less
        if (Tetrez.view.isFrontSideBack()) return moveLeft();
        moveRight();
    };

    var left = function() {
        // Flip left and right between 90° - and 270° to confuse the user less
        if (Tetrez.view.isFrontSideBack()) return moveRight();
        moveLeft();
    };

    var moveRight = function() {
        if (Tetrez.field.canTetrominoMoveRight(tetromino)) {
            tetromino.moveRight();
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    var moveLeft = function() {
        if (Tetrez.field.canTetrominoMoveLeft(tetromino)) {
            tetromino.moveLeft();
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    var moveDown = function() {
        // Add a new block if no one is currently falling and return
        if (!hasFallingTetromino) {
            tetromino = new Tetrez.Tetromino;

            if (Tetrez.field.canPlaceTetromino(tetromino)) {
                Tetrez.field.applyTetromino(tetromino, 1);
                hasFallingTetromino = true;
            } else {
                Tetrez.isGameOver = true;
            }
        } else {
            if (Tetrez.field.canTetrominoMoveBottom(tetromino)) {
                tetromino.moveDown();
                Tetrez.field.applyTetromino(tetromino, 1);
            } else {
                // Cannot move any further, copy tetrominos visible blocks into field
                Tetrez.field.applyTetromino(tetromino, 2);

                // Ignore further keypressing after row has completed
                if (isPressingDown) {
                    resetGameInterval();
                }

                // Bugfix for Hammer.js / touch event,
                // force release, sometimes hangs...
                isPressingDown = false;

                // Tetromino isn't falling anyore
                hasFallingTetromino = false;
            }
        }

        // Quit on game over
        if (Tetrez.isGameOver) {
            if (Tetrez.config.isDebugMode) console.log("Game Over :-(");
            clearInterval(gameInterval);
        }

        Tetrez.view.draw();
    };

    var rotate = function() {
        var rotatedMatrix = Tetrez.field.canTetrominoRotate(tetromino);

        if (rotatedMatrix) {
            tetromino.rotate(rotatedMatrix);
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    Tetrez.controller = {
        init: function() {
            var isKeyRepeating = false;
            var hammer = new Hammer(document.getElementById("canvas"));

            window.addEventListener("keydown", function(e) {
                if (Tetrez.isGameOver) return;

                switch (e.keyCode) {
                    case 37: // Left
                        left();
                    break;

                    case 39: // Right
                        right();
                    break;

                    case 38: // Top
                        rotate();
                    break;

                    case 40: // Bottom
                        if (!isKeyRepeating) {
                            isPressingDown = true;
                        }

                        isKeyRepeating = true;
                    break;

                    case 32: // Space
                    break;
                };
            });

            window.addEventListener("keyup", function(e) {
                if (Tetrez.isGameOver) return;

                switch (e.keyCode) {
                    case 40: // Bottom
                        isPressingDown = false;
                        isKeyRepeating = false;

                        resetGameInterval();
                    break;
                };
            });

            hammer.on("swipe", function(e) {
                switch (e.direction) {
                    case 2: // Left
                        left();
                    break;

                    case 4: // Right
                        right();
                    break;
                }
            });

            hammer.on("tap", function() {
                rotate();
            });

            hammer.on("press", function() {
                isPressingDown = true;
            });

            hammer.on("pressup", function() {
                isPressingDown = false;
                resetGameInterval();
            });

            // Move down while pressing
            setInterval(function() {
                if (isPressingDown) {
                    clearInterval(gameInterval);
                    moveDown();
                }
            }, 75);

            // Start the game
            Tetrez.view.init();
            resetGameInterval();
            moveDown();
        }
    };
}());