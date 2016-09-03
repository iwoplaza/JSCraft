function Chunk(){
	this.layers = new Array(0);
	this.generateTerrain = function(){
		//FlatWorld xD
		for (var x=0;x<Chunk.width;x++){
			for (var z=0;z<Chunk.width;z++){
				this.layers[0][x][z] = {id:7}
			}
		}
		for (var y=1;y<5;y++){
			for (var x=0;x<Chunk.width;x++){
				for (var z=0;z<Chunk.width;z++){
					this.layers[y][x][z] = {id:3}
				}
			}
		}
		for (var x=0;x<Chunk.width;x++){
			for (var z=0;z<Chunk.width;z++){
				this.layers[5][x][z] = {id:2}
			}
		}
	}
}
Chunk.width = 8;
Chunk.height = 256;