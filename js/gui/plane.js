function Plane(p_tSize, p_width, p_height, p_tPos) {
    this.tSize = p_tSize || 512;
    this.width = p_width || 1;
    this.height = p_height || 1;
    this.tPos = p_tPos|| [0,0];
    this.mesh = new Mesh();
    
    this.draw = function(){
        this.mesh.draw();
    }
    this.init = function(){
        drawTexturedRect(this.mesh, 0, 0, this.width, this.height, [1,1,1,1],
                         [[this.tPos[0]/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+this.width)/this.tSize,this.tPos[1]/this.tSize],
                          [(this.tPos[0]+this.width)/this.tSize,(this.tPos[1]-this.height)/this.tSize],
                          [this.tPos[0]/this.tSize,(this.tPos[1]-this.height)/this.tSize]]);
    }
    this.init();
}