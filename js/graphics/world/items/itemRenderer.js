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
    
    renderGuiItem: function(p_item) {
        var model = ItemModel.get(p_item.getItemModel());
        
        if(model != undefined) {
            useShader("blocks");
            TextureManager.disableTextures();
            //gl.depthFunc(gl.ALWAYS);
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([60, 60, 0]);
            GLHelper.scale([2, 2, 2]);
            model.display();
            //gl.depthFunc(gl.LEQUAL);
        }
    }
}