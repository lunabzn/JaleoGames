class selectorModeScene extends Phaser.Scene {
    constructor(){
        super("selectorModeScene");

    }
        preload(){
            
            this.load.image('volver', '../../resources/img/botonvolver.png');
            this.load.image('online', '../../resources/img/online.png');
            this.load.image('offline', '../../resources/img/offline.png');
            this.load.image('bg-image-menu', '../../resources/img/bg-image-menu.jpg');
        }
    
    create(){
        this.add.image(0,0,"bg-image-menu").setOrigin(0).setScale(0.75);
        let playButtonOffline = this.add.image(game.config.width/2+40,game.config.height/2-150,"offline").setScale(0.6);
        let playButtonOnline = this.add.image(game.config.width/2+40,game.config.height/2+18,"online").setScale(0.6);
        let playButtonVolver = this.add.image(game.config.width/2+40,game.config.height/2+150,"volver").setScale(0.6);
       

        playButtonVolver.setInteractive();
        playButtonVolver.on('pointerdown',()=>{
            this.scene.start('mainScene')
        })
        playButtonOffline.setInteractive();
        playButtonOffline.on('pointerdown',()=>{
           this.scene.start('selectorLevelScene')
        })
        
    }
};