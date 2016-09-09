function BoundingBox(p_x, p_y, p_z, p_w, p_h, p_l) {
    if(p_x.x != undefined) {
        this.x = p_x.x;
        this.y = p_x.y;
        this.z = p_x.z;
        this.width = p_y.x;
        this.height = p_y.y;
        this.length = p_y.z;
    }else{
        this.x = p_x;
        this.y = p_y;
        this.z = p_z;
        this.width = p_w;
        this.height = p_h;
        this.length = p_l;
    }
    
    this.add = function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            this.x += p_x.x;
            this.y += p_x.y;
            this.z += p_x.z;
        }else{
            this.x += p_x;
            this.y += p_y;
            this.z += p_z;
        }
    }
    
    this.set = function(p_x, p_y, p_z) {
        if(p_x.x != undefined) {
            this.x = p_x.x;
            this.y = p_x.y;
            this.z = p_x.z;
        }else{
            this.x = p_x;
            this.y = p_y;
            this.z = p_z;
        }
    }
}