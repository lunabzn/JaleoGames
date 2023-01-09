var config = {
    type: Phaser.AUTO,
    parent: "videogame",
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    dom: {
        createContainer: true
    },
    scene: [audioManager, mainScene, selectorModeScene, selectorLevelScene, countdown,countdown2,countdown3, Level1,Level2,Level3, pauseScene, gameOver, gameWin, gameWin2,gameWin3,Lobby, loadingServer],
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);

