function BlockLog() {
    this.getTextureIndicies = function(p_blockData) {
        return [
            13,
            13,
            13,
            13,
            14,
            14
        ];
    }
}

BlockLog.prototype = new Block();