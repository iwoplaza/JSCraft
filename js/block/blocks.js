var Blocks = {
    blocks: new Array(0),
    nameToIDMap: new Array(0),
    
    registerBlock: function(p_name, p_block) {
        var id = this.blocks.length;
        if(p_block != undefined){
            p_block.unlocalizedName = p_name;
            p_block.id = id;
        }
        this.blocks.push(p_block);
        this.nameToIDMap[p_name] = id;
        
        console.log("Registering block: [" + id + " | " + p_name + "]");
    },
    
    getBlock: function(p_id) {
        return this.blocks[p_id];
    },
    
    getBlockByName: function(p_name) {
        return this.blocks[this.nameToIDMap[p_name]];
    }
};

Blocks.registerBlock("air", undefined);
Blocks.registerBlock("stone", new Block().setDefaultTextureIndex(0));
Blocks.registerBlock("dirt", new Block().setDefaultTextureIndex(1));