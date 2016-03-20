(function() {
    // Init field, multidimensional with types for each tile:
    // 0 = block is free (unoccupied)
    // 1 = block is temporarily occupied (by a moving tetromino)
    // 2 = block is permanently occupied (previous tetrominos)
    var field = [];

    for (var i = 0; i < Tetrez.config.dimension.y; ++i) {
        field[i] = [];

        for (var j = 0; j < Tetrez.config.dimension.x; ++j) {
            field[i][j] = new Tetrez.Tile;
        }
    }

    // Hope not!
    var isGameOver = false;

    var gameInterval = null;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var aspectRatio = width / height;
    var viewSize = Tetrez.config.dimension.y;

    var camera = new THREE.OrthographicCamera(
        -(aspectRatio * viewSize / 2),
        (aspectRatio * viewSize / 2),
        (viewSize / 2),
        -(viewSize / 2)
    );

    camera.position.z = viewSize;

    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();

    // Uncomment to add plane
    // var geometry = new THREE.PlaneGeometry(Tetrez.config.dimension.x, Tetrez.config.dimension.y);
    // var material = new THREE.MeshBasicMaterial({ color: 0xffdfba, side: THREE.DoubleSide });
    // var plane = new THREE.Mesh(geometry, material);
    // scene.add(plane);

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.BoxGeometry(1, 1, 1);

    // Keep references to the lastly rendered meshs blocks
    // so they can be garbage collected later
    var lastMeshes = [];

    var drawTetrominos = function() {
        // Garbage collection (remove all existing meshes from scene)
        for (var i = lastMeshes.length - 1; i >= 0; --i) {
            scene.remove(lastMeshes[i]);
            lastMeshes.splice(lastMeshes.indexOf(i), 1);
        }

        for (var i = 0; i < field.length; ++i) {
            for (var j = 0; j < field[i].length; ++j) {
                if (field[i][j].type !== 0) {
                    var material = new THREE.MeshBasicMaterial({ color: field[i][j].color });
                    var block = new THREE.Mesh(geometry, material);

                    block.translateY((Tetrez.config.dimension.y / 2 - .5) - i);
                    block.translateX(-(Tetrez.config.dimension.x / 2 - .5) + j);

                    scene.add(block);
                    lastMeshes.push(block);
                }
            }
        }
    };

    var threeSixty = Math.PI * 2;
    var step = threeSixty / 1000;

    var render = function() {
        // scene.rotation.y += step;

        // if (scene.rotation.y > threeSixty) {
        //     scene.rotation.y = step;
        // }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    var forEachVisibleTetrominoBlock = function(callback) {
        for (var i = 0; i < tetromino.matrix.length; ++i) {
            if (!tetromino.matrix[i].visible) continue;

            var y = tetromino.matrix[i].vector[0];
            var x = tetromino.matrix[i].vector[1];

            if (callback(x, y, tetromino.color) === false) break;
        }
    };

    var applyTetrominoToField = function(type) {
        // Clear all temporary positions
        for (var i = 0; i < field.length; ++i) {
            for (var j = 0; j < field[i].length; ++j) {
                if (field[i][j].type === 1) {
                    field[i][j].type = 0;
                }
            }
        }

        forEachVisibleTetrominoBlock(function(x, y, color) {
            field[y][x] = new Tetrez.Tile(type, color);
        });
    };

    var isFalling = false;

    var moveRight = function() {
        var canMoveRight = true;

        // Check for every visible block if move to right is possible
        forEachVisibleTetrominoBlock(function(x, y) {
            // Break if next field block is occupied or right end of field has reached
            if (!field[y][x + 1] || field[y][x + 1].type === 2) {
                canMoveRight = false;
                return false;
            }
        });

        if (canMoveRight) {
            tetromino.moveRight();
            applyTetrominoToField(1);
            drawTetrominos();
        }
    };

    var moveLeft = function() {
        var canMoveLeft = true;

        // Check for every visible block if move to left is possible
        forEachVisibleTetrominoBlock(function(x, y) {
            // Break if next field block is occupied or right end of field has reached
            if (!field[y][x - 1] || field[y][x - 1].type === 2) {
                canMoveLeft = false;
                return false;
            }
        });

        if (canMoveLeft) {
            tetromino.moveLeft();
            applyTetrominoToField(1);
            drawTetrominos();
        }
    };

    var moveDown = function() {
        var canMoveToBottom = true;
        var canPlace = true;

        // Add a new block if no one is currently falling and return
        if (!isFalling) {
            tetromino = new Tetrez.Tetromino;

            // Check for every visible block if move to bottom is possible
            forEachVisibleTetrominoBlock(function(x, y) {
                // Break if the tetromino can't be placed
                if (field[y][x].type === 2) {
                    canPlace = false;
                    return false;
                }
            });

            if (canPlace) {
                applyTetrominoToField(1);
                drawTetrominos();
                isFalling = true;
            }
        } else {
            // Check for every visible block if move to bottom is possible
            forEachVisibleTetrominoBlock(function(x, y) {
                // Break if next field block is occupied or bottom end of field has reached
                if (!field[y + 1] || field[y + 1][x].type === 2) {
                    canMoveToBottom = false;
                    return false;
                }
            });

            // Uncomment for debugging
            // field.forEach(function(y) {
            //     console.log(JSON.stringify(y), Math.random());
            // });
            // console.log("---------");

            if (canMoveToBottom) {
                tetromino.moveDown();
                applyTetrominoToField(1);
                drawTetrominos();
            } else {
                // Cannot move any further, copy tetrominos visible blocks into field
                applyTetrominoToField(2);

                // Complete row detection
                for (var i = 0; i < field.length; ++i) {
                    for (var j = 0; j < field[i].length; ++j) {
                        if (field[i][j].type !== 2) break;

                        // Row is complete
                        if (j === field[i].length - 1) {
                            var newRow = [];

                            for (var k = 0; k < Tetrez.config.dimension.x; ++k) {
                                newRow.push(new Tetrez.Tile);
                            }

                            field.splice(i, 1);
                            field.unshift(newRow);
                        }
                    }
                }

                // Tetromino isn't falling anyore
                isFalling = false;
            }
        }

        // Game over if there is a tetromino at the first line
        for (var i = 0; i < field[0].length; ++i) {
            if (field[0][i].type === 2) {
                isGameOver = true;
                break;
            }
        }

        // Game over if the tetromino can't be placed on the field
        if (!canPlace) {
            isGameOver = true;
        }

        // Quit on game over
        if (isGameOver) {
            console.log("Game Over :-(");
            clearInterval(gameInterval);
        }
    };

    var rotate = function() {
        var canRotate = true;
        var pivot = $V(tetromino.matrix[tetromino.pivotPosition].vector);
        var rotatedMatrix = [];

        // Check for every block if rotation is possible
        for (var i = 0; i < tetromino.matrix.length; ++i) {
            var rotatedVector = $V(tetromino.matrix[i].vector).rotate(
                tetromino.rotations[tetromino.currentRotationPointer],
                pivot
            ).round();

            var y = rotatedVector.elements[0];
            var x = rotatedVector.elements[1];

            // Save rotated block for later use (if the whole rotation was successful)
            rotatedMatrix.push(rotatedVector.elements);

            // Break if surrounding tiles are occupied or end of field has reached
            if (!field[y] || !field[y][x] || field[y][x].type === 2) {
                canRotate = false;
                break;
            }
        }

        if (canRotate) {
            tetromino.rotate(rotatedMatrix);
            applyTetrominoToField(1);
            drawTetrominos();
        }
    };

    moveDown();
    gameInterval = setInterval(moveDown, Tetrez.config.initSpeed);
    render();

    var isKeyRepeating = false;

    window.addEventListener("keydown", function(e) {
        if (isGameOver) return;

        // Between 90° - and 270° to confuse the user less
        var isControlsInverted = (scene.rotation.y >= Math.PI / 2 && scene.rotation.y < Math.PI * 1.5);

        switch (e.keyCode) {
            case 37: // Left
                if (isControlsInverted) {
                    moveRight();
                } else {
                    moveLeft();
                }
            break;

            case 39: // Right
                if (isControlsInverted) {
                    moveLeft();
                } else {
                    moveRight();
                }
            break;

            case 38: // Top
                rotate();
            break;

            case 40: // Bottom
                moveDown();

                if (!isKeyRepeating) {
                    clearInterval(gameInterval);
                }

                isKeyRepeating = true;
            break;

            case 32: // Space
            break;
        };
    });

    window.addEventListener("keyup", function(e) {
        if (isGameOver) return;

        switch (e.keyCode) {
            case 37: // Left
            break;

            case 39: // Right
            break;

            case 38: // Top
            break;

            case 40: // Bottom
                gameInterval = setInterval(moveDown, Tetrez.config.initSpeed);
                isKeyRepeating = false;
            break;

            case 32: // Space
            break;
        };
    });
}());