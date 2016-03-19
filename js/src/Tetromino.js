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
            color: 0xf16745
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
            color: 0xffc65d
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
            color: 0xffc65d
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
            color: 0x7bc8a4
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
            color: 0x7bc8a4

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
            color: 0x4cc3d9
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
            color: 0x93648d
        }
    };

    Tetrez.Tetromino = function() {
        // Construct random tetromino
        var blocksKeys = Object.keys(blocks);
        var randomBlockKey = Math.floor(Math.random() * blocksKeys.length);
        var randomBlock = _.cloneDeep(blocks[blocksKeys[randomBlockKey]]);

        for (var key in randomBlock) {
            this[key] = randomBlock[key];
        }

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
}());