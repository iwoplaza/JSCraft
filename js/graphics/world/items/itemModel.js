function ItemModel() {
    this.parts = new Array(0);
    this.mesh = new Mesh();
    
    this.render = function() {
        var bufferData = {
            vertices: new Array(0),
            colors: new Array(0),
            texCoords: new Array(0),
            normals: new Array(0)
        };
        
        for(var p = 0; p < this.parts.length; p++) {
            var part = this.parts[p];
            if(part.type == "staticVoxels") {
                for(var x = 0; x < part.width; x++) {
                    for(var y = 0; y < part.height; y++) {
                        for(var z = 0; z < part.length; z++) {
                            ItemModel.renderVoxel(bufferData, {x: x, y: y, z: z}, part);
                        }
                    }
                }
            }
        }
        
        this.mesh.fillOut(bufferData.vertices, bufferData.colors, bufferData.texCoords, bufferData.normals);
        
        //drawTexturedCube(this.mesh, -0.01, -0.01, -0.01, 1.02, 1.02, 1.02, [1, 1, 1, 1]);
    }
    
    this.addPart = function(p_part) {
        this.parts.push(p_part);
        return this;
    }
    
    this.display = function() {
        this.mesh.draw();
    }
}

ItemModel.registry = new Array(0);
ItemModel.register = function(p_name, p_model) {
    p_model.render();
    ItemModel.registry[p_name] = p_model;
}
ItemModel.get = function(p_name) {
    return ItemModel.registry[p_name];
}

ItemModel.renderVoxel = function(p_buffer, p_voxelLoc, p_part) {
    if(p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z) == undefined) return;
    
    var showFaces = new Array(0);
    
    var neighbours = [
        p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z+1),//p_world.getBlock(p_x, p_y, p_z+1),
        p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z-1),//p_world.getBlock(p_x, p_y, p_z-1),
        p_part.getVoxel(p_voxelLoc.x-1, p_voxelLoc.y, p_voxelLoc.z),//p_world.getBlock(p_x-1, p_y, p_z),
        p_part.getVoxel(p_voxelLoc.x+1, p_voxelLoc.y, p_voxelLoc.z),//p_world.getBlock(p_x+1, p_y, p_z),
        p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y+1, p_voxelLoc.z),//p_world.getBlock(p_x, p_y-1, p_z),
        p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y-1, p_voxelLoc.z)//p_world.getBlock(p_x, p_y+1, p_z)
    ];
    for(var i = 0; i < neighbours.length; i++) {
        showFaces.push(neighbours[i] == undefined);
    }
    
    var visibleFaces = 0;
    for(var i = 0; i < showFaces.length; i++) {
        if(showFaces[i]) visibleFaces++;
    }
    
    var offsetX = p_voxelLoc.x;
    var offsetY = -p_voxelLoc.y;
    var offsetZ = p_voxelLoc.z;
    var width = 1;
    var height = 1;
    var length = 1;
    
    if(showFaces[0]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Front
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ]);
    if(showFaces[1]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Back
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ,
        offsetX, offsetY+height, offsetZ
    ]);
    if(showFaces[2]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Left
        offsetX, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY+height, offsetZ+length
    ]);
    if(showFaces[3]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Right
        offsetX+width, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY+height, offsetZ
    ]);
    if(showFaces[4]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Down
        offsetX, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ,
        offsetX, offsetY, offsetZ+length,
        offsetX, offsetY, offsetZ+length,
        offsetX+width, offsetY, offsetZ,
        offsetX+width, offsetY, offsetZ+length
    ]);
    if(showFaces[5]) p_buffer.vertices.push.apply(p_buffer.vertices, [
        //Up
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ,
        offsetX, offsetY+height, offsetZ+length,
        offsetX+width, offsetY+height, offsetZ+length
    ]);
    
    for(var i = 0; i < visibleFaces*6*2; i++) {
        p_buffer.texCoords.push(0);
    }
    
    for(var i = 0; i < visibleFaces*6; i++) {
		p_buffer.colors.push(p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z).color[0]);
		p_buffer.colors.push(p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z).color[1]);
		p_buffer.colors.push(p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z).color[2]);
		p_buffer.colors.push(p_part.getVoxel(p_voxelLoc.x, p_voxelLoc.y, p_voxelLoc.z).color[3]);
	}
    
    if(showFaces[0]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ]);
    if(showFaces[1]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1,
        0, 0, -1
    ]);
    if(showFaces[2]) p_buffer.normals.push.apply(p_buffer.normals,  [
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0,
        -1, 0, 0
    ]);
    if(showFaces[3]) p_buffer.normals.push.apply(p_buffer.normals,  [
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0,
        1, 0, 0
    ]);
    if(showFaces[4]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0,
        0, -1, 0
    ]);
    if(showFaces[5]) p_buffer.normals.push.apply(p_buffer.normals,  [
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
    ]);
}

ItemModel.registerModels = function() {
    var u = undefined;
    var r = {color: [0.4, 0.16, 0, 1]};
    var s = {color: [0.6, 0.6, 0.6, 1]};
    var i = {color: [0.65, 0.65, 0.65, 1]};
    
    var b = {color: [87/255,60/255,35/255,1]};
    var e = {color: [136/255,136/255,136/255,1]};
    var f = {color: [120/255,120/255,120/255,1]};
    
    ItemModel.register("sword", new ItemModel().addPart({
        type: "staticVoxels",
        width: 3,
        height: 16,
        length: 16,
        voxels: [
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, i, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, i, i, u, u, u, u, u, u, u],
                [u, u, r, u, u, u, i, i, i, u, u, u, u, u, u, u],
                [u, u, u, r, r, i, i, i, u, u, u, u, u, u, u, u],
                [u, u, u, u, r, i, i, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, r, r, r, u, u, u, u, u, u, u, u, u],
                [u, u, u, r, u, u, r, u, u, u, u, u, u, u, u, u],
                [u, u, r, u, u, u, u, r, u, u, u, u, u, u, u, u],
                [u, r, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
            ],
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, s, s, s],
                [u, u, u, u, u, u, u, u, u, u, u, u, s, i, i, s],
                [u, u, u, u, u, u, u, u, u, u, u, s, i, i, i, s],
                [u, u, u, u, u, u, u, u, u, u, s, i, i, i, s, u],
                [u, u, u, u, u, u, u, u, u, s, i, i, i, s, u, u],
                [u, u, u, u, u, u, u, u, s, i, i, i, s, u, u, u],
                [u, u, u, u, u, u, u, s, i, i, i, s, u, u, u, u],
                [u, r, r, u, u, u, s, i, i, i, s, u, u, u, u, u],
                [u, r, r, r, u, s, i, i, i, s, u, u, u, u, u, u],
                [u, u, r, r, r, i, i, i, s, u, u, u, u, u, u, u],
                [u, u, u, r, r, i, i, s, u, u, u, u, u, u, u, u],
                [u, u, u, r, r, r, r, u, u, u, u, u, u, u, u, u],
                [u, u, r, r, r, r, r, r, u, u, u, u, u, u, u, u],
                [u, r, r, r, u, u, r, r, r, u, u, u, u, u, u, u],
                [r, r, r, u, u, u, u, r, r, u, u, u, u, u, u, u],
                [r, r, u, u, u, u, u, u, u, u, u, u, u, u, u, u]
            ],
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, i, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, i, i, u, u, u, u, u, u, u],
                [u, u, r, u, u, u, i, i, i, u, u, u, u, u, u, u],
                [u, u, u, r, r, i, i, i, u, u, u, u, u, u, u, u],
                [u, u, u, u, r, i, i, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, r, r, r, u, u, u, u, u, u, u, u, u],
                [u, u, u, r, u, u, r, u, u, u, u, u, u, u, u, u],
                [u, u, r, u, u, u, u, r, u, u, u, u, u, u, u, u],
                [u, r, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
            ]
        ],
        getVoxel: function(x, y, z) {
            if(x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.length) return undefined;
               return this.voxels[x][y][z];
        }
    }));
    
    
    ItemModel.register("pickaxe", new ItemModel().addPart({
        type: "staticVoxels",
        width: 3,
        height: 16,
        length: 15,
        voxels: [
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, s, s, s, u, u, u, u, u, u],
                [u, u, u, u, i, i, i, i, i, i, i, u, u, u, u],
                [u, u, i, i, i, u, s, s, s, u, i, i, i, u, u],
                [u, i, i, u, u, u, u, u, u, u, u, u, i, i, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u]
            ],
            [
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, s, s, s, b, s, s, s, u, u, u, u],
                [u, u, s, s, u, u, u, b, u, u, u, s, s, u, u],
                [u, s, u, u, u, s, s, b, s, s, u, u, u, s, u],
                [s, u, u, s, s, u, u, b, u, u, s, s, u, u, s],
                [s, s, s, u, u, u, u, b, u, u, u, u, s, s, s],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u]
            ],
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, s, s, s, u, u, u, u, u, u],
                [u, u, u, u, i, i, i, i, i, i, i, u, u, u, u],
                [u, u, i, i, i, u, s, s, s, u, i, i, i, u, u],
                [u, i, i, u, u, u, u, u, u, u, u, u, i, i, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u]
            ]
        ],
        getVoxel: function(x, y, z) {
            if(x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.length) return undefined;
               return this.voxels[x][y][z];
        }
    }));
    ItemModel.register("shovel", new ItemModel().addPart({
        type: "staticVoxels",
        width: 2,
        height: 16,
        length: 15,
        voxels: [
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, f, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, b, b, b, u, u, u, u, u, u]
            ],
            [
                [u, u, u, u, u, u, f, f, f, u, u, u, u, u, u],
                [u, u, u, u, u, f, e, e, e, f, u, u, u, u, u],
                [u, u, u, u, u, f, e, e, e, f, u, u, u, u, u],
                [u, u, u, u, u, f, e, e, e, f, u, u, u, u, u],
                [u, u, u, u, u, f, e, e, e, f, u, u, u, u, u],
                [u, u, u, u, u, f, e, f, e, f, u, u, u, u, u],
                [u, u, u, u, u, f, f, f, f, f, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, b, u, b, u, u, u, u, u, u]
            ]
        ],
        getVoxel: function(x, y, z) {
            if(x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.length) return undefined;
               return this.voxels[x][y][z];
        }
    }));
    
    ItemModel.register("axe", new ItemModel().addPart({
        type: "staticVoxels",
        width: 3,
        height: 16,
        length: 15,
        voxels: [
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, i, i, i, u, u, i, u, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, i, i, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, i, u, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, u, u, u, u, u, u, u],
                [u, u, u, i, i, i, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, i, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u]
            ],
            [
                [u, u, s, s, s, s, u, b, u, u, u, u, u, u, u],
                [u, s, s, i, i, i, s, b, s, u, u, u, u, u, u],
                [u, s, i, i, i, i, i, b, i, s, u, u, u, u, u],
                [u, s, i, i, i, i, i, b, i, i, s, u, u, u, u],
                [u, s, i, i, i, i, i, b, i, s, u, u, u, u, u],
                [u, s, s, i, i, i, s, b, s, u, u, u, u, u, u],
                [u, u, s, s, i, s, s, b, s, u, u, u, u, u, u],
                [u, u, u, s, s, s, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, b, u, u, u, u, u, u, u]
            ],
            [
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, i, i, i, u, u, i, u, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, i, i, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, i, u, u, u, u, u, u],
                [u, u, i, i, i, i, i, u, u, u, u, u, u, u, u],
                [u, u, u, i, i, i, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, i, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u],
                [u, u, u, u, u, u, u, u, u, u, u, u, u, u, u]
            ]
        ],
        getVoxel: function(x, y, z) {
            if(x < 0 || y < 0 || z < 0 || x >= this.width || y >= this.height || z >= this.length) return undefined;
               return this.voxels[x][y][z];
        }
    }));
}