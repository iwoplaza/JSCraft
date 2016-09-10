function createGameScreen() {
    return {
        titleRO: undefined,
        floatingCubeRO: undefined,
        introFadeIn: 1,
        screenOverlayRO: undefined,
        closetObstructionRO: undefined,
        blockSelectionRO: undefined,
        rotation: 0,
        animationProgress: 0,
        
        framebuffer: new Framebuffer(gl.viewportWidth, gl.viewportWidth),
        
        init: function(){
            console.log("Opened Game Screen!");
            
            this.titleRO = new Mesh();
            drawTexturedRect(this.titleRO, -10, -10, 20, 20, [1, 1, 1, 1], [[0, 1], [1, 1], [1, 0], [0, 0]]);
            
            this.floatingCubeRO = new Mesh();
            drawTexturedCube(this.floatingCubeRO, -0.02, -0.02, -0.02, 0.04, 0.04, 0.04, [1, 0.7, 0.5, 1]);
            
            this.blockSelectionRO = new Mesh();
            drawTexturedCube(this.blockSelectionRO, -0.01, -0.01, -0.01, 1.02, 1.02, 1.02, [1, 1, 1, 0.2]);
            
            initPlayer();
            Player.worldObj = World.world;
            Player.loc.y = 35;
            Camera.rotation.y = 180.0;
            
            this.currentGui = new GuiInventory();
            this.currentGui.init();
            
            setInterval(World.updateChunks, 1000);
        },
        
        update: function(deltaTime) {
            if(this.introFadeIn > 0){
                this.introFadeIn = Math.max(0, this.introFadeIn-0.01*deltaTime);
            }
            
            this.rotation+=0.05*deltaTime;
            
            this.animationProgress+=0.0005*deltaTime;
            while(this.animationProgress >= 1) {
                this.animationProgress-=1;
            }
            
            if(PointerLock.isLocked()) {
                var mouseSensitivity = 0.7;
                Camera.rotation.y += Mouse.movementX*mouseSensitivity;
                Camera.rotation.x += Mouse.movementY*mouseSensitivity;
            }
            
            Player.update(deltaTime);
            Camera.update(deltaTime);
        },
        
        display: function() {
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clearColor(0.2, 0.7, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
            GLHelper.identityModel();
            GLHelper.resetToWorldMatrix();
            useShader("default");
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
            
            this.currentGui.display();
        },
        
        onKeyPressed: function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            
            if(keyCode == 76) {
                PointerLock.request();
            }
        },
        
        onKeyReleased: function(event) {
            
        },
        
        onMousePressed: function(event) {
            if(event.button == 0) {
                if(Player.objectMouseOver != undefined) {
                    if(World.world.getChunkForBlockCoords(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.z) != undefined) {
                        World.world.setBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z, undefined);
                        console.log("Removed block", [Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z]);
                        console.log(World.world.getBlock(Player.objectMouseOver.blockPos.x, Player.objectMouseOver.blockPos.y, Player.objectMouseOver.blockPos.z));
                    }
                }
            }
        },
        
        clean: function() {
            this.framebuffer.clean();
        }
    };
}

function openGameScreen() {
    var gameScreen = createGameScreen();
    
    openScreen(gameScreen);
}