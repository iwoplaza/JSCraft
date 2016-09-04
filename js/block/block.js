function Block() {
    this.defaultTextureIndex = 0;
    
    this.setDefaultTextureIndex = function(p_index) {
        this.defaultTextureIndex = p_index;
        return this;
    }
    
    this.getTextureIndicies = function(p_blockData) {
        return [
            this.defaultTextureIndex,
            this.defaultTextureIndex,
            this.defaultTextureIndex,
            this.defaultTextureIndex,
            this.defaultTextureIndex,
            this.defaultTextureIndex
        ];
    },
    
    this.getRenderType = function() {
        return 0;
    }
}

Block.SIDE_FRONT = 0;
Block.SIDE_BACK = 1;
Block.SIDE_LEFT = 2;
Block.SIDE_RIGHT = 3;
Block.SIDE_TOP = 4;
Block.SIDE_BOTTOM = 5;
