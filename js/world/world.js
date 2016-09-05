function World(p_name,p_type){
    //Private variables
    var type = p_type;
    
    //Public variables
	this.name = p_name;
	this.chunks = new Array(0);
    this.blockMesh = undefined;
    
	this.getName = function() {
		return this.name;
	}
    
    this.getType = function() {
        return type;
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
    
    this.generateChunk = function(p_x, p_z) {
        var chunk = this.getChunk(p_x, p_z);
        
        chunk.layers = new Array(0);
        
        if (this.getType() == "FLAT"){
            chunk.layers[0] = new Array(Chunk.width);
            for (var x = 0; x < Chunk.width; x++){
                chunk.layers[0][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    chunk.layers[0][x][z] = {id:11};
                }
            }
            for (var y = 1; y < 5; y++){
                chunk.layers[y] = new Array(Chunk.width);
                for (var x = 0; x < Chunk.width; x++){
                    chunk.layers[y][x] = new Array(Chunk.width);
                    for (var z = 0; z < Chunk.width; z++){
                        chunk.layers[y][x][z] = {id:2};
                    }
                }
            }
            chunk.layers[5] = new Array(Chunk.width);
            for (var x = 0; x < Chunk.width; x++){
                chunk.layers[5][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    chunk.layers[5][x][z] = {id:3};
                }
            }
        }else if (this.getType() == "DEBUG"){
            chunk.layers[0] = new Array(Chunk.width);
            for (var x=0; x<Chunk.width;x++){
                chunk.layers[0][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    if (1+z+(x*8)<Blocks.blocks.length){
                        chunk.layers[0][x][z] = {id: (1+z+(x*8))};
                    }else{
                        chunk.layers[0][x][z] = {id:0};
                    }
                }
            }
        }
        /*
            
        //Tree code (Needs rework)
            
            this.layers[12][4][4] = {id:14};
            this.layers[12][3][4] = {id:14};
            this.layers[12][4][3] = {id:14};
            this.layers[12][5][4] = {id:14};
            this.layers[12][4][5] = {id:14};
            for (var x=0;x<3;x++){
                for (var z=0;z<3;z++){
                    this.layers[11][3+x][3+z] = {id:14};
                }
            }
            for (var x=0;x<5;x++){
                for (var z=0;z<5;z++){
                    this.layers[10][2+x][2+z] = {id:14};
                }
            }
            for (var x=0;x<3;x++){
                for (var z=0;z<3;z++){
                    this.layers[9][3+x][3+z] = {id:14};
                }
            }
            this.layers[9][3][2] = {id:14};
            this.layers[9][4][2] = {id:14};
            this.layers[9][5][2] = {id:14};
            this.layers[9][2][3] = {id:14};
            this.layers[9][2][4] = {id:14};
            this.layers[9][2][5] = {id:14};
            this.layers[9][6][5] = {id:14};
            this.layers[9][6][4] = {id:14};
            this.layers[9][6][3] = {id:14};
            this.layers[9][5][6] = {id:14};
            this.layers[9][4][6] = {id:14};
            this.layers[9][3][6] = {id:14};
            for (var i=0;i<6;i++) this.layers[6+i][4][4] = {id:13};
        */
    }
    
    this.generateTerrain = function(){
        this.setChunk(0, 0, new Chunk(0, 0));
        this.generateChunk(0, 0);
	}
    
    this.generateTerrain();
}