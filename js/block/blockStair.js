function BlockStair() {
    this.getRenderType = function(){
        return 3;
    }
    this.isOpaque = function() {
        return false;
    }
}

BlockStair.prototype = new Block();