var Player;

function initPlayer() {
	Player = {
		loc: new Vector2f(0, 0),
		vel: new Vector2f(0, 0),
        prevLoc: new Vector2f(0, 0),
        closetLocation: new Vector2f(0, 0),
		onGround: true,
        isWalking: false,
        isSprinting: false,
        inCloset: false,
		timeInAir: 0,
		timeOnGround: 0,
        animStand: createAnimationHandler([[0, 0]]),
        animStandBloody: createAnimationHandler([[1, 0], [2, 0], [3, 0], [2, 0]]),
        animStandFlashlight: createAnimationHandler([[4, 0], [5, 0], [6, 0], [5, 0]]),
        animWalk: createAnimationHandler([[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1]]),
        animWalkBloody: createAnimationHandler([[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2]]),
        animWalkFlashlight: createAnimationHandler([[0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3]]),
        animSprint: createAnimationHandler([[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4]]),
        animSprintFlashlight: createAnimationHandler([[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5]]),
        jumpStand: createAnimationHandler([[4, 0], [5, 0]]),
        side: true,
        flashLightRO: undefined,
        flashlightTexture: undefined,
        hasFlashlight: false,
        flashlightOn: false,
        footstepSoundCooldown: 0,
        sprintSoundCooldown: 0,
        closetFade: 0,
        
        amyHeadSquirt: 0,
        kneeFall: false,
        kneeFallProgress: 0,
        
		update: function() {
            if(!doesCutscenePauseMovement()){
                if(keyState[key_Left]){
                    this.vel.x = -this.getWalkSpeed();
                    this.isWalking = true;
                    this.side = false;
                }else if(keyState[key_Right]){
                    this.vel.x = this.getWalkSpeed();
                    this.isWalking = true;
                    this.side = true;
                }else{
                    this.vel.x = 0;
                    this.isWalking = false;
                }
                
                if(this.isWalking && keyState[32] && this.canSprint()) this.isSprinting = true;
                else this.isSprinting = false;
            }else{
                this.isSprinting = false;
                
                if(this.vel.x != 0) {
                    this.isWalking = true;
                    if(this.vel.x > 0) this.side = true;
                    else this.side = false;
                }else{
                    this.isWalking = false;
                }
            }
            
            if(this.kneeFall) {
                this.kneeFallProgress = Math.min(1, this.kneeFallProgress+0.03);
            }else if(this.kneeFallProgress > 0){
                this.kneeFallProgress = Math.max(0, this.kneeFallProgress-0.03);
            }
            
            if(this.footstepSoundCooldown > 0){
                this.footstepSoundCooldown-=this.isSprinting ? 0.15 : 0.03;
                if(this.footstepSoundCooldown <= 0) this.footstepSoundCooldown = 0;
            }
            
            if(this.isSprinting){
                this.sprintSoundCooldown -= 0.13;
                if(this.sprintSoundCooldown <= 0){
                    this.sprintSoundCooldown = 6;
                    this.playSprintSound();
                }
            }
            
            //if(this.onGround){
                if(this.isWalking) {
                    this.animStand.setFrame(0);
                    this.animStandBloody.setFrame(0);
                    this.animStandFlashlight.setFrame(0);
                    this.animWalk.progress(0.06);
                    this.animWalkBloody.progress(0.06);
                    this.animWalkFlashlight.progress(0.06);
                    
                    if(this.isSprinting) {
                        this.animSprint.progress(0.13);
                        this.animSprintFlashlight.progress(0.13);
                    }else{
                        this.animSprint.setFrame(0);
                        this.animSprintFlashlight.setFrame(0);
                        
                        if(this.animWalk.getCurrentFrame()[0] == 0 ||
                          this.animWalk.getCurrentFrame()[0] == 3)
                        if(this.footstepSoundCooldown <= 0) {
                            this.playFootstepSound();
                            this.footstepSoundCooldown = 1;
                        }
                    }
                }else{
                    this.animStand.progress(0.05);
                    this.animStandBloody.progress(0.05);
                    this.animStandFlashlight.progress(0.05);
                    this.animWalk.setFrame(0);
                    this.animWalkBloody.setFrame(0);
                    this.animWalkFlashlight.setFrame(0);
                }
            /*}else{
                this.animStand.setFrame(0);
                this.walkStand.setFrame(0);
                this.jumpStand.progress(0.13);
            }*/
            
			if(this.onGround){
				this.timeInAir = 0;
				this.timeOnGround++;
			}else{
				this.timeInAir++;
				this.timeOnGround = 0;
			}
            
            this.vel.y-=this.getMass();
            
			var lastOnGround = this.onGround;
            
            this.onGround = false;
			
			if(this.onGround && !lastOnGround){
				playSound("land");
			}
            
            var collidingTiles = getCollidingTiles(this.getMovedBounds());
            if(collidingTiles != undefined && collidingTiles[0] != undefined){
                for(var i = 0; i < collidingTiles.length*collidingTiles[0].length; i++) {
                    var collTilePos = collidingTiles[i%collidingTiles.length][Math.floor(i/collidingTiles.length)];
                    if(getCurrentMap().tiles[collTilePos.x] != undefined){
                        var collTile = getCurrentMap().tiles[collTilePos.x][collTilePos.y];
                        if(collTile != undefined && collTile.id >= 0){
                            var tileData = getCurrentTilesheet().tileData[collTile.id];
                            if(tileData != undefined && tileData.bounds != undefined && !tileData.background) {
                                var tileBounds = tileData.bounds[0];
                                var collData = CollisionHelper.collide(this.loc, this.vel, this.getBounds(), {
                                    type: tileBounds.type,
                                    x: (collTilePos.x+tileBounds.x)*tileSize,
                                    y: (collTilePos.y+tileBounds.y)*tileSize,
                                    width: tileBounds.width*tileSize,
                                    height: tileBounds.height*tileSize
                                });
                                if(collData != undefined) {
                                    this.loc.x = collData.locX != undefined ? collData.locX : this.loc.x;
                                    this.loc.y = collData.locY != undefined ? collData.locY : this.loc.y;
                                    this.vel.x = collData.velX != undefined ? collData.velX : this.vel.x;
                                    this.vel.y = collData.velY != undefined ? collData.velY : this.vel.y;
                                    this.onGround = collData.onGround || this.onGround;
                                }
                            }
                        }
                    }
                }
            }
            
            //Triggering instant triggers
            var map = getCurrentMap();
            if(map.triggers != undefined){
                for(var i = 0; i < map.triggers.length; i++) {
                    var trigger = map.triggers[i];
                    var playerBounds = Player.getMovedBounds();
                    if(trigger.type == "instant" && isTriggerAccessible(trigger) && (trigger.triggered == undefined || trigger.triggered == false)) {
                        var triggerX = (trigger.x)*tileSize;
                        if((trigger.y+4)*tileSize > playerBounds.y && (trigger.y-2)*tileSize < playerBounds.y+playerBounds.height &&
                            triggerX-20 <= playerBounds.x+playerBounds.width && triggerX+20 >= playerBounds.x) {
                            if(trigger.cutscene != undefined){
                                playCutsceneCallback(trigger.cutscene);
                            }
                            trigger.triggered = true;
                        }
                    }
                }
            }
            
            this.prevLoc.x = this.loc.x;
            this.prevLoc.y = this.loc.y;
			this.loc.x += this.vel.x;
			this.loc.y += this.vel.y;
            
            if(this.inCloset) {
                this.loc.x = this.closetLocation.x*tileSize;
                this.loc.y = this.closetLocation.y*tileSize-32;
                
                if(this.closetFade < 1){
                    this.closetFade = Math.min(1, this.closetFade+0.01);
                }
            }else{
                if(this.closetFade > 0){
                    this.closetFade = Math.max(0, this.closetFade-0.03);
                }
            }
            
            if(isSunny()) {
                this.loc.x = 23.5*tileSize-2;
                this.loc.y = 1.7*tileSize;
                this.side = true;
                this.isWalking = false;
                this.isSprinting = false;
                this.vel.x = 0;
                this.animWalk.setFrame(1);
                Camera.set(this.loc.x, this.loc.y+60);
                
                if(GameState.getFlag("dinner_2")) {
                    this.amyHeadSquirt+=0.7;
                    this.amyHeadSquirt = Math.max(0, Math.min(4, this.amyHeadSquirt));
                }else{
                    amyHeadSquirt = 0;
                }
            }
		},

		display: function() {
            if(this.inCloset)  return;
            
			resetToWorldMatrix();
			var orientation = 0;

			mat4.translate(mMatrix, [this.loc.x, this.loc.y, 0]);
			mat4.rotate(mMatrix, -orientation, [0.0, 0.0, 1.0]);
            mat4.scale(mMatrix, [this.getRenderSide() ? 1 : -1, 1, 1]);
            
            //drawRect(this.getBounds().width, this.getBounds().height, this.getBounds().x, this.getBounds().y, [0,255/255,255/255,1]);
			//draw();
            
            var currentFrame = [0,0];
            if(this.isWalking){
                currentFrame = this.isFlashlightOn() ? this.animWalkFlashlight.getCurrentFrame() : this.isBloody() ? this.animWalkBloody.getCurrentFrame() : this.animWalk.getCurrentFrame();
                
                if(this.isSprinting) {
                    currentFrame = this.isFlashlightOn() ? this.animSprintFlashlight.getCurrentFrame() : this.animSprint.getCurrentFrame();
                }
            }else{
                currentFrame = this.isFlashlightOn() ? this.animStandFlashlight.getCurrentFrame() : this.isBloody() ? this.animStandBloody.getCurrentFrame() : this.animStand.getCurrentFrame();
            }
            
            if(this.kneeFallProgress > 0) {
                currentFrame = [Math.floor(this.kneeFallProgress*2), 7];
            }
            
            if(isSunny()) {
                currentFrame = [GameState.getFlag("dinner_2") ? 2+Math.floor(this.amyHeadSquirt) : GameState.getFlag("dinner_1") ? 1 : 0, 6];
            }
            
            mat4.translate(mMatrix, [-64, 0, 0]);
            spritesheets["character_main"].drawSprite(currentFrame, true);
            disableTextures();
		},
        
        renderFlashlight: function() {
            if(isSunny())  return;
            if(this.inCloset)  return;
            if(!this.isFlashlightOn()) return;
                
            resetToLightMapMatrix();
            
            if(this.isFlashlightOn()){
                var lightSource = LightMapManager.addLightSource("character_flashlight", this.loc.x + this.getFlashLightOffsetX() * (this.getRenderSide() ? 1 : -1), this.loc.y + this.getFlashLightOffsetY(), 10, 1);
                lightSource.direction = this.getRenderSide();
            }
            
            mat4.translate(mMatrix, [this.loc.x, this.loc.y, 0]);
            mat4.scale(mMatrix, [this.getRenderSide() ? 1 : -1, 1, 1]);
            mat4.translate(mMatrix, [this.getFlashLightOffsetX(), this.getFlashLightOffsetY(), 0]);
            mat4.rotate(mMatrix, this.getFlashLightRotation(), [0, 0, 1]);
            mat4.translate(mMatrix, [-128-64, -32-64-32-256-128, 0]);
            spritesheets["character_flashlight"].drawSprite([0,0]);
        },
        
        teleport: function(p_x, p_y) {
            this.loc.x = p_x;
            this.loc.y = p_y;
            this.prevLoc.x = p_x;
            this.prevLoc.y = p_y;
        },
        
		onKeyPressed: function(event) {
            var code = event.keyCode ? event.keyCode : event.which;
            
            if(!doesCutscenePauseMovement() && !isSunny()){
                if(code == key_Flashlight && this.hasFlashlight) {
                    this.flashlightOn = !this.flashlightOn;

                    playSound(this.flashlightOn ? "switch-on" : "switch-off");
                }

                if(code == key_Interact) {
                    if(this.inCloset) {
                        this.inCloset = false;
                    }else{
                        var map = getCurrentMap();
                        if(map.triggers != undefined){
                            for(var i = 0; i < map.triggers.length; i++) {
                                var trigger = map.triggers[i];
                                var playerBounds = Player.getMovedBounds();
                                if(isTriggerAccessible(trigger)){
                                    if(trigger.type == "doorway") {
                                        var doorwayCenterX = (trigger.x+1.5)*tileSize;
                                        var flag = Player.loc.x < doorwayCenterX ? Player.getRenderSide() : !Player.getRenderSide();
                                        if((trigger.y+4)*tileSize > playerBounds.y && (trigger.y-2)*tileSize < playerBounds.y+playerBounds.height &&
                                            trigger.x*tileSize <= playerBounds.x+playerBounds.width && (trigger.x+3)*tileSize >= playerBounds.x && flag) {
                                            if(Player.loc.x < doorwayCenterX){
                                                Player.loc.x = (trigger.x+3)*tileSize;
                                            }else{
                                                Player.loc.x = (trigger.x)*tileSize;
                                            }
                                            playSound("doorway");
                                        }
                                    }else if(trigger.type == "prompt") {
                                        var triggerX = (trigger.x)*tileSize;
                                        if((trigger.y+4)*tileSize > playerBounds.y && (trigger.y-2)*tileSize < playerBounds.y+playerBounds.height &&
                                            triggerX-20 <= playerBounds.x+playerBounds.width && triggerX+20 >= playerBounds.x) {
                                            if(trigger.cutscene != undefined){
                                                playCutsceneCallback(trigger.cutscene);
                                            }
                                        }
                                    }else if(!this.inCloset && trigger.type == "closet") {
                                        var triggerX = (trigger.x)*tileSize;
                                        if((trigger.y+4)*tileSize > playerBounds.y && (trigger.y-2)*tileSize < playerBounds.y+playerBounds.height &&
                                           triggerX-20 <= playerBounds.x+playerBounds.width && triggerX+20 >= playerBounds.x) {
                                            this.inCloset = true;
                                            this.closetLocation.x = trigger.x;
                                            this.closetLocation.y = trigger.y;
                                        }
                                    }else if(trigger.type == "stairs") {
                                        var triggerX = (trigger.x)*tileSize;
                                        if((trigger.y+4)*tileSize > playerBounds.y && (trigger.y-2)*tileSize < playerBounds.y+playerBounds.height &&
                                           triggerX-20 <= playerBounds.x+playerBounds.width && triggerX+20 >= playerBounds.x) {
                                            var myFloor = getFloorForLocation(this.loc.x, this.loc.y);
                                            
                                            this.loc.y = myFloor == 0 ? 8.5*tileSize : 1.5*tileSize;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
		},
		
		getWidth: function() {
			return 32;
		},
		
		getHeight: function() {
			return 76;
		},

		getMass: function() {
			return 0.2;
		},
        
        getWalkSpeed: function() {
            return this.isSprinting ? 3 : 1;
        },
        
        getRenderSide: function() {
            return this.side;
        },
        
        getBounds: function() {
            return {
                type: "box",
                x: -this.getWidth()/2,
                y: 0,
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        
        getMovedBounds: function() {
            var bounds = this.getBounds();
            bounds.x += this.loc.x;
            bounds.y += this.loc.y;
            return bounds;
        },
        
        getNextMovedBounds: function() {
            var bounds = this.getBounds();
            bounds.x += this.loc.x+this.vel.x;
            bounds.y += this.loc.y+this.vel.y;
            return bounds;
        },
        
        isBloody: function() {
            return GameState.getFlag("gotFlashlight");
        },
        
        isFlashlightOn: function() {
            return this.hasFlashlight && this.flashlightOn;
        },
        
        canSprint: function() {
            return GameState.getFlag("gotFlashlight");
        },
        
        getFlashLightOffsetX: function() {
            var x = 11;
            
            if(this.isWalking){
                if(this.isSprinting) {
                    var progress = Math.abs(this.animSprint.getCurrentFrame()[0]-3)/6;
                    x += progress*23-5;
                }else{
                    var progress = this.animWalk.getCurrentFrame()[0];
                    if(progress >= 3) progress-=3;
                    x += progress == 1 ? -2 : 0;
                }
            }
            
            if(this.kneeFallProgress > 0) {
                x += this.kneeFallProgress*6;
            }
            
            return x;
        },
        
        getFlashLightOffsetY: function() {
            var y = 32;
            
            if(this.isWalking){
                if(this.isSprinting) {
                    var progress = Math.abs(this.animSprint.getCurrentFrame()[0]-3)/6;
                    y += progress*23-5;
                }else{
                    var progress = this.animWalk.getCurrentFrame()[0];
                    if(progress >= 3) progress-=3;
                    y += progress == 2 ? 0 : -1;
                }
            }
            
            if(this.kneeFallProgress > 0) {
                y += this.kneeFallProgress*-30;
            }
            
            return y;
        },
        
        getFlashLightRotation: function() {
            var rot = 0;
            
            if(this.isWalking && this.isSprinting) {
                var progress = Math.abs(this.animSprint.getCurrentFrame()[0]-3)/6;
                rot += (progress*40-10)/180.0*Math.PI;
            }
            
            return rot;
        },
        
        isFloorWet: function() {
            var map = getCurrentMap();
            var tile = map.tiles[Math.floor(this.loc.x/tileSize)][Math.floor(this.loc.y/tileSize)];
            if(tile != undefined) {
                var tileData = getCurrentTilesheet().tileData[tile.id];
                return tileData != undefined ? (tileData.isWet != undefined ? tileData.isWet : false) : false;
            }
            return false;
        },
        
        playFootstepSound: function() {
            var prefix = this.isFloorWet() ? "footstep-wet" : "footstep";
            var i = Math.floor(Math.random()*(4.99));
            playSound(prefix+"-"+i);
        },
        
        playSprintSound: function() {
            var i = Math.floor(Math.random()*(3.99));
            playSound("sprint-"+i);
        },
        
        getCurrentArea: function() {
            var map = getCurrentMap();
            for(var i = 0; i < map.areas.length; i++) {
                if(this.loc.x >= map.areas[i].x*tileSize && this.loc.x <= (map.areas[i].x+map.areas[i].width)*tileSize &&
                   this.loc.y >= map.areas[i].y*tileSize && this.loc.y <= (map.areas[i].y+map.areas[i].height)*tileSize) {
                    return i;
                }
            }
            return undefined;
        }
	};
    
    Player.flashLightRO = createRenderObject();
}