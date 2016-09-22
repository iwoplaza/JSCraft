function ItemRenderer(){
    this.init = function(){
        this.mesh = new Mesh();
        drawCube(this.mesh, Player.loc.x, Player.loc.y, Player.loc.z, 0.5, 0.5, 0.5, [1,1,1,1]);
    },
    this.display = function(){
        useShader("default");
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        GLHelper.resetToWorldMatrix();
        
        TextureManager.disableTextures();
        GLHelper.translate([Player.loc.x,Player.loc.y,Player.loc.z]);
        GLHelper.scale([1,1,1]);
        this.mesh.draw();
    }
}