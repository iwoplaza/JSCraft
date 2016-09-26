var Items = {
    items: new Array(0),
    nameToIDMap: new Array(0),
    registryCallbacks: new Array(0),
    itemTypeLoadQueue: new Array(0),
    
    registerCallback: function(p_callback) {
        this.registryCallbacks.push(p_callback);
    },
    
    registerItem: function(p_name, p_item) {
        var id = this.items.length;
        if(p_item != undefined){
            p_item.unlocalizedName = p_name;
            p_item.id = id;
        }
        this.items.push(p_item);
        this.nameToIDMap[p_name] = id;
        
        console.log("Registering item: [" + id + " | " + p_name + "]");
    },
    
    addItemTypeToLoadQueue: function(p_itemType) {
        this.itemTypeLoadQueue.push(p_itemType);
    },
    
    preloadItemTypes: function() {
        for(var i = 0; i < this.itemTypeLoadQueue.length; i++) {
            ResourceManager.registerResourceToLoad();
            $.getScript( "js/item/"+this.itemTypeLoadQueue[i]+".js", function( data, textStatus, jqxhr ) {
                ResourceManager.checkOutResourceLoaded();
            });
        }
    },
    
    registerItems: function() {
        for(var i = 0; i < this.registryCallbacks.length; i++) {
            this.registryCallbacks[i]();
        }
    },
    
    getItem: function(p_id) {
        return this.items[p_id];
    },
    
    getItemByName: function(p_name) {
        return this.items[this.nameToIDMap[p_name]];
    }
};

Items.registerCallback(function() {
    Items.registerItem("sword", new Item().setDefaultName("sword").setDefaultModel("sword"));
    Items.registerItem("pickaxe", new Item().setDefaultName("pickaxe").setDefaultModel("pickaxe"));
    Items.registerItem("shovel", new Item().setDefaultName("pickaxe").setDefaultModel("shovel"));
});