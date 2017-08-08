function Inventory(p_w, p_h, p_x, p_y){
    this.loc = {x: p_x || 0, y: p_y || 0};
    this.slot = new Slot();
    this.slots = undefined;
    this.init(p_w || 1, p_h || 1);
}

Inventory.prototype.init = function(p_width, p_height){
    this.slots = new Array(p_height);
    for (var y=0;y<p_height;y++){
        this.slots[y] = new Array(p_width);
    }
}
Inventory.prototype.getItemInInventory = function(p_x, p_y){
    return this.slots[p_y][p_x];
}
Inventory.prototype.setItemInInventory = function(p_x, p_y, p_itemStack){
    this.slots[p_y][p_x] = p_itemStack;
}
Inventory.prototype.addItemtoInventory = function(p_itemStack){
    for (var y=0;y<this.slots.length;y++){
        if (p_itemStack.count <= 0) break;
        for (var x=0;x<this.slots[y].length;x++){
            if (p_itemStack.count <= 0) break;
            if (this.slots[y][x] == undefined){
                this.slots[y][x] = p_itemStack;
                p_itemStack.count = 0;
            }else
            if (this.slots[y][x].itemID == p_itemStack.itemID){
                p_itemStack.count = this.slots[y][x].add(p_itemStack.count);
            }
        }
    }
}
Inventory.prototype.display = function(p_x, p_y){
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    var scale = ScreenHandler.guiScale;
    GLHelper.saveState();
    GLHelper.scale([this.scale, this.scale, this.scale]);
    
    for (var y=0;y<this.slots.length;y++){
        for (var x=0;x<this.slots[y].length;x++){
                if (this.slots[y][x] != undefined) ItemRenderer.renderGuiItem(this.slots[y][x].getItem(),loc.x+(x*17*scale),loc.y-(y*17*scale), 5);
        }
    }
    GLHelper.loadState();
    this.handleHover(loc.x, loc.y);
}
Inventory.prototype.handleInventory = function(p_x, p_y){
    var scale = ScreenHandler.guiScale;
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    
    var x = Math.floor((VirtualCursor.x-(loc.x-2.5*scale))/(17*scale));
    var y = Math.floor(((loc.y+5.5*scale)-VirtualCursor.y)/(17*scale));
    if (this.slots[y] != undefined && y >= 0 && x >= 0 && x < this.slots[y].length){
        var item = Player.itemInHand;
        Player.itemInHand = this.getItemInInventory(x,y);
        this.setItemInInventory(x, y, item);
    }
    console.log("handleInventory");
}
Inventory.prototype.handleHover = function(p_x, p_y){
    var scale = ScreenHandler.guiScale;
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    
    var x = Math.floor((VirtualCursor.x-(loc.x-2.5*scale))/(17*scale));
    var y = Math.floor(((loc.y+5.5*scale)-VirtualCursor.y)/(17*scale));
    if (this.slots[y] != undefined && y >= 0 && x >= 0 && x < this.slots[y].length){
        this.slot.display((loc.x-2.5*scale)+x*scale*17, (loc.y+5.5*scale)-(y+1)*scale*17, scale);
    }
}