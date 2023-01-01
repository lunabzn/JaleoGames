var config = {
    type: Phaser.AUTO,
    parent: "videogame",
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    dom: {
        createContainer: true
    },
    scene: [audioManager, mainScene, selectorModeScene, selectorLevelScene, Level1, pauseScene, gameOver, gameWin, Lobby, loadingServer, onlineLevel],
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

var game = new Phaser.Game(config);

