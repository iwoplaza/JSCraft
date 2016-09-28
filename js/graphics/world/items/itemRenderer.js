var ItemRenderer = {
    renderWorldItem: function(p_item) {
        var model = ItemModel.get(p_item.getItemModel());
        
        if(model != undefined) {
            useShader("blocks");
            TextureManager.disableTextures();
            GLHelper.scale([0.0625, 0.0625, 0.0625]);
            model.display();
        }
    },
    
    renderGuiItem: function(p_item, p_x, p_y) {
        if (p_item == undefined) return 1;
        var model = ItemModel.get(p_item.getItemModel());
        var scale = currentScreen.guiScale - 1;
        var x = p_x || 60;
        var y = p_y || 60;
        
        
        if(model != undefined) {
            useShader("blocks");
            TextureManager.disableTextures();
            //gl.depthFunc(gl.ALWAYS);
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([x, y, 0]);
            GLHelper.rotate(0.5*Math.PI, [0, 1, 0]);
            GLHelper.scale([scale, scale, scale]);
            model.display();
            //gl.depthFunc(gl.LEQUAL);
        }
    }
}