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
        currentScreen.onKeyPressed(p_event);
    }
}