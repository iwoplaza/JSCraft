var Blocks = {
    blocks: new Array(0),
    nameToIDMap: new Array(0),
    
    registerBlock: function(p_name, p_block) {
        p_block.unlocalizedName = p_name;
        p_block.id = this.blocks.length;
        this.blocks.push(p_block);
        this.nameToIDMap[p_block.unlocalizedName] = p_block.id;
        
        console.log("Registering block: [" + p_block.id + " | " + p_name + "]");
    },
    
    getBlock: function(p_id) {
        return blocks[p_id];
    },
    
    getBlockByName: function(p_name) {
        return blocks[this.nameToIDMap[p_name]];
    }
};

Blocks.registerBlock("stone", new Block().setDefaultTextureIndex(0));
Blocks.registerBlock("dirt", new Block().setDefaultTextureIndex(1));