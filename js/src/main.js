// TODO
// - Blocks should fall from above the plane

(function() {
    // Init field, multidimensional with "1" values
    var field = [];

    // Hope not!
    var isGameOver = false;

    var gameInterval = null;

    for (var i = 0; i < Tetrez.config.dimension.y; ++i) {
        field[i] = [];

        for (var j = 0; j < Tetrez.config.dimension.x; ++j) {
            field[i][j] = 1;
        }
    }

    // Uncomment for field debugging
    // field = [
    //     [1, 1, 1, 1],
    //     [1, 1, 1, 1],
    //     [1, 1, 1, 1],
    //     [1, 1, 1, 1],
    //     [1, 1, 1, 1],
    //     [1, 1, 1, 1]
    // ];

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

    var isFalling = false;

    var fallDown = function() {
        var canMoveToBottom = true;

        // Add a new block if no one is currently falling
        if (!isFalling) {
            tetromino = new Tetrez.Tetromino;
            scene.add(tetromino.mesh);

            isFalling = true;
        }

        // Check if move to bottom is possible
        for (var j = 0; j < tetromino.matrix.length; ++j) {
            var y = tetromino.matrix[j][0];
            var x = tetromino.matrix[j][1];

            // Break if next field block is occupied or bottom end of field has reached
            if (!field[y + 1] || !field[y + 1][x]) {
                canMoveToBottom = false;
                break;
            }
        }

        if (canMoveToBottom) {
            tetromino.moveDown();
        } else {
            // Cannot move any further, copy last tetromino position into field
            for (var j = 0; j < tetromino.matrix.length; ++j) {
                var y = tetromino.matrix[j][0];
                var x = tetromino.matrix[j][1];

                field[y][x] = 0;
            }

            isFalling = false;

            // Uncomment for debugging
            // field.forEach(function(y) {
            //     console.log(JSON.stringify(y), Math.random());
            // });
            // console.log("---------");

            // Quit on game over
            for (var i = 0; i < field[0].length; ++i) {
                if (field[0][i] === 0) {
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

    fallDown();
    gameInterval = setInterval(fallDown, Tetrez.config.initSpeed);

    render();

    var isKeyRepeating = false;

    window.addEventListener("keydown", function(e) {
        if (isGameOver) return;

        switch (e.keyCode) {
            case 37: // Left
            break;

            case 39: // Right
            break;

            case 38: // Top
            break;

            case 40: // Bottom
                fallDown();

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
                gameInterval = setInterval(fallDown, Tetrez.config.initSpeed);
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