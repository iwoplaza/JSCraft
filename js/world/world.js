function World(p_name,p_type){
	this.name = p_name;
    this.type = p_type;
	this.chunks = new Array(0);
    this.blockMesh = undefined;
    
	this.getName = function() {
		return this.name;
	}

	this.renderBlocks = function() {
        var chunkKeys = Object.keys(this.chunks);
        console.dir(chunkKeys);
        
        var blockBuffer = {
            vertices: new Array(0),
            colors: new Array(0),
            texCoords: new Array(0),
            normals: new Array(0)
        };
        
        if(chunkKeys != undefined) {
            for(var i = 0; i < chunkKeys.length; i++){
                var chunk = this.chunks[chunkKeys[i]];
                for(var y = 0; y < chunk.layers.length; y++){
                    var layer = chunk.layers[y];
                    for(var x = 0; x < layer.length; x++){
                        for(var z = 0; z < layer[x].length; z++){
                            BlockRenderer.renderBlock(blockBuffer, x, y, z, layer[x][z]);
                        }
                    }
                }
            }
        }
        
        this.blockMesh.fillOut(blockBuffer.vertices, blockBuffer.colors, blockBuffer.texCoords, blockBuffer.normals);
	}
    
    this.display = function() {
        TextureManager.bindTexture(TextureManager.database["res/textures/blocks.png"].textureId);
        this.blockMesh.draw();
    }
    
    this.getChunk = function(p_x, p_z) {
        return this.chunks[""+p_x+"x"+p_z];
    }
    
    this.setChunk = function(p_x, p_z, p_chunk) {
        this.chunks[""+p_x+"x"+p_z] = p_chunk;
    }
    
    this.setChunk(0, 0, new Chunk(this.type));
}