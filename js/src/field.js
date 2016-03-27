(function() {
    // Init field, multidimensional array containing tiles:
    Tetrez.field = [];

    for (var i = 0; i < Tetrez.config.dimension.y; ++i) {
        Tetrez.field[i] = [];

        for (var j = 0; j < Tetrez.config.dimension.x; ++j) {
            Tetrez.field[i][j] = new Tetrez.Tile;
        }
    }
}());