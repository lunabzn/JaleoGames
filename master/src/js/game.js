var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    scene: [Level1],
    physics: {
        default: 'arcade', 
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
};

var game = new Phaser.Game(config);