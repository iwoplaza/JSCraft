function Button(p_width, p_height, p_loc){
    this.loc = p_loc || {x: 0, y: 0};
    this.width = p_width || 0;
    this.height = p_height || 0;
}
Button.prototype.handlePress = function(p_x, p_y, p_button){
    var scale = ScreenHandler.guiScale;
    var loc = {x: p_x || this.loc.x, y: p_y || this.loc.y};
    var button = p_button || 0;
    
    var x = ((VirtualCursor.x-gl.viewportWidth/2)/ScreenHandler.guiScale);
    var y = ((VirtualCursor.y-gl.viewportHeight/2)/ScreenHandler.guiScale);
    //console.log(this.loc.x+"<"+x+"<"+(this.loc.x+this.width));
    //console.log(this.loc.y+"<"+y+"<"+(this.loc.y+this.height));
    if (x >= this.loc.x && x <= this.loc.x+this.width && y >= this.loc.y-this.height && y <= this.loc.y){
        //console.log("Click!");
        return true;
    }
    return false;
}
//25x21
//166 67

//83 23.5