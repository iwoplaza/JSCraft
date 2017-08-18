function ScreenGame() {
    this.titleRO = undefined;
    this.floatingCubeRO = undefined;
    this.introFadeIn = 1;
    this.screenOverlayRO = undefined;
    this.closetObstructionRO = undefined;
    this.blockSelectionRO = undefined;
    this.rotation = 0;
    this.animationProgress = 0;
    this.smoothMouseVel = new Vector2f(0, 0);
    this.currentGui = undefined;
    this.guiScale = 3;

    this.framebuffer = new Framebuffer(gl.viewportWidth, gl.viewportWidth);

    this.init = function(){
        console.log("Opened Game Screen!");

        this.titleRO = new Mesh();
        drawTexturedRect(this.titleRO, -10, -10, 20, 20, [1, 1, 1, 1], [[0, 1], [1, 1], [1, 0], [0, 0]]);

        this.floatingCubeRO = new Mesh();
        drawTexturedCube(this.floatingCubeRO, -0.02, -0.02, -0.02, 0.04, 0.04, 0.04, [1, 0.7, 0.5, 1]);

        this.blockSelectionRO = new Mesh();
        drawTexturedCube(this.blockSelectionRO, -0.01, -0.01, -0.01, 1.02, 1.02, 1.02, [1, 1, 1, 0.2]);

        initPlayer();
        World.world.loadChunks();
        Player.worldObj = World.world;
        Player.loc.y = 35;
        Player.toolbar.slots[0][0] = new ItemStack(Items.getItemByName("sword").id);
        Player.toolbar.slots[0][1] = new ItemStack(Items.getItemByName("pickaxe").id);
        Camera.rotation.y = 180.0;

        this.playerHUD = Gui.getGuiByName("guihud");

        this.ticks = 0;
    }

    this.update = function(deltaTime) {
        this.ticks++;
        if(this.introFadeIn > 0){
            this.introFadeIn = Math.max(0, this.introFadeIn-0.01*deltaTime);
        }

        this.rotation+=0.05*deltaTime;

        this.animationProgress+=0.0005*deltaTime;
        while(this.animationProgress >= 1) {
            this.animationProgress-=1;
        }
        if (keyState[69]){
            if (this.currentGui == undefined){
                this.currentGui = Gui.getGuiByName("inventory");
            }else{
                this.currentGui = undefined;
            }
            keyState[69] = false;
        }

        Player.update(deltaTime);
        Camera.update(deltaTime); 

        this.playerHUD.update();
    }

    this.display = function() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.2, 0.7, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
        GLHelper.identityModel();
        GLHelper.resetToWorldMatrix();
        useShader("default");
        //gl.depthFunc(gl.LEQUAL);
        World.world.display();

        //RayTrace Test
        //var boundingBox = new BoundingBox(Player.loc.x-2, Player.loc.y+4, Player.loc.z-2, 4, 4, 4);
        //var rayTraceResult = CollisionHelper.calculateIntercept(boundingBox, Player.loc.getAdded(Player.getEyeOffset()), Player.loc.getAdded(Player.getEyeOffset()).getAdded(Camera.getLookVector().getMultiplied(20)));

        //gl.depthFunc(gl.ALWAYS);
        if(Player.objectMouseOver != undefined) {
            useShader("default");
            GLHelper.resetToWorldMatrix();
            TextureManager.disableTextures();
            GLHelper.saveState();
            GLHelper.translate([Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z]);
            this.blockSelectionRO.draw();
            GLHelper.loadState();
        }
        //gl.depthFunc(gl.LEQUAL);

        if(Player.toolbar.slots[0][Player.selected] != undefined){
            GLHelper.resetToWorldMatrix();
            GLHelper.translate([Camera.getX(), Camera.getY(), Camera.getZ()]);
            GLHelper.rotate(-Camera.rotation.y/180.0*Math.PI+this.smoothMouseVel.x*0.01, [0, 1, 0]);
            GLHelper.rotate(-Camera.rotation.x/180.0*Math.PI+this.smoothMouseVel.y*0.01, [1, 0, 0]);
            GLHelper.translate([0.2, -0.1, -0.75]);
            GLHelper.rotate(0.4, [0, 1, 0]);
            GLHelper.rotate(-0.5-0.2*Math.sin(Player.punchAnimation*Math.PI), [1, 0, 0]);
            GLHelper.scale([0.45, 0.45, 0.45]);
            //GLHelper.translate([0, 13, 3]);
            GLHelper.translate([0, -0.2*Math.sin(Player.punchAnimation*Math.PI*2), -0.2*Math.sin(Player.punchAnimation*Math.PI)]);
            ItemRenderer.renderWorldItem(Player.toolbar.slots[0][Player.selected].getItem());
        }

        gl.depthFunc(gl.ALWAYS);
        this.playerHUD.display();
        if (this.currentGui != undefined) this.currentGui.display();
        gl.depthFunc(gl.LEQUAL);

        if(!this.isMousePointerLocked()) {
            VirtualCursor.display();
        }
    }

    this.handleKeyPressed = function(event) {
        var keyCode = event.keyCode ? event.keyCode : event.which;
        
        if(keyCode == 76) {
            PointerLock.request();
            Mouse.movementX = 0;
            Mouse.movementY = 0;
        }
        if(keyCode == 190) {
            console.log(((VirtualCursor.x-gl.viewportWidth/2)/ScreenHandler.guiScale),((VirtualCursor.y-gl.viewportHeight/2)/ScreenHandler.guiScale));
        }
        switch(event.keyCode){
            case 38:
                VirtualCursor.y += ScreenHandler.guiScale*0.5;
                break;
            case 40:
                VirtualCursor.y -= ScreenHandler.guiScale*0.5;
                break;
            case 39:
                VirtualCursor.x += ScreenHandler.guiScale*0.5;
                break;
            case 37:
                VirtualCursor.x -= ScreenHandler.guiScale*0.5;
                break;
            case 188:
                VirtualCursor.x = gl.viewportWidth/2;
                VirtualCursor.y = gl.viewportHeight/2;
                break;
        }
    }

    this.handleKeyReleased = function(event) {
        
    }

    this.handleMousePressed = function(event) {
        if(!this.currentGui) {
            if (event.button == 0){
                if(Player.objectMouseOver != undefined) {
                    if(World.world.getChunkForBlockCoords(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.z) != undefined) {
                        
                        Player.insertItems(new ItemStack(World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z).id,1))
                        
                        World.world.setBlockAndNotify(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z, undefined);
                        console.log("Removed block", [Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z]);
                        console.log(World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z));
                    }
                }
                Player.onPunch();
            }else
            if (event.button == 2){
                if(Player.objectMouseOver != undefined){
                    if(World.world.getChunkForBlockCoords(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.z) != undefined) {
                        if (World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z).metadata.gui != undefined && !isShiftDown){
                            this.currentGui = World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z).metadata.gui;
                        }else
                        if (Player.toolbar.getItemInInventory(Player.selected,0).itemID<=Blocks.blocks.length-1 && Player.toolbar.getItemInInventory(Player.selected,0).sub(1)){
                            /*let x = Player.objectMouseOver.blockPos.x+0.5+(Player.objectMouseOver.hitPoint.x-Player.objectMouseOver.blockPos.x-0.5)*1.2;
                            let y = Player.objectMouseOver.blockPos.y+0.5+(Player.objectMouseOver.hitPoint.y-Player.objectMouseOver.blockPos.y-0.5)*1.2;
                            let z = Player.objectMouseOver.blockPos.z+0.5+(Player.objectMouseOver.hitPoint.z-Player.objectMouseOver.blockPos.z-0.5)*1.2;
                            console.log(Math.floor(x),Math.floor(y),Math.floor(z));
                            console.log(Player.objectMouseOver.hitPoint.x,Player.objectMouseOver.hitPoint.y,Player.objectMouseOver.hitPoint.z);
                            
                            World.world.setBlockAndNotify(Math.floor(x),Math.floor(y),Math.floor(z),new WorldBlock(1));*/
                            
                            let x = Player.objectMouseOver.hitPoint.x;
                            let y = Player.objectMouseOver.hitPoint.y;
                            let z = Player.objectMouseOver.hitPoint.z;
                            
                            console.log(Math.floor(x),Math.floor(y),Math.floor(z));
                            
                            World.world.setBlockAndNotify(Math.floor(isRound(x)?(Camera.rotation.y>180?x:x-1):x),Math.floor(isRound(y)?(Camera.rotation.x<0?y-1:y):y),Math.floor(isRound(z)?(Camera.rotation.y>90&&Camera.rotation.y<270?z-1:z):z),new WorldBlock(Player.toolbar.getItemInInventory(Player.selected,0).itemID));
                            if (Player.toolbar.getItemInInventory(Player.selected,0).count <= 0) Player.toolbar.setItemInInventory(Player.selected,0,undefined);
                        }
                    }
                }
            }
        }
        if(this.currentGui) this.currentGui.handleInventory(event.button);
    }

    this.handleMouseMove = function(e) {
        if(PointerLock.isLocked()) {
            if(this.isMousePointerLocked()) {
                var mouseSensitivity = 0.6;
                Camera.rotation.y += e.movementX*mouseSensitivity;
                Camera.rotation.x += e.movementY*mouseSensitivity;
                Camera.rotation.x = Math.max(Math.min(Camera.rotation.x, 90.0), -90.0);
                
                while (Camera.rotation.y > 359){
                    Camera.rotation.y -= 360;
                }
                while (Camera.rotation.y<0){
                    Camera.rotation.y += 360;
                }
            }else{
                VirtualCursor.moveBy(e.movementX, -e.movementY);
            }
        }
    }
    
    this.isMousePointerLocked = function() {
        return (this.currentGui == undefined);
    }

    this.clean = function() {
        this.framebuffer.clean();
    }
}