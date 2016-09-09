function GuiInventory(){
    this.init = function(){
        this.guiInventory = new Mesh();
    },
    this.playerInventory = function(p_name){
        useShader("default");
        drawRect(this.guiInventory, 0, gl.viewportHeight-100, 200, 100,[0,1,1,1]);
        TextureManager.disableTextures();
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([0, 0, 0]);
        GLHelper.scale([1, 1, 1]);
        this.guiInventory.draw();
    }
}