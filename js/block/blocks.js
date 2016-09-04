var Blocks = {
    blocks: new Array(0),
    nameToIDMap: new Array(0),
    registryCallbacks: new Array(0),
    blockTypeLoadQueue: new Array(0),
    
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
    
    addBlockTypeToLoadQueue: function(p_blockType) {
        this.blockTypeLoadQueue.push(p_blockType);
    },
    
    preloadBlockTypes: function() {
        for(var i = 0; i < this.blockTypeLoadQueue.length; i++) {
            ResourceManager.registerResourceToLoad();
            $.getScript( "js/block/"+this.blockTypeLoadQueue[i]+".js", function( data, textStatus, jqxhr ) {
                ResourceManager.checkOutResourceLoaded();
            });
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

Blocks.addBlockTypeToLoadQueue("blockGrass");

Blocks.registerCallback(function() {
    Blocks.registerBlock("air", undefined);
    Blocks.registerBlock("stone", new Block().setDefaultTextureIndex(0));
    Blocks.registerBlock("dirt", new Block().setDefaultTextureIndex(1));
    Blocks.registerBlock("grass", new BlockGrass().setDefaultTextureIndex(2));
    
    var some = new BlockGrass().setDefaultTextureIndex(2);
    console.dir(some);
});