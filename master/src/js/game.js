var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:'Escenas',
    scene : [mainScene,selectorModeScene,selectorLevelScene,Level1]
};

var game = new Phaser.Game(config);
