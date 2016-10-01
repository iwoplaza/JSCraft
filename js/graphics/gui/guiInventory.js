function GuiInventory(){
    this.init = function(){
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, -95, -90, 190, 181,[1,1,1,1],[[0,181/512],[190/512,181/512],[190/512,0],[0,0]]);
    },
    this.display = function(){
        
        this.scale = currentScreen.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        for (var y=1;y<Player.inventory.slots.length;y++){
            for (var x=0;x<Player.inventory.slots[y].length;x++){
                ItemRenderer.renderGuiItem(Player.inventory.slots[y][x],gl.viewportWidth/2-72.5*this.scale+(x*17*this.scale),gl.viewportHeight/2-this.scale*(y-1)*17);
            }
        }
        TextureManager.enableTextures();
        
        useShader("default");
        GLHelper.resetToGuiMatrix();
        
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerInventory.png"].textureId);
        GLHelper.translate([gl.viewportWidth/2+(11.5*currentScreen.guiScale),gl.viewportHeight/2,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.mesh.draw();
        
        Font.drawGuiText("Some Text", "normal", [0,0,0]);
    }
}