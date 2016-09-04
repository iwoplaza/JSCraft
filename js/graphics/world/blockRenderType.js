function BlockRenderType() {
    
}

BlockRenderType.registry = new Array(0);
BlockRenderType.register = function(p_id, p_render) {
    BlockRenderType.registry[p_id] = new BlockRenderType();
    BlockRenderType.registry[p_id].render = p_render;
}

BlockRenderType.renderType = function(p_buffer, p_id, p_x, p_y, p_z, p_textureIndicies) {
    if(BlockRenderType.registry[p_id] == undefined) return;
    
    BlockRenderType.registry[p_id].render(p_buffer, p_x, p_y, p_z, p_textureIndicies);
}

BlockRenderType.renderBox = function(p_buffer, offsetX, offsetY, offsetZ, width, height, length, p_textureIndicies) {
    for(var i = 0; i < 6; i++) {
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
        
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
        
        p_buffer.texCoords.push((p_textureIndicies[i]+1)/64);
        p_buffer.texCoords.push((p_textureIndicies[i]+0)/64);
    }
    
    p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Front
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        
        //Back
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        
        //Left
        offsetX, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        
        //Right
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        
        //Down
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        
        //Up
        offsetX, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ]);
	for(var i = 0; i < 6*6; i++) {
		p_buffer.colors.push(1);
		p_buffer.colors.push(1);
        p_buffer.colors.push(1);
        p_buffer.colors.push(1);
	}
    
    p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ]);
}

BlockRenderType.register(0, function(p_buffer, p_x, p_y, p_z, p_textureIndicies) {
    BlockRenderType.renderBox(p_buffer, p_x, p_y, p_z, 1, 1, 1, p_textureIndicies);
});