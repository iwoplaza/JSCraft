var Camera = {
	viewMatrix: mat4.create(),

	location: new Vector3f(),
    targetLocation: new Vector3f(),
    rotation: new Vector3f(),
	
	updateViewMatrix: function() {
		this.identity();
        mat4.rotate(this.viewMatrix, this.rotation.x/180.0*Math.PI, [1, 0, 0]);
        mat4.rotate(this.viewMatrix, this.rotation.y/180.0*Math.PI, [0, 1, 0]);
		mat4.translate(this.viewMatrix, [-this.getX(), -this.getY(), -this.getZ()]);
	},
    
    getX: function() {
        return this.location.x;
    },
    
    getY: function() {
        return this.location.y;
    },
    
    getZ: function() {
        return this.location.z;
    },
    
    getLookVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI)*Math.cos(this.rotation.x/180.0*Math.PI);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI)*Math.cos(this.rotation.x/180.0*Math.PI);
        vec.y = -Math.sin(this.rotation.x/180.0*Math.PI);
        
        return vec;
    },
    
    getForwardVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI);
        
        return vec;
    },
    
    getRightVector: function() {
        var vec = new Vector3f();
        
        vec.x = Math.sin(this.rotation.y/180.0*Math.PI+Math.PI/2);
        vec.z = -Math.cos(this.rotation.y/180.0*Math.PI+Math.PI/2);
        
        return vec;
    },
	
	identity: function() {
		mat4.identity(this.viewMatrix);
	},
    
    setTarget: function(p_x, p_y, p_z) {
        this.targetLocation.x = p_x;
        this.targetLocation.y = p_y;
        this.targetLocation.z = p_z;
    },
    
    set: function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            p_y = p_x.y;
            p_z = p_x.z;
            p_x = p_x.x;
        }
        
        this.targetLocation.x = p_x;
        this.targetLocation.y = p_y;
        this.targetLocation.z = p_z;
        this.location.x = p_x;
        this.location.y = p_y;
        this.location.z = p_z;
    },
    
    moveTarget: function(p_x, p_y, p_z) {
        if(p_y == undefined && p_x.x != undefined) {
            p_y = p_x.y;
            p_z = p_x.z;
            p_x = p_x.x;
        }
        
        this.targetLocation.x += p_x;
        this.targetLocation.y += p_y;
        this.targetLocation.z += p_z;
    },
    
    update: function(deltaTime) {
        var progress = Math.max(0, Math.min(1, 0.2*deltaTime*0.1));
        
        this.location.x += (this.targetLocation.x-this.location.x)*progress;
		this.location.y += (this.targetLocation.y-this.location.y)*progress;
        this.location.z += (this.targetLocation.z-this.location.z)*progress;
    }
};