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
        Player.toolbar.slots[0][0] = new ItemStack(0);
        Player.toolbar.slots[0][1] = new ItemStack(1);
        Camera.rotation.y = 180.0;

        this.playerHUD = new GuiHUD();
        this.playerHUD.init();

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
                this.currentGui = new GuiInventory();
                this.currentGui.init();
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
    }

    this.handleKeyReleased = function(event) {

    }

    this.handleMousePressed = function(event) {
        if(event.button == 0 && !this.currentGui) {
            if(Player.objectMouseOver != undefined) {
                if(World.world.getChunkForBlockCoords(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.z) != undefined) {
                    World.world.setBlockAndNotify(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z, undefined);
                    console.log("Removed block", [Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z]);
                    console.log(World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z));
                }
            }

            Player.onPunch();
        }
        if(event.button == 0 && this.currentGui) this.currentGui.handleInventory();
    }

    this.handleMouseMove = function(e) {
        if(PointerLock.isLocked()) {
            if(this.isMousePointerLocked()) {
                var mouseSensitivity = 0.6;
                Camera.rotation.y += e.movementX*mouseSensitivity;
                Camera.rotation.x += e.movementY*mouseSensitivity;
                Camera.rotation.x = Math.max(Math.min(Camera.rotation.x, 90.0), -90.0);
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