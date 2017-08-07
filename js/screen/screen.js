var currentScreen;

var ScreenHandler = {
    currentScreen: undefined,
    guiScale: 2,
    
    open: function(screen) {
        this.currentScreen = screen;
        this.currentScreen.init();
    },
    
    update: function(deltaTime) {
        if(this.currentScreen && this.currentScreen.update)
            this.currentScreen.update(deltaTime);
    },
    
    draw: function() {
        if(this.currentScreen && this.currentScreen.display)
            this.currentScreen.display();
    },
    
    handleKeyPressed: function(e) {
        if(this.currentScreen && this.currentScreen.handleKeyPressed)
            this.currentScreen.handleKeyPressed(e);
    },
    
    handleKeyReleased: function(e) {
        if(this.currentScreen && this.currentScreen.handleKeyReleased)
            this.currentScreen.handleKeyReleased(e);
    },
    
    handleMousePressed: function(e) {
        if(this.currentScreen && this.currentScreen.handleMousePressed)
            this.currentScreen.handleMousePressed(e);
    },
    
    handleMouseReleased: function(e) {
        if(this.currentScreen && this.currentScreen.handleMouseReleased)
            this.currentScreen.handleMouseReleased(e);
    },
    
    handleMouseMove: function(e) {
        if(this.currentScreen && this.currentScreen.handleMouseMove)
            this.currentScreen.handleMouseMove(e);
    }
};