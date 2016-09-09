function World(p_name,p_type){
    //Private variables
    var type = p_type;
    
    //Public variables
	this.name = p_name;
	this.chunks = new Array(0);
    this.noiseGenerator = new NoiseGenerator(0);
    this.noiseGeneratorLarge = new NoiseGenerator(1);
    this.currentlyLoadingChunk = undefined;
    this.chunksToLoad = new Array(0);
    this.chunksToRender = new Array(0);
    
	this.getName = function() {
		return this.name;
	}
    
    this.getType = function() {
        return type;
    }
    
	this.renderChunk = function(p_x, p_z) {
        var chunk = this.getChunk(p_x, p_z);
        
        //console.log("Rendering a chunk at: ", [chunk.getX(), chunk.getZ()]);
        
        var blockBuffer = {
            vertices: new Array(0),
            colors: new Array(0),
            texCoords: new Array(0),
            normals: new Array(0)
        };
        
        chunk.rendered = true;
        
        for(var y = 0; y < chunk.layers.length; y++){
            var layer = chunk.layers[y];
            if(layer != undefined){
                for(var x = 0; x < layer.length; x++){
                    for(var z = 0; z < layer[x].length; z++){
                        BlockRenderer.renderBlock(blockBuffer, p_x*Chunk.width+x, y, p_z*Chunk.width+z, this, layer[x][z]);
                    }
                }
            }
        }
        
        if(chunk.layers.length <= 0) {
            chunk.rendered = false;
            console.error("The chunk has 0 layers");
        }
        
        chunk.blockMesh.fillOut(blockBuffer.vertices, blockBuffer.colors, blockBuffer.texCoords, blockBuffer.normals);
	}
    
    this.display = function() {
        var chunkKeys = Object.keys(this.chunks);
        
        useShader("blocks");
        TextureManager.bindTexture(TextureManager.database["res/textures/blocks.png"].textureId);
        if(chunkKeys != undefined) {
            for(var i = 0; i < chunkKeys.length; i++){
                var chunk = this.chunks[chunkKeys[i]];
                if(chunk.rendered) chunk.blockMesh.draw();
            }
        }
    }
    
    this.updateChunksToLoad = function() {
        var chunkKeys = Object.keys(this.chunks);
        this.chunksToLoad = this.getChunkCoordsToLoad();
        
        if(chunkKeys != undefined) {
            for(var i = 0; i < chunkKeys.length; i++){
                var chunk = this.chunks[chunkKeys[i]];
                if(chunk.dirty) {
                    this.chunksToRender.push([chunk.getX(), chunk.getZ()]);
                    chunk.dirty = false;
                }
            }
        }
    }
    
    this.updateChunks = function() {
        this.updateChunksToLoad();
        
        var chunksToLoadKeys = Object.keys(this.chunksToLoad);
        for(var i = 0; i < chunksToLoadKeys.length; i++) {
            var chunk = this.chunksToLoad[chunksToLoadKeys[i]];
            this.loadChunk(chunk[0], chunk[1]);
        }
        
        //console.log("Updating chunks");
        
        this.renderChunks();
    }
    
    this.renderChunks = function() {
        for(var i = 0; i < this.chunksToRender.length; i++) {
            var chunk = this.chunksToRender[i];
            if(chunk != undefined){
                this.renderChunk(chunk[0], chunk[1]);
                this.chunksToRender.splice(i, 1);
            }
            
            //console.log("Rendering chunk", [chunk[0], chunk[1]]);
        }
    }
    
    this.getChunk = function(p_x, p_z) {
        return this.chunks[""+p_x+"x"+p_z];
    }
    
    this.getChunkForBlockCoords = function(p_x, p_z) {
        var chunkX = Math.floor(p_x/Chunk.width);
        var chunkZ = Math.floor(p_z/Chunk.width);
        
        return this.getChunk(chunkX, chunkZ);
    }
    
    this.setChunk = function(p_x, p_z, p_chunk) {
        this.chunks[""+p_x+"x"+p_z] = p_chunk;
    }
    
    this.setBlock = function(p_x, p_y, p_z, p_blockData) {
        if(p_blockData == undefined || p_x == undefined || p_y == undefined || p_z == undefined) return;
        var chunk = this.getChunkForBlockCoords(p_x, p_z);
        if(chunk == undefined) return;
        if(chunk.layers[p_y] == undefined) {
            chunk.layers[p_y] = new Array(0);
            for(var x = 0; x < Chunk.width; x++) {
                chunk.layers[p_y].push(new Array(0));
                for(var z = 0; z < Chunk.width; z++) {
                    chunk.layers[p_y][x].push(0);
                }
            }
        }
        
        chunk.layers[p_y][p_x-chunk.getX()*Chunk.width][p_z-chunk.getZ()*Chunk.width] = p_blockData;
        chunk.dirty = true;
    }
    
    this.getBlock = function(p_x, p_y, p_z) {
        if(p_x == undefined || p_y == undefined || p_z == undefined) return undefined;
        var chunk = this.getChunkForBlockCoords(p_x, p_z);
        if(chunk == undefined) return undefined;
        if(chunk.layers[p_y] == undefined) return undefined;
        
        return chunk.layers[p_y][p_x-chunk.getX()*Chunk.width][p_z-chunk.getZ()*Chunk.width];
    }
    
    this.generateChunk = function(p_x, p_z) {
        var chunk = new Chunk(p_x, p_z);
        this.setChunk(p_x, p_z, chunk);
        
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
        }else if (this.getType() == "DEFAULT"){
            var chunkBlockX = chunk.getX()*Chunk.width;
            var chunkBlockZ = chunk.getZ()*Chunk.width;
            for(var i = 0; i < Chunk.width*Chunk.width; i++){
                var x = i%Chunk.width;
                var z = Math.floor(i/Chunk.width);
                var height = 6+Math.floor(this.noiseGenerator.getNoise((chunkBlockX+x)*0.02, (chunkBlockZ+z)*0.02)*5) + Math.floor(Math.pow(this.noiseGeneratorLarge.getNoise((chunkBlockX+x)*0.005, (chunkBlockZ+z)*0.005), 2)*10);
                for(var y = 0; y < height; y++) {
                    var blockID = y == 0 ? Blocks.nameToIDMap["bedrock"] : y == height-1 ? Blocks.nameToIDMap["grass"] : y > height-5 ? Blocks.nameToIDMap["dirt"] : Blocks.nameToIDMap["stone"];
                    this.setBlock(chunkBlockX+x, y, chunkBlockZ+z, {id: blockID});
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
    
    this.loadChunk = function(p_x, p_z) {
        this.generateChunk(p_x, p_z);
    }
    
    this.unloadChunk = function(p_x, p_z) {
        delete this.chunks[""+p_x+"x"+p_z];
    }
    
    this.getChunkCoordsToLoad = function() {
        var list = new Array(0);
        
        var playerChunkX = Math.floor(Camera.getX()/Chunk.width);
        var playerChunkZ = Math.floor(Camera.getZ()/Chunk.width);
        
        var radius = 3;
        for(var x = -radius; x <= radius; x++) {
            for(var z = -radius; z <= radius; z++) {
                if(this.getChunk(playerChunkX+x, playerChunkZ+z) == undefined)
                    list.push([playerChunkX+x, playerChunkZ+z]);
            }
        }
        
        return list;
    }
}

World.updateChunks = function() {
    World.world.updateChunks();
}