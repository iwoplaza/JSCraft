function BlockFurnace() {
    this.getTextureIndicies = function(p_blockData) {
        return [
            this.defaultTextureIndex,
            28,
            28,
            28,
            28,
            27
        ];
    }
}

BlockFurnace.prototype = new Block();