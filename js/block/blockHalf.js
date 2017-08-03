function BlockHalf() {
    this.getRenderType = function(){
        return 2;
    }
    this.isOpaque = function() {
        return false;
    }
}

BlockHalf.prototype = new Block();