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
}