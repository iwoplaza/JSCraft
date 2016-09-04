function Chunk(){
	this.layers = new Array(0);
	this.generateTerrain = function(){
		//FlatWorld xD
        this.layers = new Array(0);
        
        this.layers[0] = new Array(Chunk.width);
		for (var x = 0; x < Chunk.width; x++){
            this.layers[0][x] = new Array(Chunk.width);
			for (var z = 0; z < Chunk.width; z++){
				this.layers[0][x][z] = {id:1};
			}
		}
		for (var y = 1; y < 5; y++){
            this.layers[y] = new Array(Chunk.width);
			for (var x = 0; x < Chunk.width; x++){
                this.layers[y][x] = new Array(Chunk.width);
				for (var z = 0; z < Chunk.width; z++){
					this.layers[y][x][z] = {id:3};
				}
			}
		}
        this.layers[5] = new Array(Chunk.width);
		for (var x = 0; x < Chunk.width; x++){
            this.layers[5][x] = new Array(Chunk.width);
			for (var z = 0; z < Chunk.width; z++){
				this.layers[5][x][z] = {id:2};
			}
		}
	}
    
    this.generateTerrain();
}
Chunk.width = 8;
Chunk.height = 256;