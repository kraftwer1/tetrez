(function() {
    var isGameOver = false;
    var gameInterval;
    var sequencerInterval;
    var bassSequencerInterval;
    var hasFallingTetromino = false;
    var isPressingDown = false;
    var nextFullTick;
    var debounceInterval;
    var sequencerStep = 1;
    var fullTickQueue = new Tetrez.Queue;
    var quarterTickQueue = new Tetrez.Queue;
    var playHiHat = false;
    var playBass = false;
    var completedRows = 0;
    var currentSpeed = Tetrez.config.initSpeed;

    var resetGameInterval = function() {
        clearInterval(gameInterval);

        clearInterval(debounceInterval);
        debounceInterval = undefined;

        nextFullTick = function() {
            moveDown();
            startGameInterval();
        };
    };

    Tetrez.field.onRowComplete = function(_completedRows) {
        if (Tetrez.config.isDebugMode) _completedRows *= 4;

        switch (_completedRows) {
            case 4:
                playBass = true;

                Tetrez.view.rotate({
                    x: Math.PI / 8
                });
            break;

            case 8:
                playHiHat = true;

                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 12:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    x: Math.PI / 8
                });
            break;

            case 16:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 20:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    y: Math.PI / 2
                });
            break;

            case 24:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 28:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    x: -Math.PI / 8
                });
            break;

            case 32:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    y: Math.PI / 8
                });
            break;

            case 36:
                createjs.Sound.play("sunrise");

                Tetrez.view.rotate({
                    x: -Math.PI / 8
                });

                Tetrez.field.resetCompletedRows();

                // Game gets faster!
                accelerate();
            break;
        }

        Tetrez.field.onRowsComplete = function(_completedRows) {
            completedRows += _completedRows;

            quarterTickQueue.push(function() {
                createjs.Sound.play("trance");
            });
        };
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
            quarterTickQueue.push(function() {
                createjs.Sound.play("wood");
            });

            tetromino.moveRight();
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    var moveLeft = function() {
        if (Tetrez.field.canTetrominoMoveLeft(tetromino)) {
            quarterTickQueue.push(function() {
                createjs.Sound.play("wood");
            });

            tetromino.moveLeft();
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    var moveDown = function() {
        // Debounce
        if (isPressingDown) {
            if (!debounceInterval) {
                quarterTickQueue.push(function() {
                    createjs.Sound.play("halfbd");

                    clearInterval(debounceInterval);

                    debounceInterval = setInterval(function() {
                        createjs.Sound.play("halfbd");
                    }, currentSpeed / 4);
                });
            }
        } else {
            clearInterval(debounceInterval);
            debounceInterval = undefined;
        }

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

                quarterTickQueue.push(function() {
                    createjs.Sound.play("chord");
                });

                // Ignore further keypressing after tetromino has landed
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
            clearInterval(gameInterval);
            clearInterval(sequencerInterval);
            clearInterval(bassSequencerInterval);

            document.getElementById("score").innerHTML = "Score: " + (completedRows * 10);
            document.getElementById("score").style.visibility = "visible";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("screen").style.display = "flex";

            // This setTimeout() is required to play the animation
            setTimeout(function() {
                document.getElementById("screen").classList.remove("transparent");
            }, 200);
        }

        Tetrez.view.draw();
    };

    var rotate = function() {
        var rotatedMatrix = Tetrez.field.canTetrominoRotate(tetromino);

        if (rotatedMatrix) {
            quarterTickQueue.push(function() {
                createjs.Sound.play("sweep");
            });

            tetromino.rotate(rotatedMatrix);
            Tetrez.field.applyTetromino(tetromino, 1);
            Tetrez.view.draw();
        }
    };

    var startGameInterval = function() {
        clearInterval(gameInterval);
        gameInterval = setInterval(moveDown, currentSpeed);
    };

    var startSequencerInterval = function() {
        clearInterval(sequencerInterval);

        sequencerInterval = setInterval(function() {
            switch (sequencerStep) {
                case 1:
                    if (typeof nextFullTick === "function") {
                        nextFullTick();
                        nextFullTick = undefined;
                    }

                    while (fullTickQueue.getLength()) {
                        fullTickQueue.getCurrent()();
                        fullTickQueue.pop();
                    }

                    createjs.Sound.play("bd");
                    if (playBass) Tetrez.sequencers.bass.unmute();
                break;

                case 2:
                break;

                case 3:
                    if (playHiHat) createjs.Sound.play("hh");
                break;

                case 4:
                break;
            }

            while (quarterTickQueue.getLength()) {
                quarterTickQueue.getCurrent()();
                quarterTickQueue.pop();
            }

            if (sequencerStep === 4) {
                sequencerStep = 1;
            } else {
                ++sequencerStep;
            }
        }, currentSpeed / 4);
    };

    var startBassSequencerInterval = function() {
        clearInterval(bassSequencerInterval);
        bassSequencerInterval = Tetrez.sequencers.bass.init(currentSpeed / 4);
    };

    var accelerate = function() {
        currentSpeed = currentSpeed - 100;

        startGameInterval();
        startSequencerInterval();
        startBassSequencerInterval();
    };

    Tetrez.controller = {
        init: function() {
            var isDownKeyRepeating = false;
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

                    case 38: // Up
                        rotate();
                    break;

                    case 40: // Down
                        if (!isDownKeyRepeating) {
                            isPressingDown = true;
                        }

                        isDownKeyRepeating = true;
                    break;

                    case 32: // Space
                    break;
                };
            });

            window.addEventListener("keyup", function(e) {
                if (Tetrez.isGameOver) return;

                switch (e.keyCode) {
                    case 40: // Down
                        isPressingDown = false;
                        isDownKeyRepeating = false;

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

            // Intro sound
            createjs.Sound.play("sunrise");

            // Sequencers
            startSequencerInterval();
            startBassSequencerInterval();

            Tetrez.view.init();
            resetGameInterval();
        }
    };
}());