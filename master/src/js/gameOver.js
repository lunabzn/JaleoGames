class gameOver extends Phaser.Scene{
   
    constructor(){
        super("gameOver");
    }

    preload() {
        this.load.image('menup', '../../resources/img/GameOver.png');
        this.load.image('inicio', '../../resources/img/menu.png');

    }
    
    create(){
        this.background = this.add.image(0,0,"menup").setOrigin(0).setScale(1);

        let inicio = this.add.image(400,450,"inicio").setScale(0.1);
        inicio.setInteractive();
        inicio.on('pointerdown',()=>{
            this.scene.start('selectorLevelScene');
            this.scene.stop('pauseScene');
            this.scene.stop();
        })
    }
};
