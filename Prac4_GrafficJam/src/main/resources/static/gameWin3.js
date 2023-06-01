class gameWin3 extends Phaser.Scene{
   
    constructor(){
        super("gameWin3");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "gameWin3"})
    }

    preload() {
        this.load.image('menu3', 'resources/finalL3.jpg');
        this.load.image('inicio', 'resources/menu.png');

    }
    
    create(){
        this.background = this.add.image(0,0,'menu3').setOrigin(0).setScale(1);

        let inicio = this.add.image(400,550,'inicio').setScale(0.07);
        inicio.setInteractive();
        inicio.on('pointerdown',function(){
            this.background.destroy();
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');
            this.scene.start('selectorLevelScene');
        }, this);

        this.events.on('shutdown', () => {
            this.background.destroy();
        });
    }
};
