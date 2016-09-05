function Chunk(w_type){
	this.layers = new Array(0);
	this.generateTerrain = function(_type){
        this.layers = new Array(0);
		if (_type == "FLAT"){
            //FlatWorld xD
            this.layers[0] = new Array(Chunk.width);
            for (var x = 0; x < Chunk.width; x++){
                this.layers[0][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    this.layers[0][x][z] = {id:11};
                }
            }
            for (var y = 1; y < 5; y++){
                this.layers[y] = new Array(Chunk.width);
                for (var x = 0; x < Chunk.width; x++){
                    this.layers[y][x] = new Array(Chunk.width);
                    for (var z = 0; z < Chunk.width; z++){
                        this.layers[y][x][z] = {id:2};
                    }
                }
            }
            this.layers[5] = new Array(Chunk.width);
            for (var x = 0; x < Chunk.width; x++){
                this.layers[5][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    this.layers[5][x][z] = {id:3};
                }
            }
        }else
        if (_type == "DEBUG"){
            this.layers[0] = new Array(Chunk.width);
            for (var x=0; x<Chunk.width;x++){
                this.layers[0][x] = new Array(Chunk.width);
                for (var z = 0; z < Chunk.width; z++){
                    if (1+z+(x*8)<Blocks.blocks.length){
                        this.layers[0][x][z] = {id: (1+z+(x*8))};
                    }else{
                        this.layers[0][x][z] = {id:0};
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
    
    this.generateTerrain(w_type);
}
Chunk.width = 8;
Chunk.height = 256;