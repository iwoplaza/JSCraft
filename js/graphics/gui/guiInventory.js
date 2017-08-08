function GuiInventory(){
    this.init = function(){
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, -83, -90.5, 190, 181,[1,1,1,1],[[0,181/512],[190/512,181/512],[190/512,0],[0,0]]);
    },
    this.display = function(){
        this.scale = ScreenHandler.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        
        TextureManager.enableTextures();
        useShader("default");
        GLHelper.resetToGuiMatrix();
        
        GLHelper.saveState();
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerInventory.png"].textureId);
        GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.mesh.draw();
        GLHelper.loadState();
        
        Player.inventory.display(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2+0*this.scale);
        Player.toolbar.display(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2-74*this.scale);
                
        Font.drawGuiText("Some Text", "normal", [0,0,0]);
    }
    this.handleInventory = function(){
        Player.inventory.handleInventory(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2+0*this.scale);
        Player.toolbar.handleInventory(gl.viewportWidth/2-72.5*this.scale,gl.viewportHeight/2+0*this.scale);
    }
}