function BlockTallGrass() {
    this.getRenderType = function(){
        return 1;
    }
    this.isOpaque = function() {
        return false;
    }
    this.getCollisionBox = function() {
        return undefined;
    }
}

BlockTallGrass.prototype = new Block();