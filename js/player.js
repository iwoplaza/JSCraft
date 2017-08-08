var Player;

function initPlayer() {
	Player = {
		loc: new Vector3f(0, 0, 0),
		vel: new Vector3f(0, 0, 0),
        prevLoc: new Vector3f(0, 0, 0),
        headRotation: new Vector2f(0, 0),
		onGround: false,
        isWalking: false,
        isSprinting: false,
		timeInAir: 0,
		timeOnGround: 0,
        footstepSoundCooldown: 0,
        sprintSoundCooldown: 0,
        boundingBox: new BoundingBox(-0.4, 0, -0.4, 0.8, 1.85, 0.8),
        eyeOffset: new Vector3f(0, 1.65, 0),
        noClip: false,
        worldObj: undefined,
        objectMouseOver: undefined,
        punchAnimation: 0,
        health: 1,
        hunger: 1,
        thirst: 1,
        mana: 1,
        inventory: new Inventory(9,4,3),
        toolbar: new Inventory(9,1,3),
        equipped: new Inventory(3,4,3),
        selected: 0,
        itemInHand: undefined,
        
		update: function(deltaTime) {
            this.isWalking = false;
            
            this.vel.x = 0;
            this.vel.z = 0;
            if (scroll != 0){
                this.selected += scroll;
                scroll = 0;
                Player.selected = Player.selected<0?Player.selected+9:Player.selected>8?Player.selected-9:Player.selected;
            }
            
            if(keyState[key_Down]) {
                var forward = Camera.getForwardVector().getMultiplied(-1);
                forward.multiply(this.getWalkSpeed());
                this.vel.add(forward);
                this.isWalking = true;
            }
            
            if(keyState[key_Up]) {
                var forward = Camera.getForwardVector();
                forward.multiply(this.getWalkSpeed());
                this.vel.add(forward);
                this.isWalking = true;
            }
            
            if(keyState[key_Left]) {
                var left = Camera.getRightVector().getMultiplied(-1);
                left.multiply(this.getWalkSpeed());
                this.vel.add(left);
                this.isWalking = true;
            }
            
            if(keyState[key_Right]) {
                var right = Camera.getRightVector();
                right.multiply(this.getWalkSpeed());
                this.vel.add(right);
                this.isWalking = true;
            }
            
            if(keyState[32] && this.onGround) {
                this.vel.y = 10;
            }
            
            if(World.world.getChunkForBlockCoords(this.loc.x, this.loc.z) != undefined && World.world.getChunkForBlockCoords(this.loc.x, this.loc.z).rendered){
                this.vel.y -= 25*Time.delta;
            }
            
            if(this.isWalking && keyState[16] && this.canSprint()) this.isSprinting = true;
            else this.isSprinting = false;
            
            if(this.footstepSoundCooldown > 0){
                this.footstepSoundCooldown-=this.isSprinting ? 0.15 : 0.03;
                if(this.footstepSoundCooldown <= 0) this.footstepSoundCooldown = 0;
            }
            
            if(this.isSprinting){
                this.sprintSoundCooldown -= 0.13;
                if(this.sprintSoundCooldown <= 0){
                    this.sprintSoundCooldown = 6;
                    //this.playSprintSound();
                }
            }
            
            if(this.isWalking) {
                if(this.footstepSoundCooldown <= 0) {
                    //this.playFootstepSound();
                    this.footstepSoundCooldown = 1;
                }
            }else{
                this.footstepSoundCooldown = 0;
            }
            
            if(this.punchAnimation > 0) {
                this.punchAnimation = Math.max(0, this.punchAnimation-deltaTime*0.003);
            }
            
			if(this.onGround){
				this.timeInAir = 0;
				this.timeOnGround++;
			}else{
				this.timeInAir++;
				this.timeOnGround = 0;
			}
        
            //Ray Tracing
            var list1 = new Array(0);
            var scanRange = 4;
            var playerBlockPos = this.getBlockPos();
            for(var x = -scanRange; x < scanRange; x++) {
                for(var y = -scanRange; y < scanRange; y++) {
                    for(var z = -scanRange; z < scanRange; z++) {
                        if(World.world.getChunkForBlockCoords(playerBlockPos.x+x, playerBlockPos.y+y, playerBlockPos.z+z) != undefined) {
                            var blockData = World.world.getBlock(playerBlockPos.x+x, playerBlockPos.y+y, playerBlockPos.z+z);
                            if(blockData != undefined && Blocks.getBlock(blockData.id) != undefined) {
                                var boundingBox = Blocks.getBlock(blockData.id).getBoundingBox();
                                if(boundingBox != undefined) list1.push({
                                    boundingBox: boundingBox.getAdded(new Vector3f(playerBlockPos.x+x, playerBlockPos.y+y, playerBlockPos.z+z)),
                                    blockPos: new Vector3f(Math.floor(playerBlockPos.x+x), Math.floor(playerBlockPos.y+y), Math.floor(playerBlockPos.z+z)),
                                });
                            }
                        }
                    }
                }
            }
            var currentResult = undefined;
            for(var i = 0; i < list1.length; i++) {
                var rayTraceResult = CollisionHelper.calculateIntercept(list1[i].boundingBox, this.loc.getAdded(this.getEyeOffset()), this.loc.getAdded(this.getEyeOffset()).getAdded(Camera.getLookVector().getMultiplied(20)));
                if(rayTraceResult != undefined) {
                    rayTraceResult.hitPoint.add(this.loc.getAdded(this.getEyeOffset()).getInverted());
                    if(currentResult == undefined || rayTraceResult.hitPoint.getLengthSquared() < currentResult.hitPoint.getLengthSquared()){
                        currentResult = {
                            hitPoint: Vector3f.clone(rayTraceResult.hitPoint),
                            blockPos: list1[i].blockPos
                        }
                    }
                }
            }
            if(currentResult != undefined) currentResult.hitPoint.add(this.loc.getAdded(this.getEyeOffset()));
            this.objectMouseOver = currentResult;
            
            this.prevLoc.x = this.loc.x;
            this.prevLoc.y = this.loc.y;
            this.prevLoc.z = this.loc.z;
            
            this.moveByVelocity(deltaTime);
            
            Camera.set(this.loc.getAdded(this.getEyeOffset()));
		},
        
        resolveRayTracing: function() {
            
        },
        
        moveByVelocity: function(deltaTime) {
            if(this.noClip) {
                this.loc.add(this.vel.getMultiplied(deltaTime));
            }else{
                var axisalignedbb = this.getBoundingBox().getAdded(this.loc);
                var list1 = World.world.getCollisionBoxes(axisalignedbb.getAdded(this.vel.getMultiplied(deltaTime)));
                
                var x = this.vel.x*deltaTime;
                var y = this.vel.y*deltaTime;
                var z = this.vel.z*deltaTime;
                var xObs = false;
                var yObs = false;
                var zObs = false;
                
                for (var i = 0; i < list1.length; i++)
                {
                    y = list1[i].calculateYOffset(axisalignedbb, y);
                }
                
                var i_ = this.onGround || this.vel.y != y && this.vel.y < 0.0;

                for (var i = 0; i < list1.length; i++)
                {
                    x = list1[i].calculateXOffset(axisalignedbb, x);
                }
                
                for (var i = 0; i < list1.length; i++)
                {
                    z = list1[i].calculateZOffset(axisalignedbb, z);
                }
                
                if(x != this.vel.x*deltaTime) {
                    this.loc.x += x;
                    this.vel.x = 0;
                }
                
                if(y != this.vel.y*deltaTime) {
                    this.loc.y += y;
                    if(this.vel.y*deltaTime < 0) this.onGround = true;
                    this.vel.y = 0;
                }else{
                    this.onGround = false;
                }
                
                if(z != this.vel.z*deltaTime) {
                    this.loc.z += z;
                    this.vel.z = 0;
                }
                
                this.loc.add(this.vel.getMultiplied(deltaTime));
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
            return this.isSprinting ? 12 : 7;
        },
        
        getBoundingBox: function() {
            return this.boundingBox;
        },
        
        getBlockPos: function() {
            return new Vector3f(Math.floor(this.loc.x), Math.floor(this.loc.y), Math.floor(this.loc.z));
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
        
        getEyeOffset: function() {
            return this.eyeOffset;
        },
        
        canSprint: function() {
            return true;
        },
        
        playFootstepSound: function() {
            var prefix = "footstep";
            var i = Math.floor(Math.random()*(4.99));
            playSound(prefix+"-"+i);
        },
        
        playSprintSound: function() {
            var i = Math.floor(Math.random()*(3.99));
            playSound("sprint-"+i);
        },
        
        getItemInHand: function() {
            return this.itemInHand;
        },
        
        onPunch: function() {
            this.punchAnimation = 1;
        }
	};
}