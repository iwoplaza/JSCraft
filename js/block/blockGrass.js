function BlockGrass() {
    this.getTextureIndicies = function(p_blockData) {
        return [
            2,
            2,
            2,
            2,
            1,
            3
        ];
    }
}

BlockGrass.prototype = new Block();