var audioCtx;

var soundBuffers = new Array(0);

var zoomSoundSync = false;
var jumpChargeSoundSync = false;

function initAudio() {
	try {
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		audioCtx = new AudioContext();
	}catch(e) {
		alert('Web Audio API is not supported in this browser');
	}
	
	/*downloadSound("res/sfx/pick-up.wav", "pickUp");
	downloadSound("res/sfx/zoom-in.wav", "zoomIn");
	downloadSound("res/sfx/zoom-out.wav", "zoomOut");
	downloadSound("res/sfx/land.wav", "land");
	downloadSound("res/sfx/jump.wav", "jump");
	downloadSound("res/sfx/charge-up.wav", "chargeUp");*/
    
    downloadSound("res/sfx/male-talk.ogg", "male-talk");
    downloadSound("res/sfx/switch-on.ogg", "switch-on");
    downloadSound("res/sfx/switch-off.ogg", "switch-off");
    downloadSound("res/sfx/rabbit-0.ogg", "rabbit-0");
    downloadSound("res/sfx/rabbit-1.ogg", "rabbit-1");
    
    downloadSound("res/sfx/footstep-0.ogg", "footstep-0");
    downloadSound("res/sfx/footstep-1.ogg", "footstep-1");
    downloadSound("res/sfx/footstep-2.ogg", "footstep-2");
    downloadSound("res/sfx/footstep-3.ogg", "footstep-3");
    downloadSound("res/sfx/footstep-4.ogg", "footstep-4");
    downloadSound("res/sfx/footstep-wet-0.ogg", "footstep-wet-0");
    downloadSound("res/sfx/footstep-wet-1.ogg", "footstep-wet-1");
    downloadSound("res/sfx/footstep-wet-2.ogg", "footstep-wet-2");
    downloadSound("res/sfx/footstep-wet-3.ogg", "footstep-wet-3");
    downloadSound("res/sfx/footstep-wet-4.ogg", "footstep-wet-4");
    downloadSound("res/sfx/sprint-0.ogg", "sprint-0");
    downloadSound("res/sfx/sprint-1.ogg", "sprint-1");
    downloadSound("res/sfx/sprint-2.ogg", "sprint-2");
    downloadSound("res/sfx/sprint-3.ogg", "sprint-3");
    downloadSound("res/sfx/play.ogg", "play");
    downloadSound("res/sfx/doorway.ogg", "doorway");
    downloadSound("res/sfx/locked.ogg", "locked");
    downloadSound("res/sfx/intro.ogg", "intro");
    downloadSound("res/sfx/kitchen-massacre.ogg", "kitchen-massacre");
    downloadSound("res/sfx/chirping.ogg", "chirping");
    downloadSound("res/sfx/squirt.ogg", "squirt");
    downloadSound("res/sfx/kitchen-drawer.ogg", "kitchen-drawer");
    downloadSound("res/sfx/light-switch.ogg", "light-switch");
    
    downloadSound("res/sfx/ambience-suspense.ogg", "ambience-suspense");
    downloadSound("res/sfx/ambience-chase.ogg", "ambience-chase");
    downloadSound("res/sfx/game-over.ogg", "game-over");
    
    downloadSound("res/sfx/Sorrow.ogg", "Sorrow");
}

function onError() {

}

function downloadSound(url, _bufferName) {
	soundBuffers[_bufferName] = {
		name: _bufferName,
		data: null,
        playing: false
	};
	
	ResourceManager.registerResourceToLoad();
	
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';

	request.onload = function() {
		audioCtx.decodeAudioData(request.response, function(buffer) {
            soundBuffers[_bufferName].data = buffer;
			ResourceManager.checkOutResourceLoaded();
		}, onError);
	}
	request.send();
}

function playSound(bufferName, sourceX, sourceY) {
    if(soundBuffers[bufferName] != undefined){
        soundBuffers[bufferName].source = audioCtx.createBufferSource();
        soundBuffers[bufferName].source.buffer = soundBuffers[bufferName].data;
        soundBuffers[bufferName].playing = true;
        
        if(sourceX != undefined && sourceY != undefined) {
            soundBuffers[bufferName].panNode = audioCtx.createStereoPanner();
            soundBuffers[bufferName].gainNode = audioCtx.createGain();
            
            soundBuffers[bufferName].panNode.pan.value = Math.max(0, Math.min(1, (sourceX-Camera.x)*0.01));
            soundBuffers[bufferName].gainNode.gain.value = Math.max(0, Math.min(1, (700-Math.sqrt((sourceX-Camera.x)*(sourceX-Camera.x) + (sourceY-Camera.y)*(sourceY-Camera.y)))/700));
            
            soundBuffers[bufferName].source.connect(soundBuffers[bufferName].panNode);
            soundBuffers[bufferName].panNode.connect(soundBuffers[bufferName].gainNode);
            soundBuffers[bufferName].gainNode.connect(audioCtx.destination);
        }else{
            soundBuffers[bufferName].source.connect(audioCtx.destination);
        }
        
        soundBuffers[bufferName].source.start(0);
    }
}

function playLoop(bufferName) {
    if(soundBuffers[bufferName] != undefined){
        soundBuffers[bufferName].source = audioCtx.createBufferSource();
        soundBuffers[bufferName].gainNode = audioCtx.createGain();
        soundBuffers[bufferName].gainNode.gain.value = 1;
        soundBuffers[bufferName].source.buffer = soundBuffers[bufferName].data;
        soundBuffers[bufferName].source.loop = true;
        soundBuffers[bufferName].playing = true;
        soundBuffers[bufferName].source.connect(soundBuffers[bufferName].gainNode);
        soundBuffers[bufferName].gainNode.connect(audioCtx.destination);
        soundBuffers[bufferName].source.start(0);
    }
}

function stopSound(bufferName) {
    if(soundBuffers[bufferName] != undefined){
        if(soundBuffers[bufferName].source != undefined && soundBuffers[bufferName].playing){
            soundBuffers[bufferName].source.stop();
            soundBuffers[bufferName].playing = false;
        }
    }
}

function fadeOutSound(bufferName, seconds) {
    if(soundBuffers[bufferName] != undefined) {
        if(soundBuffers[bufferName].source != undefined && soundBuffers[bufferName].playing){
            var duration = soundBuffers[bufferName].source.buffer.duration;
            var currTime = audioCtx.currentTime;
            soundBuffers[bufferName].gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + seconds);
        }
    }
}