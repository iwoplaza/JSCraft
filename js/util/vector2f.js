function Vector2f(p_x, p_y) {
    this.x = p_x || 0;
	this.y = p_y || 0;

	this.getLength = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
    };

    this.normalize = function() {
		var length = this.getLength();
		if(length == 0) return;
		this.x/=length;
		this.y/=length;
	};
}