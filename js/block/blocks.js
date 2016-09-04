var Blocks = {
    blocks: new Array(0),
    nameToIDMap: new Array(0),
    registryCallbacks: new Array(0),
    blockTypeLoadQuery: new Array(0),
    
    registerCallback: function(p_callback) {
        this.registryCallbacks.push(p_callback);
    },
    
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
    
    preloadBlockTypes: function() {
        for(var i = 0; i < this.blockTypeLoadQuery.length; i++) {
            ResourceManager.registerResourceToLoad();
            
        }
    },
    
    registerBlocks: function() {
        for(var i = 0; i < this.registryCallbacks.length; i++) {
            this.registryCallbacks[i]();
        }
    },
    
    getBlock: function(p_id) {
        return this.blocks[p_id];
    },
    
    getBlockByName: function(p_name) {
        return this.blocks[this.nameToIDMap[p_name]];
    }
};

Blocks.registerCallback(function() {
    Blocks.registerBlock("air", undefined);
    Blocks.registerBlock("stone", new Block().setDefaultTextureIndex(0));
    Blocks.registerBlock("dirt", new Block().setDefaultTextureIndex(1));
});