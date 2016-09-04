var BlockRenderer = {
    renderBlock: function(p_buffer, p_x, p_y, p_z, p_blockData) {
        
        if (p_blockData != undefined){
            var block = Blocks.getBlock(p_blockData.id);
            if (block != undefined){
                BlockRenderType.renderType(p_buffer, block.getRenderType(), p_x, p_y, p_z, block.getTextureIndicies(p_blockData));
            }
        }
    }
};