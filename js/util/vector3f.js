function Vector3f(p_x, p_y, p_z) {
    this.x = p_x || 0;
	this.y = p_y || 0;
    this.z = p_z || 0;

	this.getLength = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    };

    this.normalize = function() {
		var length = this.getLength();
		if(length == 0) return;
		this.x /= length;
		this.y /= length;
        this.z /= length;
	};
    
    this.set = function(p_vec) {
        this.x = p_vec.x;
        this.y = p_vec.y;
        this.z = p_vec.z;
    };
    
    this.getMultiplied = function(p_x, p_y, p_z) {
        p_y = p_y || p_x;
        p_z = p_z || p_x;
        
        return new Vector3f(this.x*p_x, this.y*p_y, this.z*p_z);
    };
    
    this.getInverted = function() {
        return this.getMultiplied(-1);
    };
    
    this.multiply = function(p_x, p_y, p_z) {
        this.set(this.getMultiplied(p_x, p_y, p_z));
    };
    
    this.invert = function() {
        this.set(this.getInverted());
    };
}