function Chunk(p_x, p_z){
	this.layers = new Array(0);
    var chunkX = p_x;
    var chunkZ = p_z;
    
    this.getX = function() {
        return chunkX;
    }
    
    this.getZ = function() {
        return chunkZ;
    }
}

Chunk.width = 8;
Chunk.height = 256;