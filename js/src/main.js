(function() {
    var Block = function() {
        this.matrix = [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 1]
        ];
    };

    Block.prototype.moveDown = function() {
        // Increment y coordinates
        for (var i = 0; i < this.matrix.length; ++i) {
            ++this.matrix[i][0];
        };
    };

    // Block.prototype.rotate = function() {
    //     var pivot = $V(this.matrix[1]);

    //     for (var i = 0; i < block.matrix.length; ++i) {
    //         $V(block.matrix[i]).rotate(Math.PI / 2, pivot).round();
    //     }
    // };

    var block = new Block;

    var field = [
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true]
    ];

    for (var i = 0; i < field.length; ++i) {
        var canMoveToBottom = true;

        // Check if move to bottom is possible
        for (var j = 0; j < block.matrix.length; ++j) {
            var y = block.matrix[j][0];
            var x = block.matrix[j][1];

            // Break if next block is occupied or bottom end of field has reached
            if (!field[y + 1] || !field[y + 1][x]) {
                canMoveToBottom = false;
                break;
            }
        }

        if (canMoveToBottom) {
            block.moveDown();
        } else {
            // Cannot move any further, copy last block position into field
            for (var j = 0; j < block.matrix.length; ++j) {
                var y = block.matrix[j][0];
                var x = block.matrix[j][1];

                field[y][x] = false;
            }

            console.log(field);

            break;
        }
    }
}());

// (function() {
//     var width = window.innerWidth;
//     var height = window.innerHeight;
//     var aspectRatio = width / height;
//     var viewSize = 20;

//     var field = {
//         x: 10,
//         y: 18
//     };

//     var camera = new THREE.OrthographicCamera(
//         -(aspectRatio * viewSize / 2),
//         (aspectRatio * viewSize / 2),
//         (viewSize / 2),
//         -(viewSize / 2)
//     );

//     camera.position.z = viewSize;

//     var blocks = {
//         t: (function() {
//             var shape = new THREE.Shape();
//             shape.moveTo(0, 0);
//             shape.lineTo(0, 1);
//             shape.lineTo(1, 1);
//             shape.lineTo(1, 2);
//             shape.lineTo(2, 2);
//             shape.lineTo(2, 1);
//             shape.lineTo(3, 1);
//             shape.lineTo(3, 0);

//             var geometry = new THREE.ExtrudeGeometry(shape, {
//                 amount: 1,
//                 bevelSize: 0,
//                 bevelSegments: 0
//             });

//             // Adjust center point (for correct rotations)
//             geometry.translate(-1.5, -.5, -.5);

//             var material = new THREE.MeshBasicMaterial({
//                 color: 0xffb3ba
//             });

//             return new THREE.Mesh(geometry, material);
//         }())
//     };

//     var geometry = new THREE.PlaneGeometry(field.x, field.y);
//     var material = new THREE.MeshBasicMaterial({ color: 0xffdfba, side: THREE.DoubleSide });
//     var plane = new THREE.Mesh(geometry, material);

//     var scene = new THREE.Scene();
//     scene.add(plane);
//     scene.add(blocks.t);

//     var renderer = new THREE.WebGLRenderer();
//     renderer.setSize(width, height);
//     renderer.setClearColor(0xffffba);

//     var render = function() {
//         requestAnimationFrame(render);
//         renderer.render(scene, camera);
//     };

//     // Place cube at top
//     blocks.t.position.y = 7.5;
//     blocks.t.position.x -= .5;

//     document.body.appendChild(renderer.domElement);

//     var moveInterval = setInterval(function() {
//         if (blocks.t.position.y === -8.5) {
//             return clearInterval(moveInterval);
//         }

//         if (canMoveBottom()) {
//             blocks.t.position.y -= 1;
//         }
//     }, 500);

//     var canMoveBottom = function() {
//         return true;
//     };

//     window.addEventListener("keydown", function(e) {
//         switch (e.keyCode) {
//             case 37: // left
//                 blocks.t.position.x -= 1;
//             break;

//             case 39: // right
//                 blocks.t.position.x += 1;
//             break;

//             case 38: // top
//                 blocks.t.rotation.z += Math.PI / 2;
//             break;

//             case 40: // bottom
//                 blocks.t.rotation.z -= Math.PI / 2;
//             break;

//             case 32: // space
//                 if (canMoveBottom()) {
//                     blocks.t.position.y = -8.5;
//                 }
//             break;
//         };
//     });

//     render();
// }());