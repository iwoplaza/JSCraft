var ItemRenderer = {
    renderWorldItem: function(p_item) {
        var model = ItemModel.get(p_item.getItemModel());
        
        if(model != undefined) {
            useShader("blocks");
            if (ItemModel.registry[p_item.defaultItemModel].parts[0].type == "staticVoxels") TextureManager.disableTextures();
            else TextureManager.bindTexture(TextureManager.database["res/textures/blocks.png"].textureId);
            GLHelper.scale([0.0625, 0.0625, 0.0625]);
            model.display();
        }
    },
    
    renderGuiItem: function(p_item, p_x, p_y, p_z) {
        if (p_item == undefined) return;
        var model = ItemModel.get(p_item.getItemModel());
        var scale = ScreenHandler.guiScale*0.6;
        var x = p_x || 60;
        var y = p_y || 60;
        var z = p_z || 0;
        
        if(model != undefined) {
            useShader("blocks");
            if (ItemModel.registry[p_item.defaultItemModel].parts[0].type == "staticVoxels") TextureManager.disableTextures();
            else TextureManager.bindTexture(TextureManager.database["res/textures/blocks.png"].textureId);
            //gl.depthFunc(gl.ALWAYS);
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([x, y, z+10]);
            if (ItemModel.registry[p_item.defaultItemModel].parts[0].type == "staticVoxels") GLHelper.rotate(0.5*Math.PI, [0, 1, 0]);
            else{
                GLHelper.scale([0.8, 0.8, 0.8]);
                GLHelper.translate([-2, -2, 0]);
                GLHelper.rotate(0.15*Math.PI, [1, 0, 0]);
                GLHelper.rotate(0.25*Math.PI, [0, 1, 0]);
            }
            GLHelper.scale([scale, scale, scale]);
            model.display();
            //gl.depthFunc(gl.LEQUAL);
        }
    }
}