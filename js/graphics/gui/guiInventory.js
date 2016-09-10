function GuiInventory(){
    this.init = function(){
        this.mesh = new Mesh();
        drawRect(this.mesh, 0, gl.viewportHeight-100, 200, 100,[0,1,1,1]);
    },
    this.display = function(p_name){
        useShader("default");
        TextureManager.disableTextures();
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        GLHelper.resetToGuiMatrix();
        this.mesh.draw();
        
        Font.drawGuiText("Some Text", "normal", [0,0,0]);
    }
}