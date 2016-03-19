(function() {
    Tetrez.Tile = function(type, color) {
        this.type = type = typeof type !== "undefined" ? type : 0;
        this.color = color;
    };
}());