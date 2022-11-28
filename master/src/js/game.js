var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:'Escenas',
    scene : [mainScene,selectorModeScene,selectorLevelScene]
};

var game = new Phaser.Game(config);
