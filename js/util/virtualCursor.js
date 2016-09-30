var VirtualCursor = {
    x: 0,
    y: 0,
    mesh: undefined,
    
    init: function() {
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, 0, 0, 30, 30, [1,0,1,1]);
    },
    
    display: function() {
        gl.depthFunc(gl.ALWAYS);
        
        useShader("default");
        TextureManager.disableTextures();
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([this.x, this.y, 0]);
        this.mesh.draw();
    },
    
    setLocation: function(p_x, p_y) {
        this.x = p_x;
        this.y = p_y;
    },
    
    moveBy: function(p_x, p_y) {
        this.x = Math.min(gl.viewportWidth, Math.max(0, this.x+p_x));
        this.y = Math.min(gl.viewportWidth, Math.max(0, this.y+p_y));
    }
};