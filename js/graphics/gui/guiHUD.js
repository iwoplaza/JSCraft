function GuiHUD(){
    this.init = function(){
        this.scale = 3;
        this.selected = 0;
        
        this.crosshairMesh = new Mesh();
        this.toolBarMesh = new Mesh();
        this.healthBarMesh = new Mesh();
        this.hungerBarMesh = new Mesh();
        this.thirstBarMesh = new Mesh();
        this.manaBarMesh = new Mesh();
        
        this.healthBarFillMesh = new Mesh();
        this.hungerBarFillMesh = new Mesh();
        this.thirstBarFillMesh = new Mesh();
        this.manaBarFillMesh = new Mesh();
        
        this.itemSelectorMesh = new Mesh();
        
        drawTexturedRect(this.crosshairMesh, -8, -8, 16, 16,[1,1,1,1],[[152/512,16/512],[167/512,16/512],[167/512,0],[152/512,0]]);
        drawTexturedRect(this.toolBarMesh, 0, 0, 152, 16,[1,1,1,1],[[0,16/512],[152/512,16/512],[152/512,0],[0,0]]);
        drawTexturedRect(this.healthBarMesh, 0, 0, 75, 8,[1,1,1,1],[[0,34/512],[76/512,34/512],[76/512,27/512],[0,27/512]]);
        drawTexturedRect(this.hungerBarMesh, 0, 0, 37, 8,[1,1,1,1],[[76/512,34/512],[114/512,34/512],[114/512,27/512],[76/512,27/512]]);
        drawTexturedRect(this.thirstBarMesh, 0, 0, 37, 8,[1,1,1,1],[[115/512,34/512],[152/512,34/512],[152/512,27/512],[115/512,27/512]]);
        drawTexturedRect(this.manaBarMesh, 0, 0, 152, 6,[1,1,1,1],[[0,22/512],[152/512,22/512],[152/512,16/512],[0,16/512]]);
        
        drawTexturedRect(this.healthBarFillMesh, 0, 0, 75, 6,[1,1,1,1],[[0,40/512],[76/512,40/512],[76/512,35/512],[0,35/512]]);
        drawTexturedRect(this.hungerBarFillMesh, 0, 0, 37, 6,[1,1,1,1],[[76/512,40/512],[114/512,40/512],[114/512,35/512],[76/512,35/512]]);
        drawTexturedRect(this.thirstBarFillMesh, 0, 0, 37, 6,[1,1,1,1],[[115/512,40/512],[152/512,40/512],[152/512,35/512],[115/512,35/512]]);
        drawTexturedRect(this.manaBarFillMesh, 0, 0, 152, 3,[1,1,1,1],[[0,26/512],[152/512,26/512],[152/512,23/512],[0,23/512]]);
        
        drawTexturedRect(this.itemSelectorMesh, 0, 0, 16, 16,[1,1,1,1],[[167/512,16/512],[183/512,16/512],[183/512,0],[167/512,0]]);
    };
    this.display = function(){
        useShader("default");
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.crosshairMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale+17*this.selected*this.scale,this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.itemSelectorMesh.draw();
        
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.toolBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.healthBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.healthBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.hungerBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.hungerBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+39*this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.thirstBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+39*this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.thirstBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,19*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.manaBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,18*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.manaBarMesh.draw();
    }
    this.changeFillState = function(index,fill_percent){
        switch(index){
            case 1:
                drawTexturedRect(this.hungerBarFillMesh, 0, 0, 37*fill_percent, 6,[1,1,1,1],[[76/512,40/512],[(76+38*fill_percent)/512,40/512],[(76+38*fill_percent)/512,35/512],[76/512,35/512]]);
                break;
            case 2:
                drawTexturedRect(this.thirstBarFillMesh, 0, 0, 37*fill_percent, 6,[1,1,1,1],[[115/512,40/512],[(115+37*fill_percent)/512,40/512],[(115+37*fill_percent)/512,35/512],[115/512,35/512]]);
                break;
            case 3:
                drawTexturedRect(this.manaBarFillMesh, 0, 0, 152*fill_percent, 3,[1,1,1,1],[[0,26/512],[152*fill_percent/512,26/512],[152*fill_percent/512,23/512],[0,23/512]]);
                break;
            default:
                drawTexturedRect(this.healthBarFillMesh, 0, 0, 75*fill_percent, 6,[1,1,1,1],[[0,40/512],[76*fill_percent/512,40/512],[76*fill_percent/512,35/512],[0,35/512]]);
                break;
        }
    }
}