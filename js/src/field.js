(function() {
    Tetrez.field = {
        onRowComplete: function() {},
        onRowsComplete: function() {},

        resetCompletedRows: function() {
            completedRows = 0;
        },

        // Init field, multidimensional array containing tiles:
        field: (function() {
            var field = [];

            for (var i = 0; i < Tetrez.config.dimension.y; ++i) {
                field[i] = [];

                for (var j = 0; j < Tetrez.config.dimension.x; ++j) {
                    field[i][j] = new Tetrez.Tile;
                }
            }

            return field;
        }()),

        applyTetromino: function(tetromino, type) {
            var completedRows = 0;
            
            // Clear all temporary positions
            for (var i = 0; i < this.field.length; ++i) {
                for (var j = 0; j < this.field[i].length; ++j) {
                    if (this.field[i][j].type === 1) {
                        this.field[i][j].type = 0;
                    }
                }
            }

            tetromino.forEachVisibleBlock(function(x, y, color) {
                this.field[y][x] = new Tetrez.Tile(type, color);
            }.bind(this));

            // Complete row detection
            for (var i = 0; i < this.field.length; ++i) {
                for (var j = 0; j < this.field[i].length; ++j) {
                    if (this.field[i][j].type !== 2) break;

                    // Row is complete
                    if (j === this.field[i].length - 1) {
                        var newRow = [];

                        for (var k = 0; k < Tetrez.config.dimension.x; ++k) {
                            newRow.push(new Tetrez.Tile);
                        }

                        this.field.splice(i, 1);
                        this.field.unshift(newRow);

                        this.onRowComplete(++completedRows);
                    }
                }
            }

            if (completedRows) this.onRowsComplete(completedRows);
        },

        canPlaceTetromino: function(tetromino) {
            var canPlaceTetromino = true;

            // Check for every visible block if placing is possible
            tetromino.forEachVisibleBlock(function(x, y) {
                // Break if the tetromino can't be placed
                if (this.field[y][x].type === 2) {
                    canPlaceTetromino = false;
                    return false;
                }
            }.bind(this));

            return canPlaceTetromino;
        },

        canTetrominoMoveRight: function(tetromino) {
            var canMoveRight = true;

            // Check for every visible block if move to right is possible
            tetromino.forEachVisibleBlock(function(x, y) {
                // Break if next field block is occupied or right end of field has reached
                if (!this.field[y][x + 1] || this.field[y][x + 1].type === 2) {
                    canMoveRight = false;
                    return false;
                }
            }.bind(this));

            return canMoveRight;
        },

        canTetrominoMoveLeft: function(tetromino) {
            var canMoveLeft = true;

            // Check for every visible block if move to left is possible
            tetromino.forEachVisibleBlock(function(x, y) {
                // Break if next field block is occupied or right end of field has reached
                if (!this.field[y][x - 1] || this.field[y][x - 1].type === 2) {
                    canMoveLeft = false;
                    return false;
                }
            }.bind(this));

            return canMoveLeft;
        },

        canTetrominoMoveBottom: function(tetromino) {
            var canMoveToBottom = true;

            // Check for every visible block if move to bottom is possible
            tetromino.forEachVisibleBlock(function(x, y) {
                // Break if next field block is occupied or bottom end of field has reached
                if (!this.field[y + 1] || this.field[y + 1][x].type === 2) {
                    canMoveToBottom = false;
                    return false;
                }
            }.bind(this));

            return canMoveToBottom;
        },

        canTetrominoRotate: function(tetromino) {
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
                if (!this.field[y] || !this.field[y][x] || this.field[y][x].type === 2) {
                    canRotate = false;
                    break;
                }
            }

            if (canRotate) return rotatedMatrix;

            return false;
        }
    };
}());