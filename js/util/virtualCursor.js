var VirtualCursor = {
    x: 0,
    y: 0,
    sensitivity: 1,
    mesh: undefined,
    
    init: function() {
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, 0, -19, 12, 19, [1,1,1,1], [[0,19/32],[12/32,19/32],[12/32,0],[0,0]]);
    },
    
    display: function() {
        gl.depthFunc(gl.ALWAYS);
        
        ItemRenderer.renderGuiItem(Player.itemInHand, this.x-4*ScreenHandler.guiScale, this.y+4*ScreenHandler.guiScale,1);
        
        useShader("default");
        GLHelper.resetToGuiMatrix();
        TextureManager.enableTextures();
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/cursor.png"].textureId);
        GLHelper.translate([this.x, this.y, 0]);
        this.mesh.draw();
        
        gl.depthFunc(gl.LEQUAL);
    },
    
    setLocation: function(p_x, p_y) {
        this.x = p_x;
        this.y = p_y;
    },
    
    moveBy: function(p_x, p_y) {
        this.x = Math.min(gl.viewportWidth, Math.max(0, this.x+p_x*this.sensitivity));
        this.y = Math.min(gl.viewportHeight, Math.max(0, this.y+p_y*this.sensitivity));
    }
};