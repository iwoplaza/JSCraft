function createGameScreen() {
    return {
        titleRO: undefined,
        floatingCubeRO: undefined,
        introFadeIn: 1,
        screenOverlayRO: undefined,
        closetObstructionRO: undefined,
        rotation: 0,
        animationProgress: 0,
        
        framebuffer: new Framebuffer(gl.viewportWidth, gl.viewportWidth),
        
        init: function(){
            console.log("Opened Game Screen!");
            
            this.titleRO = new Mesh();
            drawTexturedRect(this.titleRO, -10, -10, 20, 20, [1, 1, 1, 1], [[0, 1], [1, 1], [1, 0], [0, 0]]);
            
            this.floatingCubeRO = new Mesh();
            drawTexturedCube(this.floatingCubeRO, -2, -2, -2, 4, 4, 4, [1, 0.7, 0.5, 1]);
            
            Camera.setTarget(0, 0, -10);
            Camera.rotation.y = 180;
            
            this.currentGui = new guiInventory();
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
            
            if(keyState[key_Down]) {
                var forward = Camera.getForwardVector().getMultiplied(-1);
                forward.multiply(0.02*deltaTime);
                Camera.moveTarget(forward);
            }
            
            if(keyState[key_Up]) {
                var forward = Camera.getForwardVector();
                forward.multiply(0.02*deltaTime);
                Camera.moveTarget(forward);
            }
            
            if(keyState[key_Left]) {
                var left = Camera.getRightVector().getMultiplied(-1);
                left.multiply(0.02*deltaTime);
                Camera.moveTarget(left);
            }
            
            if(keyState[key_Right]) {
                var right = Camera.getRightVector();
                right.multiply(0.02*deltaTime);
                Camera.moveTarget(right);
            }
            
            if(keyState[32]) {
                Camera.moveTarget(0, 0.02*deltaTime, 0);
            }
            
            if(keyState[90]) {
                Camera.moveTarget(0, -0.02*deltaTime, 0);
            }
            
            if(keyState[69]) {
                Camera.rotation.y += 2;
            }
            
            if(keyState[81]) {
                Camera.rotation.y -= 2;
            }
            
            if(keyState[69]) {
                Camera.rotation.y += 2;
            }
            
            if(PointerLock.isLocked()) {
                var mouseSensitivity = 0.7;
                Camera.rotation.y += Mouse.movementX*mouseSensitivity;
                Camera.rotation.x += Mouse.movementY*mouseSensitivity;
            }
            
            Camera.update(deltaTime);
        },
        
        display: function() {
            gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
            gl.clearColor(0.2, 0.7, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            GLHelper.perspective(45, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
            GLHelper.identityModel();

            GLHelper.resetToWorldMatrix();
            useShader("default");
            TextureManager.bindTexture(TextureManager.database["res/img/world/doggy.png"].textureId);
            
            GLHelper.translate([0, 0, -45]);
            this.floatingCubeRO.draw();
            
            GLHelper.resetToWorldMatrix();
            World.world.display();
            
            this.currentGui.playerInventory();
        },
        
        onKeyPressed: function(event) {
            var keyCode = event.keyCode ? event.keyCode : event.which;
            
            if(keyCode == 76) {
                PointerLock.request();
            }
        },
        
        onKeyReleased: function(keyCode) {
            
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