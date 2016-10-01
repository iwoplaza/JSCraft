var slot = {
    width: 14,
    height: 14,
    init: function(){
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, 0, -14, this.height, this.width, [1,1,1,0.5]);
    },
    display: function(p_x, p_y, p_scale){
        useShader("default");
        GLHelper.resetToGuiMatrix();
        TextureManager.disableTextures();
        GLHelper.translate([p_x, p_y, 0]);
        GLHelper.scale([p_scale, p_scale, p_scale]);
        this.mesh.draw();
    }
}