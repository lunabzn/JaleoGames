class gameWin2 extends Phaser.Scene{
   
    constructor(){
        super("gameWin2");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "gameWin2"})
    }

    preload() {
        this.load.image('menu2', 'resources/finalL2.png');
        this.load.image('inicio', 'resources/menu.png');        
        this.load.image('signiv', 'resources/signivel.png');

    }
    
    create(){
        this.background = this.add.image(0,0,'menu2').setOrigin(0).setScale(1);

        let inicio = this.add.image(300,550,'inicio').setScale(0.07);
        inicio.setInteractive();
        inicio.on('pointerdown',function(){
            this.background.setVisible(false);
            this.scene.stop('Level2');
            this.scene.stop('pauseScene');
            this.scene.start('selectorLevelScene');
        }, this);

        let signiv = this.add.image(500,550,'signiv').setScale(0.07);
        signiv.setInteractive();
        signiv.on('pointerdown',function(){
            this.background.destroy();
            this.scene.stop('Level2');
            this.scene.stop('pauseScene');
            this.scene.start('countdown3');
        }, this);

        this.events.on('shutdown', () => {
            this.background.destroy();
        });
    }
};
