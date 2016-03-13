// TODO
// - Blocks should fall from above the plane

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

    var geometry = new THREE.PlaneGeometry(Tetrez.config.dimension.x, Tetrez.config.dimension.y);
    var material = new THREE.MeshBasicMaterial({ color: 0xffdfba, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);

    var scene = new THREE.Scene();
    scene.add(plane);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffba);

    document.body.appendChild(renderer.domElement);

    var render = function() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    };

    var forEachVisibleTetrominoBlock = function(callback) {
        for (var i = 0; i < tetromino.matrix.length; ++i) {
            if (!tetromino.matrix[i].visible) continue;

            var y = tetromino.matrix[i].vector[0];
            var x = tetromino.matrix[i].vector[1];

            if (callback(x, y) === false) break;
        }
    };

    var applyTetrominoToField = function(type) {
        forEachVisibleTetrominoBlock(function(x, y) {
            field[y][x] = new Tetrez.Tile(type);
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
            applyTetrominoToField(1);
            tetromino.moveRight();
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
            applyTetrominoToField(1);
            tetromino.moveLeft();
        }
    };

    var moveDown = function() {
        var canMoveToBottom = true;

        // Add a new block if no one is currently falling
        if (!isFalling) {
            tetromino = new Tetrez.Tetromino;
            scene.add(tetromino.mesh);

            isFalling = true;
        }

        // Check for every visible block if move to bottom is possible
        forEachVisibleTetrominoBlock(function(x, y) {
            // Break if next field block is occupied or bottom end of field has reached
            if (!field[y + 1] || field[y + 1][x].type === 2) {
                canMoveToBottom = false;
                return false;
            }
        });

        if (canMoveToBottom) {
            applyTetrominoToField(1);
            tetromino.moveDown();
        } else {
            // Cannot move any further, copy tetrominos visible blocks into field
            applyTetrominoToField(2);

            isFalling = false;

            // Uncomment for debugging
            // field.forEach(function(y) {
            //     console.log(JSON.stringify(y), Math.random());
            // });
            // console.log("---------");

            // Quit on game over
            for (var i = 0; i < field[0].length; ++i) {
                if (field[0][i].type === 2) {
                    isGameOver = true;
                    break;
                }
            }

            if (isGameOver) {
                console.log("Game Over :-(");
                clearInterval(gameInterval);
            }
        }
    };

    var rotate = function() {
        var canRotate = true;
        var pivot = $V(tetromino.matrix[1].vector);
        var rotatedMatrix = [];

        // Check for every block if rotation is possible
        for (var i = 0; i < tetromino.matrix.length; ++i) {
            var rotatedVector = $V(tetromino.matrix[i].vector).rotate(Math.PI / 2, pivot).round();

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
            applyTetrominoToField(1);
            tetromino.rotate(rotatedMatrix);
        }
    };

    moveDown();
    gameInterval = setInterval(moveDown, Tetrez.config.initSpeed);

    render();

    var isKeyRepeating = false;

    window.addEventListener("keydown", function(e) {
        if (isGameOver) return;

        switch (e.keyCode) {
            case 37: // Left
                moveLeft();
            break;

            case 39: // Right
                moveRight();
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

    // Uncomment for 3D debugging
    // window.addEventListener("keydown", function(e) {
    //     switch (e.keyCode) {
    //         case 37: // Left
    //             scene.rotation.y -= (Math.PI / 30);
    //         break;

    //         case 39: // Right
    //             scene.rotation.y += (Math.PI / 30);
    //         break;
    //     };
    // });
}());