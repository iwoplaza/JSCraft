var Mouse = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    mouseState: [false, false, false],
    
    getMouseWorldX() {
        return this.x/Camera.scale-Camera.getOffsetX()+Camera.x;
    },
    
    getMouseWorldY() {
        return -(this.y/Camera.scale-Camera.getOffsetY())+Camera.y;
    },
    
    isInsideTheGame: function() {
        return this.x > 0 && this.x < gl.viewportWidth && this.y > 0 && this.y < gl.viewportHeight;
    }
}

document.onmousemove = function(e) {
	e = e || window.event;
    
    Mouse.lastX = Mouse.x+0;
    Mouse.lastY = Mouse.y+0;

	Mouse.x = e.pageX - canvas.getBoundingClientRect().left;
	Mouse.y = e.pageY - canvas.getBoundingClientRect().top;
    
    runEventCallbacks("mouseMove");
}

document.onmousedown = function(e) {
	Mouse.mouseState[e.button] = true;
    runEventCallbacks("mouseDown", e);
}

document.onmouseup = function(e) {
	Mouse.mouseState[e.button] = false;
    runEventCallbacks("mouseUp", e);
}

var mouseEventQueue = new Array(0);

function addMouseEventListener(p_eventName, p_function) {
    if(mouseEventQueue[p_eventName] == undefined) mouseEventQueue[p_eventName] = new Array(0);
    mouseEventQueue[p_eventName].push(p_function);
}

function runEventCallbacks(p_eventName, event) {
    if(mouseEventQueue[p_eventName] == undefined) return;
    for(var i = 0; i < mouseEventQueue[p_eventName].length; i++) {
        mouseEventQueue[p_eventName][i](event);
    }
}