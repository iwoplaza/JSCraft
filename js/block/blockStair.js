function BlockStair() {
    this.getRenderType = function(p_rotation){
        switch(p_rotation){
            case 0:
                return 3;
            case 1:
                return 5;
            case 2:
                return 4;
            default:
                return 3;
        }
    }
    this.isOpaque = function() {
        return false;
    }
}

BlockStair.prototype = new Block();