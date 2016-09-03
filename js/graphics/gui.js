function drawJumpChargeUpBar() {
	var d = new Date();
	var n = d.getTime();
	var vibrationX = Player.jumpCharge >= 1.0 ? Math.sin(n*0.1)*2 : 0;
	var vibrationY = Player.jumpCharge >= 1.0 ? Math.sin(n*0.15+0.4)*2 : 0;
	
	var width = 100;
	var height = 20;
	var x = gl.viewportWidth/2-width/2 + vibrationX;
	var y = 10 + vibrationY ;
	
	drawProgressBar(x+vibrationX, y+vibrationY, width, height, Player.jumpCharge, [0,0,1,1], [0,1,0,1]);
}

function drawProgressBar(_x, _y, _width, _height, _progress, _bgColor, _barColor) {
	resetToGuiMatrix();
	
	mat4.translate(mMatrix, [_x, _y, 0]);
	
	drawRect(_width, _height, 0, 0, _bgColor);
	draw();
	drawRect((_width-2)*_progress, _height-2, 1, 1, _barColor);
	draw();
}