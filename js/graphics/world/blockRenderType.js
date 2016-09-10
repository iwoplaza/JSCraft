function BlockRenderType() {
    
}

BlockRenderType.registry = new Array(0);
BlockRenderType.register = function(p_id, p_render) {
    BlockRenderType.registry[p_id] = new BlockRenderType();
    BlockRenderType.registry[p_id].render = p_render;
}

BlockRenderType.renderType = function(p_buffer, p_id, p_x, p_y, p_z, p_textureIndicies, p_showFaces) {
    if(BlockRenderType.registry[p_id] == undefined) return;
    
    BlockRenderType.registry[p_id].render(p_buffer, p_x, p_y, p_z, p_textureIndicies, p_showFaces);
}

BlockRenderType.renderBox = function(p_buffer, p_x, p_y, p_z, p_w, p_h, p_l, p_textureIndicies, p_showFaces) {
    var texturePadding = 0.3/2048;
    
    var margin = 0.0;
    
    var offsetX = p_x-margin;
    var offsetY = p_y-margin;
    var offsetZ = p_z-margin;
    var width = p_w+margin*2;
    var height = p_h+margin*2;
    var length = p_l+margin*2;
    
    var visibleFaces = 0;
    for(var i = 0; i < p_showFaces.length; i++) {
        if(p_showFaces[i]) visibleFaces++;
    }
    
    if(p_showFaces[0]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Front
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ]);
    if(p_showFaces[1]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Back
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX, offsetY+height, offsetZ
    ]);
    if(p_showFaces[2]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Left
        offsetX, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length
    ]);
    if(p_showFaces[3]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Right
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ
    ]);
    if(p_showFaces[4]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Down
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ+length
    ]);
    if(p_showFaces[5]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Up
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ]);
    
    var u = new Array(0);
    var v = new Array(0);
    
    for(var i = 0; i < 6; i++) {
        u.push(p_textureIndicies[i]%64);
        v.push(Math.floor(p_textureIndicies[i]/64));
    }
    if(p_showFaces[0]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Front
        (u[0]+0)/64+texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+0)/64+texturePadding
    ]);
    if(p_showFaces[1]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Back
        (u[1]+0)/64+texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+0)/64+texturePadding
    ]);
    if(p_showFaces[2]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Left
        (u[2]+0)/64+texturePadding, (v[2]+1)/64-texturePadding,
        (u[2]+1)/64-texturePadding, (v[2]+1)/64-texturePadding,
        (u[2]+0)/64+texturePadding, (v[2]+0)/64+texturePadding,
        (u[2]+0)/64+texturePadding, (v[2]+0)/64+texturePadding,
        (u[2]+1)/64-texturePadding, (v[2]+1)/64-texturePadding,
        (u[2]+1)/64-texturePadding, (v[2]+0)/64+texturePadding
    ]);
    if(p_showFaces[3]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Right
        (u[3]+0)/64+texturePadding, (v[3]+1)/64-texturePadding,
        (u[3]+1)/64-texturePadding, (v[3]+1)/64-texturePadding,
        (u[3]+0)/64+texturePadding, (v[3]+0)/64+texturePadding,
        (u[3]+0)/64+texturePadding, (v[3]+0)/64+texturePadding,
        (u[3]+1)/64-texturePadding, (v[3]+1)/64-texturePadding,
        (u[3]+1)/64-texturePadding, (v[3]+0)/64+texturePadding
    ]);
    if(p_showFaces[4]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Down
        (u[4]+0)/64+texturePadding, (v[4]+1)/64-texturePadding,
        (u[4]+1)/64-texturePadding, (v[4]+1)/64-texturePadding,
        (u[4]+0)/64+texturePadding, (v[4]+0)/64+texturePadding,
        (u[4]+0)/64+texturePadding, (v[4]+0)/64+texturePadding,
        (u[4]+1)/64-texturePadding, (v[4]+1)/64-texturePadding,
        (u[4]+1)/64-texturePadding, (v[4]+0)/64+texturePadding
    ]);
    if(p_showFaces[5]) p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        //Up
        (u[5]+1)/64-texturePadding, (v[5]+0)/64+texturePadding,
        (u[5]+0)/64+texturePadding, (v[5]+0)/64+texturePadding,
        (u[5]+0)/64+texturePadding, (v[5]+1)/64-texturePadding,
        (u[5]+1)/64-texturePadding, (v[5]+0)/64+texturePadding,
        (u[5]+0)/64+texturePadding, (v[5]+1)/64-texturePadding,
        (u[5]+1)/64-texturePadding, (v[5]+1)/64-texturePadding
    ]);
    
	for(var i = 0; i < visibleFaces*6; i++) {
		p_buffer.colors.push(1);
		p_buffer.colors.push(1);
        p_buffer.colors.push(1);
        p_buffer.colors.push(1);
	}
    
    if(p_showFaces[0]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ]);
    if(p_showFaces[1]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1
    ]);
    if(p_showFaces[2]) p_buffer.normals.push.apply(p_buffer.normals,  [
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0
    ]);
    if(p_showFaces[3]) p_buffer.normals.push.apply(p_buffer.normals,  [
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0
    ]);
    if(p_showFaces[4]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
    ]);
    if(p_showFaces[5]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ]);
}

BlockRenderType.renderCross = function(p_buffer, p_x, p_y, p_z, p_w, p_h, p_l, p_textureIndicies, p_showFaces){
    var texturePadding = 0.3/2048;
    
    var offsetX = p_x+0.5;
    var offsetY = p_y;
    var offsetZ = p_z+0.5;
    var width = 1/Math.sqrt(2);
    var height = 1;
    p_buffer.vertices.push.apply(p_buffer.vertices,[
        offsetX-width/2,offsetY+height,offsetZ-width/2,
        offsetX+width/2,offsetY+height,offsetZ+width/2,
        offsetX+width/2,offsetY,offsetZ+width/2,
        offsetX-width/2,offsetY,offsetZ-width/2,
        offsetX-width/2,offsetY+height,offsetZ-width/2,
        offsetX+width/2,offsetY,offsetZ+width/2,
    ]);
    p_buffer.vertices.push.apply(p_buffer.vertices,[
        offsetX+width/2,offsetY+height,offsetZ+width/2,
        offsetX-width/2,offsetY+height,offsetZ-width/2,
        offsetX+width/2,offsetY,offsetZ+width/2,
        offsetX-width/2,offsetY+height,offsetZ-width/2,
        offsetX-width/2,offsetY,offsetZ-width/2,
        offsetX+width/2,offsetY,offsetZ+width/2,
    ]);
    
    p_buffer.vertices.push.apply(p_buffer.vertices,[
        offsetX-width/2,offsetY+height,offsetZ+width/2,
        offsetX+width/2,offsetY+height,offsetZ-width/2,
        offsetX+width/2,offsetY,offsetZ-width/2,
        offsetX-width/2,offsetY,offsetZ+width/2,
        offsetX-width/2,offsetY+height,offsetZ+width/2,
        offsetX+width/2,offsetY,offsetZ-width/2,
    ]);
    p_buffer.vertices.push.apply(p_buffer.vertices,[
        offsetX+width/2,offsetY+height,offsetZ-width/2,
        offsetX-width/2,offsetY+height,offsetZ+width/2,
        offsetX+width/2,offsetY,offsetZ-width/2,
        offsetX-width/2,offsetY+height,offsetZ+width/2,
        offsetX-width/2,offsetY,offsetZ+width/2,
        offsetX+width/2,offsetY,offsetZ-width/2,
    ]);
    
    var u = new Array(0);
    var v = new Array(0);
    
    for(var i = 0; i < 4*6; i++) {
        u.push(p_textureIndicies[i]%64);
        v.push(Math.floor(p_textureIndicies[i]/64));
    }
    p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        (u[0]+1)/64-texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+1)/64-texturePadding,
    ]);
    p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        (u[1]+0)/64+texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+1)/64-texturePadding,
    ]);
    
    p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        (u[0]+1)/64-texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+1)/64-texturePadding,
        (u[0]+1)/64-texturePadding, (v[0]+0)/64+texturePadding,
        (u[0]+0)/64+texturePadding, (v[0]+1)/64-texturePadding,
    ]);
    p_buffer.texCoords.push.apply(p_buffer.texCoords, [
        (u[1]+0)/64+texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+0)/64+texturePadding,
        (u[1]+1)/64-texturePadding, (v[1]+1)/64-texturePadding,
        (u[1]+0)/64+texturePadding, (v[1]+1)/64-texturePadding,
    ]);
      
	for(var i = 0; i < 4*6; i++) {
		p_buffer.colors.push(1);
		p_buffer.colors.push(1);
        p_buffer.colors.push(1);
        p_buffer.colors.push(1);
	}
    
    for(var i = 0; i < 4*6; i++) {
		p_buffer.normals.push(0);
		p_buffer.normals.push(1);
        p_buffer.normals.push(0);
	}
}

BlockRenderType.register(0, function(p_buffer, p_x, p_y, p_z, p_textureIndicies, p_showFaces) {
    BlockRenderType.renderBox(p_buffer, p_x, p_y, p_z, 1, 1, 1, p_textureIndicies, p_showFaces);
});
BlockRenderType.register(1, function(p_buffer, p_x, p_y, p_z, p_textureIndicies, p_showFaces) {
    BlockRenderType.renderCross(p_buffer, p_x, p_y, p_z, 1, 1, 1, p_textureIndicies, p_showFaces);
});