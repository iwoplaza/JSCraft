function ItemStack(p_itemId, p_count) {
    this.itemID = p_itemId;
    this.count = p_count || 1;
    this.add = function(p_count){
        this.count += p_count;
        var ret = Math.max(0, this.count-64);
        this.count = Math.min(this.count, 64);
        return ret;
    }
    this.sub = function(p_count){
        var tmp = this.count;
        this.count -= p_count;
        var ret = Math.max(0,tmp-this.count);
        this.count = Math.max(0,this.count);
        return ret;
    }
    this.getItem = function(){
        return Items.getItem(this.itemID);
    }
    this.display = function(p_x, p_y){
        ItemRenderer.renderGuiItem(this.getItem(), p_x, p_y, 5);
        Font.drawGuiText(this.count+"", "normal", [p_x+(10*ScreenHandler.guiScale), p_y-(10*ScreenHandler.guiScale), 6], ScreenHandler.guiScale/2, 2);
    }
}