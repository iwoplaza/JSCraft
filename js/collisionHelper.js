var testTriangleRO;
var testRectangleRO;
var testTriangleBounds;
var testRectangleBounds;

var CollisionHelper = {
    collide: function(loc, vel, myBounds, p_bounds) {
        if(myBounds.type == "box"){
            if(p_bounds.type == "box"){
                return this.collideBoxToBox(loc, vel, myBounds, p_bounds);
            }
            if(p_bounds.type == "triangle"){
                return this.collideBoxToTriangle(loc, vel, myBounds, p_bounds);
            }
        }
    },

    collideBoxToBox: function(loc, vel, myBounds, p_bounds) {
        var nextX = loc.x + vel.x;
        var nextY = loc.y + vel.y;
        var collisionData = undefined;

        if(nextX+myBounds.x+myBounds.width > p_bounds.x && nextX+myBounds.x < p_bounds.x+p_bounds.width &&
           nextY+myBounds.y+myBounds.height > p_bounds.y && nextY+myBounds.y < p_bounds.y+p_bounds.height){
            collisionData = {
                type: "box-box"
            };

            var right = nextX+myBounds.x+myBounds.width;
            var bottom = nextY+myBounds.y;
            var left = nextX+myBounds.x;
            var top = nextY+myBounds.y+myBounds.height;
            var collSide = -1; //-1 = none, 0 = top, 1 = right, 2 = bottom, 3 = left

            var lDist = Math.abs(right-p_bounds.x);
            var rDist = Math.abs(left-p_bounds.x-p_bounds.width);
            var tDist = Math.abs(bottom-p_bounds.y-p_bounds.height);
            var bDist = Math.abs(top-p_bounds.y);
            var sDist = rDist; //Smallest distance

            if(lDist < sDist) sDist = lDist;
            if(tDist < sDist) sDist = tDist;
            if(bDist < sDist) sDist = bDist;

            if(sDist == tDist) collSide = 0;
            if(sDist == rDist) collSide = 1;
            if(sDist == bDist) collSide = 2;
            if(sDist == lDist) collSide = 3;

            switch(collSide){
                case 0:
                    if(vel.y < 0) collisionData.velY = 0;
                    collisionData.locY = p_bounds.y+p_bounds.height+myBounds.y;
                    collisionData.onGround = true;
                break;
                case 1:
                    if(vel.x < 0) collisionData.velX = 0;
                    collisionData.locX = p_bounds.x+p_bounds.width-myBounds.x;
                    collisionData.onWall = true;
                    collisionData.wallSide = true;
                break;
                case 2:
                    if(vel.y > 0) collisionData.velY = 0;
                    collisionData.locY = p_bounds.y-myBounds.height;
                    collisionData.onCelling = true;
                break;
                case 3:
                    if(vel.x > 0) collisionData.velX = 0;
                    collisionData.locX = p_bounds.x-myBounds.x-myBounds.width;

                    collisionData.onWall = true;
                    collisionData.wallSide = false;
                break;
                default:
                break;
            }
        }

        return collisionData;
    },
    
    collideBoxToTriangle: function(loc, vel, myBounds, p_bounds) {
        var nextX = loc.x + vel.x;
        var nextY = loc.y + vel.y;
        var collisionData = undefined;
        
        var lines = [
            createLine(p_bounds.points[0], p_bounds.points[1]),
            createLine(p_bounds.points[1], p_bounds.points[2]),
            createLine(p_bounds.points[2], p_bounds.points[0])
        ];
        
        var triMinX = p_bounds.points[0].x;
        if(p_bounds.points[1].x < triMinX) triMinX = p_bounds.points[1].x;
        if(p_bounds.points[2].x < triMinX) triMinX = p_bounds.points[2].x;
        var triMinY = p_bounds.points[0].y;
        if(p_bounds.points[1].y < triMinY) triMinY = p_bounds.points[1].y;
        if(p_bounds.points[2].y < triMinY) triMinY = p_bounds.points[2].y;
        var triMaxX = p_bounds.points[0].x;
        if(p_bounds.points[1].x > triMaxX) triMaxX = p_bounds.points[1].x;
        if(p_bounds.points[2].x > triMaxX) triMaxX = p_bounds.points[2].x;
        var triMaxY = p_bounds.points[0].y;
        if(p_bounds.points[1].y > triMaxY) triMaxY = p_bounds.points[1].y;
        if(p_bounds.points[2].y > triMaxY) triMaxY = p_bounds.points[2].y;
        
        //Rectangle LeftSide
        var sideMinX = loc.x+myBounds.x;
        var sideMinY = loc.y+myBounds.y;
        var sideMaxX = loc.x+myBounds.x+myBounds.width;
        var sideMaxY = loc.y+myBounds.y+myBounds.height;
        for(var i = 0; i < lines.length; i++) {
            var intersectionY = lines[i].getY(sideMinX);
            if(intersectionY >= sideMinY && intersectionY <= sideMaxY &&
               intersectionY >= lines[i].minY && intersectionY <= lines[i].maxY) {
                collisionData = {name: "Works!"};
            }
            
            intersectionY = lines[i].getY(sideMaxX);
            if(intersectionY >= sideMinY && intersectionY <= sideMaxY &&
               intersectionY >= lines[i].minY && intersectionY <= lines[i].maxY) {
                collisionData = {name: "Works!"};
            }
            
            var intersectionX = lines[i].getX(sideMinY);
            if(intersectionX >= sideMinX && intersectionX <= sideMaxX &&
               intersectionX >= lines[i].minX && intersectionX <= lines[i].maxX) {
                collisionData = {name: "Works!"};
            }
            
            intersectionX = lines[i].getX(sideMaxY);
            if(intersectionX >= sideMinX && intersectionX <= sideMaxX &&
               intersectionX >= lines[i].minX && intersectionX <= lines[i].maxX) {
                collisionData = {name: "Works!"};
            }
        }
        
        return collisionData;
    }
}

function createLine(p_p1, p_p2) {
    var p_a = (p_p2.y-p_p1.y)/(p_p2.x-p_p1.x);
    
    var line = {
        p1: p_p1,
        p2: p_p2,
        a: p_a,
        b: p_p1.y-(p_a*p_p1.x),
        
        getY: function(x) {
            return this.a*x+this.b;
        },
        
        getX: function(y) {
            return (y-this.b)/this.a;
        },
        
        getNormal: function() {
            var normal = create_Vector2f(0, 0);
            var angle = Math.atan2(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
            normal.x = Math.cos(angle+Math.PI/2);
            normal.y = Math.sin(angle+Math.PI/2);
            return normal;
        }
    };
    
    if(line.p1.x < line.p2.x){
        line.minX = line.p1.x;
        line.maxX = line.p2.x;
    }else{
        line.minX = line.p2.x;
        line.maxX = line.p1.x;
    }
    
    if(line.p1.y < line.p2.y){
        line.minY = line.p1.y;
        line.maxY = line.p2.y;
    }else{
        line.minY = line.p2.y;
        line.maxY = line.p1.y;
    }

    return line;
}