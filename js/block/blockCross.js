function BlockCross() {
    this.getRenderType = function(){
        return 1;
    }
    this.isOpaque = function() {
        return false;
    }
}

BlockCross.prototype = new Block();