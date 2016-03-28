(function() {
    var blocks = {
        t: {
            matrix: [
                { vector: [0, 0], visible: true },
                { vector: [0, 1], visible: true },
                { vector: [0, 2], visible: true },
                { vector: [1, 0], visible: false },
                { vector: [1, 1], visible: true },
                { vector: [1, 2], visible: false }
            ],
            pivotPosition: 1,
            rotations: [Math.PI / 2],
            color: 0xfde6d0
        },
        s: {
            matrix: [
                { vector: [0, 0], visible: true },
                { vector: [0, 1], visible: true },
                { vector: [0, 2], visible: false },
                { vector: [1, 0], visible: false },
                { vector: [1, 1], visible: true },
                { vector: [1, 2], visible: true }
            ],
            pivotPosition: 4,
            rotations: [Math.PI / 2, Math.PI * 1.5],
            color: 0xfddbb3
        },
        sInverted: {
            matrix: [
                { vector: [0, 0], visible: false },
                { vector: [0, 1], visible: true },
                { vector: [0, 2], visible: true },
                { vector: [1, 0], visible: true },
                { vector: [1, 1], visible: true },
                { vector: [1, 2], visible: false }
            ],
            pivotPosition: 4,
            rotations: [Math.PI / 2, Math.PI * 1.5],
            color: 0xeba69d
        },
        l: {
            matrix: [
                { vector: [0, 0], visible: false },
                { vector: [0, 1], visible: false },
                { vector: [0, 2], visible: true },
                { vector: [1, 0], visible: true },
                { vector: [1, 1], visible: true },
                { vector: [1, 2], visible: true }
            ],
            pivotPosition: 4,
            rotations: [Math.PI / 2],
            color: 0xc7676f
        },
        lInverted: {
            matrix: [
                { vector: [0, 0], visible: true },
                { vector: [0, 1], visible: false },
                { vector: [0, 2], visible: false },
                { vector: [1, 0], visible: true },
                { vector: [1, 1], visible: true },
                { vector: [1, 2], visible: true }
            ],
            pivotPosition: 4,
            rotations: [Math.PI / 2],
            color: 0x8f3b50
        },
        i: {
            matrix: [
                { vector: [0, 0], visible: true },
                { vector: [0, 1], visible: true },
                { vector: [0, 2], visible: true },
                { vector: [0, 3], visible: true }
            ],
            pivotPosition: 1,
            rotations: [Math.PI * 1.5, Math.PI / 2],
            color: 0x441833
        },
        o: {
            matrix: [
                { vector: [0, 0], visible: true },
                { vector: [0, 1], visible: true },
                { vector: [1, 0], visible: true },
                { vector: [1, 1], visible: true }
            ],
            pivotPosition: 0,
            rotations: [],
            color: 0xffffff
        }
    };

    Tetrez.Tetromino = function() {
        // Construct random tetromino
        var blocksKeys = Object.keys(blocks);

        var randomBlockKeyPosition = Math.floor(Math.random() * blocksKeys.length);
        var randomBlockKey = blocksKeys[randomBlockKeyPosition];

        if (Tetrez.config.onlyTTetrominos) randomBlockKey = "t";

        var randomBlock = _.cloneDeep(blocks[randomBlockKey]);

        for (var key in randomBlock) {
            this[key] = randomBlock[key];
        }

        // Place tetromino horizontally centered
        for (var i = 0; i < this.matrix.length; ++i) {
            this.matrix[i].vector[1] = this.matrix[i].vector[1] + Math.round(Tetrez.config.dimension.x / 2) - 2;
        };

        this.currentRotationPointer = 0;
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

        if (this.currentRotationPointer === this.rotations.length - 1) {
            this.currentRotationPointer = 0;
        } else {
            ++this.currentRotationPointer;
        }
    };

    Tetrez.Tetromino.prototype.forEachVisibleBlock = function(callback) {
        for (var i = 0; i < this.matrix.length; ++i) {
            if (!this.matrix[i].visible) continue;

            var y = this.matrix[i].vector[0];
            var x = this.matrix[i].vector[1];

            if (callback(x, y, this.color) === false) break;
        }
    };
}());