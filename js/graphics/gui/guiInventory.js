function GuiInventory(){
    this.init = function(){
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, -95, -90, 190, 181,[1,1,1,1],[[0,181/512],[190/512,181/512],[190/512,0],[0,0]]);
    },
    this.display = function(){
        useShader("default");
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        GLHelper.resetToGuiMatrix();
        
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerInventory.png"].textureId);
        GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
        GLHelper.scale([2,2,2]);
        this.mesh.draw();
        
        Font.drawGuiText("Some Text", "normal", [0,0,0]);
    }
}