function World(p_name){
	this.name = p_name;
	this.chunks = new Array(0);

	this.getName = function() {
		return this.name;
	}

	this.display = function() {
		for (var i=0;i<this.chunks.length;i++){
			for(var y=0;y<this.chunks[i].layers.length;y++){
				//Only god knows what to write here
			}
		}
	}
}