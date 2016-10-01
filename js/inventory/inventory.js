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
    this.init(p_w, p_h);
}