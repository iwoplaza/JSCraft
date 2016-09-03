var LightMapManager = {
    lmoMap: new Array(0),
    lightSources: new Array(0),
    windowLights: new Array(0),
    windowLightRO: undefined,
    ambientSunRO: undefined,
    width: undefined,
    height: undefined,
    framebuffer: undefined,
    lightTexture: {},
    
    init: function(p_width, p_height) {
        this.width = p_width;
        this.height = p_height;
        this.windowLightRO = createRenderObject();
        drawTexturedRect(this.windowLightRO, 256, 256, -128, -128, [1, 1, 1, 1], [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0]
        ])
        
        this.ambientSunRO = createRenderObject();
        drawTexturedRect(this.ambientSunRO, gl.viewportWidth, gl.viewportHeight, 0, 0, [1, 1, 1, 0.4], [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0]
        ])
        
        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        
        this.lightTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.lightTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        //gl.generateMipmap(gl.TEXTURE_2D);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        
        var renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);
        
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.lightTexture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);
        
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    
    getLMO: function(p_x, p_y, p_light) {
        return this.lmoMap[p_x+","+p_y+","+p_light.name];
    },
    
    setLMO: function(p_x, p_y, p_light, p_lmo) {
        this.lmoMap[p_x+","+p_y+","+p_light.name] = p_lmo;
    },
    
    hideLMO: function(p_x, p_y, p_light) {
        if(this.lmoMap[p_x+","+p_y+","+p_light.name] != undefined)
            this.lmoMap[p_x+","+p_y+","+p_light.name].hide();
    },
    
    createLMO: function(p_x, p_y, p_light) {
        this.lmoMap[p_x+","+p_y+","+p_light.name] = {
            x: p_x,
            y: p_y,
            renderObject: createRenderObject(),
            isShown: true,
            
            hide: function() {
                this.isShown = false;
            },
            
            show: function() {
                this.isShown = true;
            },
            
            getIsShown: function() {
                return this.isShown;
            }
        };
        
        return this.getLMO(p_x, p_y);
    },
    
    addWindowLight: function(p_x, p_y) {
        this.windowLights.push({
            x: p_x,
            y: p_y
        });
    },
            
     /*addTextureLMO: function(p_translation, p_rotation, p_vertices, p_texture) {
                this.lmoList.push({
                    type: "texture",
                    translation: p_translation,
                    rotation: p_rotation,
                    vertices: p_vertices,
                    texture: p_texture,
                    draw: function() {
                        resetToWorldMatrix();
                        mat4.translate(mMatrix, [this.translation[0], this.translation[1], 0]);
                        mat4.rotate(mMatrix, this.rotation, [0, 0, 1]);
                    }
                });
    },*/
    
    addLightSource: function(p_name, p_x, p_y, p_radius, p_energy) {
        var source = {
            name: p_name,
            x: p_x,
            y: p_y,
            radius: p_radius,
            energy: p_energy
        };
        
        this.lightSources.push(source);
        return source;
    },
    
    renderLightmap: function() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        
        gl.viewport(0, 0, this.width, this.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.ortho(0,gl.viewportWidth,0,gl.viewportHeight,-100,100,pMatrix);
        mat4.identity(mMatrix);
        
        resetToGuiMatrix();
        useShader("default");

        /*bindTexture(getCurrentMap().bgTextureId);
        getCurrentMap().bgRenderObject.draw();*/
        
        Player.renderFlashlight();
        
        var keySet = Object.keys(this.lmoMap);
        bindTexture(spritesheets["character_flashlight"].textureId);
        resetToLightMapMatrix();
        
        calculateLMOs(getCurrentMap());
        disableTextures();
        resetToLightMapMatrix();
        for(var i = 0; i < keySet.length; i++) {
            if(this.lmoMap[keySet[i]].getIsShown())
                this.lmoMap[keySet[i]].renderObject.draw();
                this.lmoMap[keySet[i]].hide();
        }
        
        distributeWindowLights(getCurrentMap());
        for(var i = 0; i < this.windowLights.length; i++) {
            resetToLightMapMatrix();
            mat4.translate(mMatrix, [this.windowLights[i].x, this.windowLights[i].y, 0]);
            bindTexture(spritesheets[isSunny() ? "world_windowlight2" : "world_windowlight"].textureId);
            this.windowLightRO.draw();
        }
        
        this.lightSources = new Array(0);
        this.windowLights = new Array(0);
        
        if(isSunny()) {
            disableTextures();
            resetToGuiMatrix();
            this.ambientSunRO.draw();
        }
        
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    
    bindToShader: function() {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.lightTexture);
        gl.uniform1i(gl.getUniformLocation(getCurrentShader().program, "uLightMap"), 1);
    }
};