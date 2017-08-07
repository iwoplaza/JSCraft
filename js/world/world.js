function World(p_name,p_type){
    //Private variables
    var type = p_type;
    
    //Public variables
	this.name = p_name;
	this.chunks = new Array(0);
    this.noiseGenerator = new NoiseGenerator(0);
    this.noiseGeneratorLarge = new NoiseGenerator(1);
    
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
    
    this.loadChunks = function() {
        for(let x = -1; x <= 1; x++) {
            for(let z = -1; z <= 1; z++) {
                this.loadChunk(x, z);
            }
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
        if(p_x == undefined || p_y == undefined || p_z == undefined) return;
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
    }
    
    this.setBlockAndNotify = function(p_x, p_y, p_z, p_blockData) {
        this.setBlock(p_x, p_y, p_z, p_blockData);
        if(p_x == undefined || p_y == undefined || p_z == undefined) return;
        var chunk = this.getChunkForBlockCoords(p_x, p_z);
        if(chunk == undefined) return;
        this.renderChunk(chunk.getX(), chunk.getZ());
    }
    
    this.getBlock = function(p_x, p_y, p_z) {
        if(p_x == undefined || p_y == undefined || p_z == undefined) return undefined;
        var chunk = this.getChunkForBlockCoords(p_x, p_z);
        if(chunk == undefined) return undefined;
        if(chunk.layers[Math.floor(p_y)] == undefined) return undefined;
        
        return chunk.layers[Math.floor(p_y)][Math.floor(p_x)-chunk.getX()*Chunk.width][Math.floor(p_z)-chunk.getZ()*Chunk.width];
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
                if (Math.floor(this.noiseGenerator.getNoise((chunkBlockX+x),(chunkBlockZ+z))*6) == 0){
                    this.setBlock(chunkBlockX+x, height, chunkBlockZ+z, {id: 22});
                }
                if (Math.floor(this.noiseGenerator.getNoise((chunkBlockX+x),(chunkBlockZ+z))*30) == 0){
                    this.setBlock(chunkBlockX+x, height, chunkBlockZ+z, {id: 17});
                }
                if (Math.floor(this.noiseGenerator.getNoise((chunkBlockX+x),(chunkBlockZ+z))*40) == 0){
                    StructureManager.deployStructure(chunkBlockX+x, height, chunkBlockZ+z, StructureManager.getStructure(1));
                }
            }
        }
    }
    
    this.loadChunk = function(p_x, p_z) {
        this.generateChunk(p_x, p_z);
        this.renderChunk(p_x, p_z);
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
    
    this.isBlockLoaded = function() {
        return true;
    }
    
    this.getCollisionBoxes = function(p_boundingBox)
    {
        var list = new Array(0);
        var minX = Math.floor(p_boundingBox.getMinX()) - 1;
        var maxX = Math.ceil(p_boundingBox.getMaxX()) + 1;
        var minY = Math.floor(p_boundingBox.getMinY()) - 1;
        var maxY = Math.ceil(p_boundingBox.getMaxY()) + 1;
        var minZ = Math.floor(p_boundingBox.getMinZ()) - 1;
        var maxZ = Math.ceil(p_boundingBox.getMaxZ()) + 1;

        for (var currX = minX; currX < maxX; currX++) //k1
        {
            for (var currZ = minZ; currZ < maxZ; currZ++) //l1
            {
                var onSides = (currX != minX && currX != maxX - 1 ? 0 : 1) + (currZ != minZ && currZ != maxZ - 1 ? 0 : 1);

                if (onSides != 2 && this.isBlockLoaded(currX, 64, currZ))
                {
                    for (var currY = minY; currY < maxY; currY++) //j2
                    {
                        var blockData = this.getBlock(currX, currY, currZ);
                        if(blockData != undefined && Blocks.getBlock(blockData.id) != undefined){
                            var blockBounds = Blocks.getBlock(blockData.id).getCollisionBox(blockData);
                            if(blockBounds != undefined) list.push(blockBounds.getAdded(currX, currY, currZ));
                        }
                    }
                }
            }
        }

        return list;
    }
}