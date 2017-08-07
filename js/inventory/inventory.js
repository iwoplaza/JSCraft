function Inventory(p_w, p_h){
    this.slots = undefined;
    this.init = function(p_width, p_height){
        this.slots = new Array(p_height);
        for (var y=0;y<p_height;y++){
            this.slots[y] = new Array(p_width);
        }
    }
    this.getItemInInventory = function(p_x, p_y){
        return this.slots[p_y][p_x];
    }
    this.setItemInInventory = function(p_x, p_y, p_itemStack){
        this.slots[p_y][p_x] = p_itemStack;
    }
    this.addItemtoInventory = function(p_itemStack){
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
    this.init(p_w, p_h);
}