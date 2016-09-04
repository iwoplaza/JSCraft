<!DOCTYPE html>
<html>
    <head>
        <title>JSCraft</title>
        
        <script type="text/javascript" src="js/lib/gl-matrix.js"></script>
        <script type="text/javascript" src="js/lib/jquery.js"></script>
        
        <script type="text/javascript" src="js/util/vector2f.js"></script>
        <script type="text/javascript" src="js/util/vector3f.js"></script>
        <script type="text/javascript" src="js/util/extensions.js"></script>
        <script type="text/javascript" src="js/util/mouse.js"></script>
        
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/math.js"></script>
        <script type="text/javascript" src="js/player.js"></script>
        <script type="text/javascript" src="js/camera.js"></script>
        <script type="text/javascript" src="js/sound.js"></script>
        <script type="text/javascript" src="js/resourceManager.js"></script>
        <script type="text/javascript" src="js/collisionHelper.js"></script>
        <script type="text/javascript" src="js/graphics/glhelper.js"></script>
        <script type="text/javascript" src="js/graphics/framebuffer.js"></script>
        <script type="text/javascript" src="js/graphics/shader.js"></script>
        <script type="text/javascript" src="js/graphics/font.js"></script>
        <script type="text/javascript" src="js/graphics/sprite.js"></script>
        <script type="text/javascript" src="js/graphics/texture.js"></script>
        <script type="text/javascript" src="js/graphics/gui.js"></script>
        <script type="text/javascript" src="js/graphics/draw.js"></script>
        <script type="text/javascript" src="js/graphics/mesh.js"></script>
        <script type="text/javascript" src="js/graphics/animation2d.js"></script>
        <script type="text/javascript" src="js/graphics/lightmap.js"></script>
        <script type="text/javascript" src="js/graphics/world/blockRenderer.js"></script>
        <script type="text/javascript" src="js/graphics/world/blockRenderType.js"></script>
        <script type="text/javascript" src="js/screen/screen.js"></script>
        <script type="text/javascript" src="js/screen/screenGame.js"></script>
        <script type="text/javascript" src="js/block/block.js"></script>
        <script type="text/javascript" src="js/block/blocks.js"></script>
        <script type="text/javascript" src="js/world/chunk.js"></script>
        <script type="text/javascript" src="js/world/world.js"></script>
        
        
        <link rel="stylesheet" href="css/stylesheet.css">
    </head>
    <body onload="webGLStart();">
        <?php
            require 'res/shader/default.html';
            require 'res/shader/font.html';
            require 'res/shader/sprite.html';
        ?>
        
        <h1>JSCraft</h1>
        <canvas id="gameCanvas" width="1024" height="800"></canvas>
    </body>
</html>