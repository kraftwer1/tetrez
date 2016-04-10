(function() {
    Tetrez.Queue = function() {
        var queue = [];
        var lastPopped = null;

        this.push = function(element) {
            queue.unshift(element);
        };

        this.pop = function() {
            if (queue.length) {
                lastPopped = queue.pop();
            }
        };

        this.getCurrent = function() {
            return queue[queue.length - 1];
        };

        this.getLastPopped = function() {
            return lastPopped;
        };
    };
}());