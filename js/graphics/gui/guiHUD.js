function GuiHUD(){
    this.init = function(){
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
        
        drawTexturedRect(this.hungerBarFillMesh, 0, 0, 37*this.hunger, 6,[1,1,1,1],[[76/512,40/512],[(76+38*this.hunger)/512,40/512],[(76+38*this.hunger)/512,35/512],[76/512,35/512]]);
        drawTexturedRect(this.thirstBarFillMesh, 0, 0, 37*this.thirst, 6,[1,1,1,1],[[115/512,40/512],[(115+37*this.thirst)/512,40/512],[(115+37*this.thirst)/512,35/512],[115/512,35/512]]);
        drawTexturedRect(this.manaBarFillMesh, 0, 0, 152*this.mana, 3,[1,1,1,1],[[0,26/512],[152*this.mana/512,26/512],[152*this.mana/512,23/512],[0,23/512]]);
        drawTexturedRect(this.healthBarFillMesh, 0, 0, 75*this.health, 6,[1,1,1,1],[[0,40/512],[76*this.health/512,40/512],[76*this.health/512,35/512],[0,35/512]]);
        
        drawTexturedRect(this.itemSelectorMesh, 0, 0, 16, 16,[1,1,1,1],[[167/512,16/512],[183/512,16/512],[183/512,0],[167/512,0]]);
    };
    this.display = function(){
        this.scale = currentScreen.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        TextureManager.enableTextures();
        useShader("default");
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.crosshairMesh.draw();        
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,this.scale,0]);
        GLHelper.scale([this.scale,this.scale,10]);
        this.toolBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.healthBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.healthBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.hungerBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.hungerBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+39*this.scale,24*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.thirstBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2+39*this.scale,25*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.thirstBarFillMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,18*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.manaBarMesh.draw();
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale,19*this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.manaBarFillMesh.draw();
        
        gl.depthFunc(gl.LEQUAL);
        for (var x=0;x<Player.inventory.slots[0].length;x++) ItemRenderer.renderGuiItem(Player.inventory.slots[0][x],gl.viewportWidth/2-72.5*this.scale+(x*17*this.scale),13*this.scale, 5);
        TextureManager.enableTextures();
        useShader("default");
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
        gl.depthFunc(gl.ALWAYS);
        
        GLHelper.resetToGuiMatrix();
        GLHelper.translate([gl.viewportWidth/2-76*this.scale+17*Player.selected*this.scale,this.scale,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.itemSelectorMesh.draw();
    }
    this.update = function(){
        if (this.health != Player.health || this.hunger != Player.hunger || this.thirst != Player.thirst || this.mana != Player.mana) this.updateFillState();
        if (this.scale != currentScreen.guiScale) this.scale = currentScreen.guiScale;
    }
    this.updateFillState = function(){
        drawTexturedRect(this.hungerBarFillMesh, 0, 0, 37*Player.hunger, 6,[1,1,1,1],[[76/512,40/512],[(76+38*Player.hunger)/512,40/512],[(76+38*Player.hunger)/512,35/512],[76/512,35/512]]);
        drawTexturedRect(this.thirstBarFillMesh, 0, 0, 37*Player.thirst, 6,[1,1,1,1],[[115/512,40/512],[(115+37*Player.thirst)/512,40/512],[(115+37*Player.thirst)/512,35/512],[115/512,35/512]]);
        drawTexturedRect(this.manaBarFillMesh, 0, 0, 152*Player.mana, 3,[1,1,1,1],[[0,26/512],[152*Player.mana/512,26/512],[152*Player.mana/512,23/512],[0,23/512]]);
        drawTexturedRect(this.healthBarFillMesh, 0, 0, 75*Player.health, 6,[1,1,1,1],[[0,40/512],[76*Player.health/512,40/512],[76*Player.health/512,35/512],[0,35/512]]);
    }
}