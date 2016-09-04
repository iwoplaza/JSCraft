function Block() {
    this.defaultTextureIndex = 0;
    
    this.setDefaultTextureIndex = function(p_index) {
        this.defaultTextureIndex = p_index;
        return this;
    }
    
    this.getTextureIndex = function(p_metadata, p_side) {
        return this.defaultTextureIndex;
    },
    
    this.getRenderType = function() {
        return 0;
    }
}

Block.SIDE_NONE = 0;
Block.SIDE_TOP = 1;
Block.SIDE_BOTTOM = 2;
Block.SIDE_RIGHT = 3;
Block.SIDE_LEFT = 4;
Block.SIDE_FRONT = 5;
Block.SIDE_BACK = 6;