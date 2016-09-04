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

BlockRenderType.renderBox = function(p_buffer, p_x, p_y, p_z, p_w, p_h, p_l, p_textureIndicies) {
    var texturePadding = 0.3/2048;
    for(var i = 0; i < 6; i++) {
        var u = p_textureIndicies[i]%64;
        var v = Math.floor(p_textureIndicies[i]/64);
        p_buffer.texCoords.push((u+0)/64+texturePadding);
        p_buffer.texCoords.push((v+1)/64-texturePadding);
        
        p_buffer.texCoords.push((u+1)/64-texturePadding);
        p_buffer.texCoords.push((v+1)/64-texturePadding);
        
        p_buffer.texCoords.push((u+0)/64+texturePadding);
        p_buffer.texCoords.push((v+0)/64+texturePadding);
        
        p_buffer.texCoords.push((u+1)/64-texturePadding);
        p_buffer.texCoords.push((v+1)/64-texturePadding);
        
        p_buffer.texCoords.push((u+0)/64+texturePadding);
        p_buffer.texCoords.push((v+0)/64+texturePadding);
        
        p_buffer.texCoords.push((u+1)/64-texturePadding);
        p_buffer.texCoords.push((v+0)/64+texturePadding);
    }
    
    var margin = 0.0;
    
    var offsetX = p_x-margin;
    var offsetY = p_y-margin;
    var offsetZ = p_z-margin;
    var width = p_w+margin*2;
    var height = p_h+margin*2;
    var length = p_l+margin*2;
    
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