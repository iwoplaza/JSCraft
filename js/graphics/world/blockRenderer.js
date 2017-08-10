var BlockRenderer = {
    renderBlock: function(p_buffer, p_x, p_y, p_z, p_world, p_blockData) {
        if (p_blockData != undefined){
            var block = Blocks.getBlock(p_blockData.id);
            var showFaces = new Array(0);
            var neighbours = [
                p_world.getBlock(p_x, p_y, p_z+1),
                p_world.getBlock(p_x, p_y, p_z-1),
                p_world.getBlock(p_x-1, p_y, p_z),
                p_world.getBlock(p_x+1, p_y, p_z),
                p_world.getBlock(p_x, p_y-1, p_z),
                p_world.getBlock(p_x, p_y+1, p_z)
            ];
            for(var i = 0; i < neighbours.length; i++) {
                showFaces.push(neighbours[i] == undefined || Blocks.getBlock(neighbours[i].id) == undefined || !Blocks.getBlock(neighbours[i].id).isOpaque());
            }
            if (block != undefined){
                if (p_blockData.metadata.modelId!=undefined) console.log(p_blockData);
                if (p_blockData.metadata.modelId!=undefined) BlockRenderType.renderType(p_buffer, block.getRenderType(p_blockData.metadata.modelId), p_x, p_y, p_z,block.getTextureIndicies(p_blockData), showFaces);
                else BlockRenderType.renderType(p_buffer, block.getRenderType(), p_x, p_y, p_z,block.getTextureIndicies(p_blockData), showFaces)
            }
        }
    }
};