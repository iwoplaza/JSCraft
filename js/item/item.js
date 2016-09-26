function Item() {
    this.defaultItemModel = "default";
    this.defaultItemName = "NAMELESS";
    
    this.getItemModel = function(p_data) {
        return this.defaultItemModel;
    }
    
    this.getDisplayName = function(p_data) {
        return this.defaultItemName;
    }
    
    this.setDefaultModel = function(p_model) {
        this.defaultItemModel = p_model;
        return this;
    }
    
    this.setDefaultName = function(p_name) {
        this.defaultItemName = p_name;
        return this;
    }
}