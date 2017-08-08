function Slot(){
    this.width = 14;
    this.height = 14;
    this.init = function(){
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, 0, 0, this.height, this.width, [1,1,1,0.5]);
    }
    this.display = function(p_x, p_y, p_scale){
        useShader("default");
        GLHelper.resetToGuiMatrix();
        TextureManager.disableTextures();
        GLHelper.translate([p_x, p_y, 0]);
        GLHelper.scale([p_scale, p_scale, p_scale]);
        this.mesh.draw();
    }
    this.init();
}