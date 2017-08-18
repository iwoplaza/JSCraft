function HBar(p_tSize, p_width, p_height, p_tPos, p_fill, p_pos) {
    this.tSize = p_tSize || 512;
    this.width = p_width || 1;
    this.height = p_height || 1;
    this.tPos = p_tPos|| [[0,0],[1,0],[0,1],[1,1]];
    this.fill = p_fill || 1;
    this.pos = p_pos || [0,0];
    this.mesh = new Mesh();
    this.init = function(){
        this.updateFillState();
    }
    this.draw = function(){
        this.mesh.draw();
    }
    this.updateFillState = function(p_fill){
        this.fill = Math.max(0, Math.min(p_fill || this.fill, 1));
        if (p_fill == 0) this.fill = 0;
        var fill = Math.floor(this.fill*(this.width));
        drawTexturedRect(this.mesh, this.pos[0], this.pos[1], fill, this.height, [1,1,1,1],
                         [[this.tPos[0]/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+fill)/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+fill)/this.tSize,(this.tPos[1]-this.height)/this.tSize],
                          [this.tPos[0]/this.tSize,(this.tPos[1]-this.height)/this.tSize]]);
    }
    this.init();
}