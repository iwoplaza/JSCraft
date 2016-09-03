var fontRegistry = new Array(0);

function initFonts() {
	createFont("normal");
	createFont("slick");
    createFont("normal_big");
}

function createFont(_name) {
	fontRegistry[_name] = {
		name: _name,
		textureId: -1,
		spaceWidth: 0,
		frameWidth: 0,
		frameHeight: 0,
		sheetWidth: 0,
		sheetHeight: 0,
		charData: new Array(),
		
		getTextWidth: function(_text, _scale, _charSeperation) {
			_scale = _scale || 1.0;
			_charSeperation = _charSeperation || 0.0;
			
			var cursorLoc = 0;
			var codingStyle = false;
			for(var c = 0; c < _text.length; c++){
				if(_text[c] == '#'){
					codingStyle = !codingStyle;
					codedStyle = "";
				}else if(codingStyle){
				}else if(_text[c] == ' '){
					cursorLoc+=this.spaceWidth;
				}else{
				    if(this.charData[_text[c]] != undefined){
							cursorLoc+=this.charData[_text[c]].width+_charSeperation;
				    }
				}
			}
			
			cursorLoc*=_scale;
			
			return cursorLoc;
		}
	};
	
	ResourceManager.registerResourceToLoad();
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if(xmlhttp.status==200 && xmlhttp.readyState==4){    
			var words = xmlhttp.responseText.split('\n');
            var charIdx = 0;
			for(var i = 0; i < words.length; i++){
				var entries = words[i].split(' ');
				if(entries[0] == "SPACE"){
				    fontRegistry[_name].spaceWidth = parseInt(entries[1]);
				}else if(entries[0] == "FRAME_WIDTH"){
				    fontRegistry[_name].frameWidth = parseInt(entries[1]);
				}else if(entries[0] == "FRAME_HEIGHT"){
				    fontRegistry[_name].frameHeight = parseInt(entries[1]);
				}else if(entries[0] == "SHEET_WIDTH"){
				    fontRegistry[_name].sheetWidth = parseInt(entries[1]);
				}else if(entries[0] == "SHEET_HEIGHT"){
				    fontRegistry[_name].sheetHeight = parseInt(entries[1]);
				}else{
				    fontRegistry[_name].charData[entries[0]] = {
                        char: entries[0],
                        width: parseInt(entries[1]),
                        offsetY: parseInt(entries[2]),
                        renderObject: new Mesh(),
                    };
                    
                    var u0 = (charIdx%16)*fontRegistry[_name].frameWidth/fontRegistry[_name].sheetWidth;
                    var v0 = (Math.floor(charIdx/16)+1)*fontRegistry[_name].frameHeight/fontRegistry[_name].sheetHeight;
                    var u1 = ((charIdx)%16+1)*fontRegistry[_name].frameWidth/fontRegistry[_name].sheetWidth;
                    var v1 = (Math.floor(charIdx/16))*fontRegistry[_name].frameHeight/fontRegistry[_name].sheetHeight;
                    
                    fontRegistry[_name].charData[entries[0]].renderObject.fillOut(
                        [
                            0, 0,
                            fontRegistry[_name].frameWidth, 0,
                            0, fontRegistry[_name].frameHeight,
                            fontRegistry[_name].frameWidth, 0,
                            0, fontRegistry[_name].frameHeight,
                            fontRegistry[_name].frameWidth, fontRegistry[_name].frameHeight,
                        ],
                        [
                            1, 1, 1, 1,
                            1, 1, 1, 1,
                            1, 1, 1, 1,
                            1, 1, 1, 1,
                            1, 1, 1, 1,
                            1, 1, 1, 1,
                        ],
                        [
                            u0,v0,
                            u1,v0,
                            u0,v1,
                            u1,v0,
                            u0,v1,
                            u1,v1,
                        ]
                    );
                    
                    charIdx++;
				}
			}
			
			ResourceManager.checkOutResourceLoaded();
		}
	}
	xmlhttp.open("GET","res/font/"+_name+".txt",true);
	xmlhttp.send();
	
	ResourceManager.registerResourceToLoad();
	var fontImage = new Image();
	fontImage.onload = function() {
        fontRegistry[_name].textureId = gl.createTexture();
        TextureManager.handleTextureLoaded(fontImage, fontRegistry[_name].textureId);
		ResourceManager.checkOutResourceLoaded();
	}
	fontImage.src = "res/font/"+_name+".png";
}



function drawWorldText(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
    if(_loc == undefined) _loc = [0, 0];
    
	resetToWorldMatrix();
	mat4.translate(mMatrix, [_loc[0], _loc[1], 0]);
    
    drawText(_text, _name, _loc, _scale, _alignment, _charSeperation);
}

function drawGuiText(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
    if(_loc == undefined) _loc = [0, 0];
    
	resetToGuiMatrix();
	mat4.translate(mMatrix, [_loc[0], _loc[1], 0]);
    
    drawText(_text, _name, _loc, _scale, _alignment, _charSeperation);
}

function drawText(_text, _name, _loc, _scale, _alignment /*0 - left, 1 - center, 2 - right*/, _charSeperation) {
	_scale = _scale || 1.0;
	_charSeperation = _charSeperation || 0.0;
	_alignment = _alignment || 0;
	
    useShader("font");
	enableTextures();
    
    var textOriginX = _alignment == 1 ? -fontRegistry[_name].getTextWidth(_text, _scale, _charSeperation)/2 : _alignment == 2 ? -fontRegistry[_name].getTextWidth(_text, _scale, _charSeperation) : 0;
    mat4.translate(mMatrix, [textOriginX, 0, 0]);
    mat4.scale(mMatrix, [_scale, _scale, _scale]);
    
    var cursorLoc = 0;
    var framesPerRow = Math.floor(fontRegistry[_name].frameWidth/fontRegistry[_name].sheetWidth);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fontRegistry[_name].textureId);
    gl.uniform1i(gl.getUniformLocation(getCurrentShader().program, "uSampler"), 0);
    
    var codingStyle = false;
    var codedStyle = "";
    var color = [1,1,1,1];
    gl.uniform4f(gl.getUniformLocation(getCurrentShader().program, "uFontColor"), color[0],color[1],color[2],color[3]);
    for(var c = 0; c < _text.length; c++){
        if(_text[c] == '#'){
            codingStyle = !codingStyle;
			color = [0,1,0,1];
			if(codingStyle == false){
				var newStyle = getChatFormatting(codedStyle);
				if(newStyle != undefined){
					color = newStyle;
                    gl.uniform4f(gl.getUniformLocation(getCurrentShader().program, "uFontColor"), color[0],color[1],color[2],color[3]);
				}
            }
            codedStyle = "";
		}else if(codingStyle){
			codedStyle+=_text[c];
		}else if(_text[c] == ' '){
            mat4.translate(mMatrix, [fontRegistry[_name].spaceWidth, 0, 0]);
		}else if(fontRegistry[_name].charData[_text[c]] != undefined){
            var character = fontRegistry[_name].charData[_text[c]];
            character.renderObject.draw();
            mat4.translate(mMatrix, [character.width+_charSeperation, 0, 0]);
		}
	}
	
	disableTextures();
}

function getFont(_name) {
    return fontRegistry[_name];
}

function getChatFormatting(text) {
	if(text=="c"){
		return [1,0,0,1];
	}else if(text=="k"){
		return [1,1,0.4,1];
	}else if(text=="a"){
		return [1,0.4,0.7,1];
	}else if(text=="0"){
		return [1,1,1,1];
	}
	
	return undefined;
}