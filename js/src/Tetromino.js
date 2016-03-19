(function() {
    Tetrez.Tetromino = function() {
        this.matrix = [
            { vector: [0, 0], visible: true },
            { vector: [0, 1], visible: true },
            { vector: [0, 2], visible: false },
            { vector: [1, 0], visible: false },
            { vector: [1, 1], visible: true },
            { vector: [1, 2], visible: true }
            // { vector: [0, 0], visible: true },
            // { vector: [0, 1], visible: true },
            // { vector: [0, 2], visible: true },
            // { vector: [1, 0], visible: false },
            // { vector: [1, 1], visible: true },
            // { vector: [1, 2], visible: false }
        ];

        this.pivot = this.matrix[1].vector;
    };

    Tetrez.Tetromino.prototype.moveDown = function() {
        // Increment y coordinates
        for (var i = 0; i < this.matrix.length; ++i) {
            ++this.matrix[i].vector[0];
        };
    };

    Tetrez.Tetromino.prototype.moveRight = function() {
        // Increment x coordinates
        for (var i = 0; i < this.matrix.length; ++i) {
            ++this.matrix[i].vector[1];
        };
    };

    Tetrez.Tetromino.prototype.moveLeft = function() {
        // Decrement x coordinates
        for (var i = 0; i < this.matrix.length; ++i) {
            --this.matrix[i].vector[1];
        };
    };

    Tetrez.Tetromino.prototype.rotate = function(rotatedMatrix) {
        // Apply rotated coordinates
        for (var i = 0; i < rotatedMatrix.length; ++i) {
            this.matrix[i].vector[0] = rotatedMatrix[i][0];
            this.matrix[i].vector[1] = rotatedMatrix[i][1];
        }
    };
}());