function BlockLeaves() {
    this.isOpaque = function() {
        return false;
    }
}

BlockLeaves.prototype = new Block();