(function() {
    Tetrez.Tetromino = function() {
        this.matrix = [
            [0, 0],
            [0, 1],
            [0, 2],
            [1, 1]
        ];

        this.mesh = (function() {
            var shape = new THREE.Shape();
            shape.moveTo(0, 2);
            shape.lineTo(3, 2);
            shape.lineTo(3, 1);
            shape.lineTo(2, 1);
            shape.lineTo(2, 0);
            shape.lineTo(1, 0);
            shape.lineTo(1, 1);
            shape.lineTo(0, 1);

            var geometry = new THREE.ExtrudeGeometry(shape, {
                amount: 1,
                bevelSize: 0,
                bevelSegments: 0
            });

            // Adjust center point (for correct rotations)
            geometry.translate(0, -1.5, -.5);

            var material = new THREE.MeshBasicMaterial({
                color: 0xffb3ba
            });

            return new THREE.Mesh(geometry, material);
        }());

        // Place cube at top
        this.mesh.position.x = -(Tetrez.config.dimension.x / 2);
        this.mesh.position.y = Tetrez.config.dimension.y / 2 - .5;
    };

    Tetrez.Tetromino.prototype.moveDown = function() {
        // Increment y coordinates
        for (var i = 0; i < this.matrix.length; ++i) {
            ++this.matrix[i][0];
        };

        this.mesh.position.y -= 1;
    };

    // Tetromino.prototype.rotate = function() {
    //     var pivot = $V(this.matrix[1]);

    //     for (var i = 0; i < tetromino.matrix.length; ++i) {
    //         $V(tetromino.matrix[i]).rotate(Math.PI / 2, pivot).round();
    //     }
    // };
}());