function GuiInventory(){
    this.init = function(){
        slot.init();
        this.mesh = new Mesh();
        drawTexturedRect(this.mesh, -83, -90.5, 190, 181,[1,1,1,1],[[0,181/512],[190/512,181/512],[190/512,0],[0,0]]);
    },
    this.display = function(){
        this.scale = ScreenHandler.guiScale;
        
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        GLHelper.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100);
        
        TextureManager.enableTextures();
        useShader("default");
        GLHelper.resetToGuiMatrix();
        
        TextureManager.bindTexture(TextureManager.database["res/textures/gui/playerInventory.png"].textureId);
        GLHelper.translate([gl.viewportWidth/2,gl.viewportHeight/2,0]);
        GLHelper.scale([this.scale,this.scale,this.scale]);
        this.mesh.draw();
        
        for (var y=1;y<Player.inventory.slots.length;y++){
            for (var x=0;x<Player.inventory.slots[y].length;x++){
                if (Player.inventory.slots[y][x] != undefined) ItemRenderer.renderGuiItem(Player.inventory.slots[y][x].getItem(),gl.viewportWidth/2-72.5*this.scale+(x*17*this.scale),gl.viewportHeight/2-this.scale*(y-1)*17, 5);
            }
        }
        
        for (var x=0;x<Player.inventory.slots[0].length;x++){
            if (Player.inventory.slots[0][x] != undefined) ItemRenderer.renderGuiItem(Player.inventory.slots[0][x].getItem(),gl.viewportWidth/2-72.5*this.scale+(x*17*this.scale),gl.viewportHeight/2-74*this.scale, 5);
        }
        var x = Math.floor((VirtualCursor.x-(gl.viewportWidth/2-76*this.scale))/(17*this.scale));
        var y = Math.floor(((gl.viewportHeight/2+3.5*this.scale)-VirtualCursor.y)/(17*this.scale)+1);
        
        if (Player.inventory.slots[y] != undefined && y > 0 && x >= 0 && x < Player.inventory.slots[y].length){
            slot.display(gl.viewportWidth/2-75*this.scale+(x*17*this.scale), (gl.viewportHeight/2-11.5*this.scale)-(17*this.scale)*(y-1), ScreenHandler.guiScale);
        }
        var y = Math.floor(((gl.viewportHeight/2-70.5*this.scale)-VirtualCursor.y)/(16*this.scale));
        
        if (Player.inventory.slots[y] != undefined && y == 0 && x >= 0 && x < Player.inventory.slots[y].length){
            slot.display(gl.viewportWidth/2-75*this.scale+(x*17*this.scale), gl.viewportHeight/2-85.5*this.scale, ScreenHandler.guiScale);
        }
        
        Font.drawGuiText("Some Text", "normal", [0,0,0]);
    },
    this.handleInventory = function(){
        var x = Math.floor((VirtualCursor.x-(gl.viewportWidth/2-76*this.scale))/(17*this.scale));
        var y = Math.floor(((gl.viewportHeight/2+3.5*this.scale)-VirtualCursor.y)/(17*this.scale)+1);
        if (Player.inventory.slots[y] != undefined && y > 0 && x >= 0 && x < Player.inventory.slots[y].length){
            var item = Player.itemInHand;
            Player.itemInHand = Player.inventory.getItemInInventory(x,y);
            Player.inventory.setItemInInventory(x, y, item);
        }
        var y = Math.floor(((gl.viewportHeight/2-70.5*this.scale)-VirtualCursor.y)/(16*this.scale));
        if (Player.inventory.slots[y] != undefined && y == 0 && x >= 0 && x < Player.inventory.slots[y].length){
            var item = Player.itemInHand;
            Player.itemInHand = Player.inventory.getItemInInventory(x,y);
            Player.inventory.setItemInInventory(x, y, item);
        }
    }
}