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
Inventory.prototype.stackItemToInventory = function(p_itemStack){
    if (!p_itemStack) return undefined;
    for (var y=0;y<this.slots.length && p_itemStack.count > 0;y++){
        for (var x=0;x<this.slots[y].length && p_itemStack.count > 0;x++){
            if (p_itemStack.count <= 0) break;
            if (this.slots[y][x] != undefined){
                if (this.slots[y][x].itemID == p_itemStack.itemID){
                    p_itemStack.count = this.slots[y][x].add(p_itemStack.count);
                }
            }
        }
    }
    return (p_itemStack.count==0?undefined:p_itemStack);
}
Inventory.prototype.addItemToInventory = function(p_itemStack){
    if (!p_itemStack) return undefined;
    for (var y=0;y<this.slots.length && p_itemStack.count > 0;y++){
        for (var x=0;x<this.slots[y].length && p_itemStack.count > 0;x++){
            if (this.slots[y][x] == undefined){
                this.slots[y][x] = p_itemStack;
                return undefined;
            }
        }
    }
    return p_itemStack;
}
Inventory.prototype.display = function(p_x, p_y, p_hover){
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    var scale = ScreenHandler.guiScale;
    GLHelper.saveState();
    GLHelper.scale([this.scale, this.scale, this.scale]);
    
    for (var y=0;y<this.slots.length;y++){
        for (var x=0;x<this.slots[y].length;x++){
            if (this.slots[y][x] != undefined) this.slots[y][x].display(loc.x+(x*17*scale),loc.y-(y*17*scale));
        }
    }
    GLHelper.loadState();
    if (!p_hover) this.handleHover(loc.x, loc.y);
}
Inventory.prototype.handleInventory = function(p_x, p_y, p_button){
    var scale = ScreenHandler.guiScale;
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    var button = p_button || 0;
    
    var x = Math.floor((VirtualCursor.x-(loc.x-2.5*scale))/(17*scale));
    var y = Math.floor(((loc.y+5.5*scale)-VirtualCursor.y)/(17*scale));
    if (this.slots[y] != undefined && y >= 0 && x >= 0 && x < this.slots[y].length){
        var item = Player.itemInHand;
        if (button == 0){
            if (Player.itemInHand && this.slots[y][x]){
                if (Player.itemInHand.itemID == this.slots[y][x].itemID){
                    Player.itemInHand.count = this.slots[y][x].add(Player.itemInHand.count);
                    if (Player.itemInHand.count == 0) Player.itemInHand = undefined;
                }else{
                   Player.itemInHand = this.slots[y][x];
                    this.setItemInInventory(x, y, item); 
                }
            }else{
                Player.itemInHand = this.slots[y][x];
                this.setItemInInventory(x, y, item);
            }
        }else
        if (button == 2){
            if (Player.itemInHand && this.slots[y][x]){
                if (Player.itemInHand.itemID == this.slots[y][x].itemID){
                    this.slots[y][x].add(Player.itemInHand.sub(1));
                    if (Player.itemInHand.count == 0) Player.itemInHand = undefined;
                }
            }else{
                if (Player.itemInHand && !this.slots[y][x]){
                    this.slots[y][x] = new ItemStack(Player.itemInHand.itemID,Player.itemInHand.sub(1));
                    if (Player.itemInHand.count == 0) Player.itemInHand = undefined;
                }else
                if (!Player.itemInHand && this.slots[y][x]){
                    Player.itemInHand = new ItemStack(this.slots[y][x].itemID,this.slots[y][x].sub(Math.ceil(this.slots[y][x].count/2)));
                    if (this.slots[y][x].count == 0) this.slots[y][x] = undefined;
                }
            }
        }
    }
    console.log("handleInventory",button);
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