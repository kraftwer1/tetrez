(function() {
    // Tile types:
    // 0 = block is free (unoccupied)
    // 1 = block is temporarily occupied (by a moving tetromino)
    // 2 = block is permanently occupied (previous tetrominos)
    Tetrez.Tile = function(type, color) {
        this.type = type = typeof type !== "undefined" ? type : 0;
        this.color = color;
    };
}());