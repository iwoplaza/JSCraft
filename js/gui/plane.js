function Plane(p_tSize, p_width, p_height, p_tPos, p_center, p_pos) {
    this.tSize = p_tSize || 512;
    this.width = p_width || 1;
    this.height = p_height || 1;
    this.tPos = p_tPos || [0,0];
    this.center = p_center || false;
    this.pos = p_pos || [0,0];
    this.mesh = new Mesh();
    this.init();
}
Plane.prototype.draw = function(){
    this.mesh.draw();
}
Plane.prototype.init = function(){
    drawTexturedRect(this.mesh, (this.center?((-this.width/2)+this.pos[0]):this.pos[0]), (this.center?((-this.height/2)+this.pos[1]):this.pos[1]), this.width, this.height, [1,1,1,1],
                     [[this.tPos[0]/this.tSize,this.tPos[1]/this.tSize],
                      [(this.tPos[0]+this.width)/this.tSize,this.tPos[1]/this.tSize],
                      [(this.tPos[0]+this.width)/this.tSize,(this.tPos[1]-this.height)/this.tSize],
                      [this.tPos[0]/this.tSize,(this.tPos[1]-this.height)/this.tSize]]);
}