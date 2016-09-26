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
            GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
            useShader("blocks");
            TextureManager.disableTextures();
            //gl.depthFunc(gl.ALWAYS);
            GLHelper.resetToWorldMatrix();
            GLHelper.translate([0, 13, 0]);
            GLHelper.scale([0.0625, 0.0625, 0.0625]);
            model.display();
            //gl.depthFunc(gl.LEQUAL);
        }
    }
}