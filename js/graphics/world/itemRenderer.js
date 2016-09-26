var ItemRenderer = {
    items: new Array(0),
    init: function(){
        this.itemPart = new Mesh();
        drawTexturedCube(this.itemPart, -0.05, -0.05, -0.05, 0.1, 0.1, 0.1, [1,1,1,1]);
    },
    display: function(index){
        for (var y=0;y<this.items[index].elements.length;y++){
            for (var x=0;x<this.items[index].elements[y].length;x++){
                if (this.items[index].elements[x][y]!=0){
                    drawTexturedCube(this.itemPart, -0.05, -0.05, -0.05, 0.1, 0.1, 0.1, this.items[index].color);
                    GLHelper.perspective(75, gl.viewportWidth/gl.viewportHeight, 0.1, 1000.0);
                    useShader("default");
                    GLHelper.resetToWorldMatrix();
                    TextureManager.disableTextures();
                    GLHelper.translate([this.items[index].x+(x*0.1),this.items[index].y+(y*0.1),this.items[index].z]);
                    this.itemPart.draw();
                }
            }
        }
    },
    addItemToRender: function(p_x, p_y, p_z){
        this.items.push({
            x: p_x,
            y: p_y,
            z: p_z,
            color: [0,0.5,0,1],
            elements: [
            [0,1,1,1,1,0],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [1,0,0,0,0,1],
            [0,1,1,1,1,0]
            ]
        });
    },
    renderItems: function(){
        for (var i=0;i<this.items.length;i++) this.display(i);
    }
}