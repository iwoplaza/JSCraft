function Gui() {
    this.defaultGuiTextures = ["UNDEFINED"];
    this.defaultGuiName = "UNDEFINED";
    this.defaultGuiPos = [[0,0,0]];
    
    this.init();
}

Gui.prototype.init = function(){
    
}

Gui.prototype.getPos = function(p_data){
    return this.defaultGuiPos;
}

Gui.prototype.getTexture = function(p_data) {
    return this.defaultGuiTexture;
}

Gui.prototype.getName = function(p_data) {
    return this.defaultGuiName;
}

Gui.prototype.setTexture = function(p_texture) {
    this.defaultGuiTexture = p_texture;
    return this;
}

Gui.prototype.setName = function(p_name) {
    this.defaultGuiName = p_name;
    return this;
}

Gui.prototype.setPos = function(p_pos){
    this.defaultGuiPos = p_pos;
    return this;
}