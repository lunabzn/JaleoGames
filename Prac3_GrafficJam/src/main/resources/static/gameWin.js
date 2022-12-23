class gameWin extends Phaser.Scene{
   
    constructor(){
        super("gameWin");
    }

    preload() {
        this.load.image('menup', 'resources/finalL1.png');
        this.load.image('inicio', 'resources/menu.png');

    }
    
    create(){
        this.background = this.add.image(0,0,"menup").setOrigin(0).setScale(1);

        let inicio = this.add.image(400,550,"inicio").setScale(0.07);
        inicio.setInteractive();
        inicio.on('pointerdown',()=>{
            this.scene.start('selectorLevelScene');
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');
        })
    }
};
