var StructureManager = {
    structure: new Array(0),
    nameToIDMap: new Array(0),
    registryCallbacks: new Array(0),
    structureTemplateLoadQueue: new Array(0),
    
    registerStructure: function(p_structure,p_name){
        var id = this.structure.length;
        if(p_structure != undefined){
            p_structure.unlocalizedName = p_name;
            p_structure.id = id;
        }
        this.structure.push(p_structure);
        this.nameToIDMap[p_name] = id;
        
        console.log("Registering structure: [" + id + " | " + p_name + "]");
    },
    
    registerCallback: function(p_callback) {
        this.registryCallbacks.push(p_callback);
    },
    
    addStructureTemplateToLoadQueue: function(p_blockType) {
        this.structureTemplateLoadQueue.push(p_blockType);
    },
    
    preloadStructureTemplates: function() {
        for(var i = 0; i < this.structureTemplateLoadQueue.length; i++) {
            ResourceManager.registerResourceToLoad();
            $.getScript( "js/world/structures/"+this.structureTemplateLoadQueue[i]+".js", function( data, textStatus, jqxhr ) {
                ResourceManager.checkOutResourceLoaded();
            });
        }
    },
    
    registerStructures: function() {
        for(var i = 0; i < this.registryCallbacks.length; i++) {
            this.registryCallbacks[i]();
        }
    },
    
    getStructure: function(p_id) {
        return this.structure[p_id];
    },
    
    getStructureByName: function(p_name) {
        return this.structure[this.nameToIDMap[p_name]];
    },
    
    deployStructure: function(p_x,p_y,p_z,p_struct){
        if (p_struct==undefined) return;
        for (var y=0;y<p_struct.struct.length;y++){
            console.log("Y: "+y+" len: "+p_struct.struct.length);
            for (var x=0;x<p_struct.struct[y].length;x++){
                console.log("X: "+x+" len: "+p_struct.struct[y].length);
                for (var z=0;z<p_struct.struct[y][x].length;z++){
                    console.log("Z: "+z+" len: "+p_struct.struct[y][x].length);
                    if (p_struct.struct[y][x][z]) World.world.setBlock(p_x+x+p_struct.xStart, p_y+y+p_struct.yStart, p_z+z+p_struct.zStart, {id: p_struct.struct[y][x][z]});
                }
            }
        }
    }
};
StructureManager.addStructureTemplateToLoadQueue("smallTree");

Blocks.registerCallback(function() {
    StructureManager.registerStructure(undefined,"null");
    StructureManager.registerStructure(smallTree,"smallTree");
});