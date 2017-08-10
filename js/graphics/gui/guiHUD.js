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
        let scale = ScreenHandler.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        TextureManager.enableTextures();
        useShader("default");
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
        
        GLHelper.saveState();
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
            GLHelper.scale([scale, scale, scale]);
            this.crosshairMesh.draw();
        GLHelper.loadState();
        
        GLHelper.saveState();
            GLHelper.resetToGuiMatrix();
            GLHelper.translate([gl.viewportWidth/2,0,0]);
            GLHelper.scale([scale, scale, scale]);
            
            GLHelper.saveState();
                GLHelper.translate([-76,1,0]);
                this.toolBarMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                GLHelper.translate([-76,24,0]);
                this.healthBarMesh.draw();
            GLHelper.loadState();

            GLHelper.saveState();
                GLHelper.translate([-76,25,0]);
                this.healthBarFillMesh.draw();
            GLHelper.loadState();    
        
            GLHelper.saveState();
                GLHelper.translate([1,24,0]);
                this.hungerBarMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                GLHelper.translate([1,25,0]);
                this.hungerBarFillMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                GLHelper.translate([39,24,0]);
                this.thirstBarMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                GLHelper.translate([39,25,0]);
                this.thirstBarFillMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                GLHelper.translate([-76,18,0]);
                this.manaBarMesh.draw();
            GLHelper.loadState();

            GLHelper.saveState();
                GLHelper.translate([-76,19,0]);
                this.manaBarFillMesh.draw();
            GLHelper.loadState();
        
            GLHelper.saveState();
                gl.depthFunc(gl.LEQUAL);
                TextureManager.enableTextures();
                useShader("default");
                TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerHUD.png"].textureId);
                gl.depthFunc(gl.ALWAYS);
                GLHelper.resetToGuiMatrix();
                GLHelper.translate([gl.viewportWidth/2-76*scale+17*Player.selected*scale, scale, 0]);
                GLHelper.scale([scale, scale, scale]);
                this.itemSelectorMesh.draw();
            GLHelper.loadState();
            Player.toolbar.display(gl.viewportWidth/2-72.5*scale, 13*scale, true);
        GLHelper.loadState();
    }
    this.update = function(){
        if (this.health != Player.health || this.hunger != Player.hunger || this.thirst != Player.thirst || this.mana != Player.mana) this.updateFillState();
        if (this.scale != ScreenHandler.currentScreen.guiScale) this.scale = ScreenHandler.currentScreen.guiScale;
    }
    this.updateFillState = function(){
        drawTexturedRect(this.hungerBarFillMesh, 0, 0, 37*Player.hunger, 6,[1,1,1,1],[[76/512,40/512],[(76+38*Player.hunger)/512,40/512],[(76+38*Player.hunger)/512,35/512],[76/512,35/512]]);
        drawTexturedRect(this.thirstBarFillMesh, 0, 0, 37*Player.thirst, 6,[1,1,1,1],[[115/512,40/512],[(115+37*Player.thirst)/512,40/512],[(115+37*Player.thirst)/512,35/512],[115/512,35/512]]);
        drawTexturedRect(this.manaBarFillMesh, 0, 0, 152*Player.mana, 3,[1,1,1,1],[[0,26/512],[152*Player.mana/512,26/512],[152*Player.mana/512,23/512],[0,23/512]]);
        drawTexturedRect(this.healthBarFillMesh, 0, 0, 75*Player.health, 6,[1,1,1,1],[[0,40/512],[76*Player.health/512,40/512],[76*Player.health/512,35/512],[0,35/512]]);
    }
    this.init();
}