class mainScene extends Phaser.Scene {
    constructor(){
        super("mainScene");

    }
    
    preload() {
            this.load.image('play', 'assets/play.png');
            this.load.image('bg-image-menu', 'assets/bg-image-menu.jpg');
    }

    create(){
        
        this.add.image(0,0,"bg-image-menu").setOrigin(0).setScale(0.75);
        let playButton = this.add.image (game.config.width/2+40,game.config.height/2+150,'play').setScale(0.6);

        playButton.setInteractive();
        playButton.on('pointerdown',()=>{
            this.scene.start('selectorModeScene')
        })
    }
};