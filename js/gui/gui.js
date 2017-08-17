var Gui = {
    gui: new Array(0),
    nameToIDMap: new Array(0),
    registryCallbacks: new Array(0),
    guiLoadQueue: new Array(0),
    
    registerCallback: function(p_callback) {
        this.registryCallbacks.push(p_callback);
    },
    
    registerGui: function(p_name, p_gui) {
        var id = this.gui.length;
        if(p_gui != undefined){
            p_gui.unlocalizedName = p_name;
            p_gui.id = id;
        }
        this.gui.push(p_gui);
        this.nameToIDMap[p_name] = id;
        
        console.log("Registering gui: [" + id + " | " + p_name + "]");
    },
    
    addGuiToLoadQueue: function(p_itemType) {
        this.guiLoadQueue.push(p_itemType);
    },
    
    preloadGuis: function() {
        for(var i = 0; i < this.guiLoadQueue.length; i++) {
            ResourceManager.registerResourceToLoad();
            $.getScript( "js/graphics/gui/"+this.guiLoadQueue[i]+".js", function( data, textStatus, jqxhr ) {
                ResourceManager.checkOutResourceLoaded();
            });
        }
    },
    
    registerGuis: function() {
        for(var i = 0; i < this.registryCallbacks.length; i++) {
            this.registryCallbacks[i]();
        }
    },
    
    getGui: function(p_id) {
        return this.gui[p_id];
    },
    
    getGuiByName: function(p_name) {
        return this.gui[this.nameToIDMap[p_name]];
    }
};

Gui.addGuiToLoadQueue("guiHUD");
Gui.addGuiToLoadQueue("guiInventory");

Gui.registerCallback(function() {
    Gui.registerGui("guihud", new GuiHUD());
    Gui.registerGui("inventory", new GuiInventory());
});