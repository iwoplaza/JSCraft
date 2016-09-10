var currentScreen;

function openScreen(screen) {
    screen.init();
    this.currentScreen = screen;
}

function updateCurrentScreen(deltaTime) {
    if(currentScreen != undefined && currentScreen.update != undefined) {
        currentScreen.update(deltaTime);
    }
}

function displayCurrentScreen() {
    if(currentScreen != undefined && currentScreen.display != undefined) {
        currentScreen.display();
    }
}

function handleKeyPressedCurrentScreen(p_event) {
    if(currentScreen != undefined && currentScreen.onKeyPressed != undefined) {
        currentScreen.onKeyPressed(p_event);
    }
}

function handleKeyReleasedCurrentScreen(p_event) {
    if(currentScreen != undefined && currentScreen.onKeyReleased != undefined) {
        currentScreen.onKeyReleased(p_event);
    }
}

function handleMousePressedCurrentScreen(p_event) {
    if(currentScreen != undefined && currentScreen.onMousePressed != undefined) {
        currentScreen.onMousePressed(p_event);
    }
}

function handleMouseReleasedCurrentScreen(p_event) {
    if(currentScreen != undefined && currentScreen.onMouseReleased != undefined) {
        currentScreen.onMouseReleased(p_event);
    }
}