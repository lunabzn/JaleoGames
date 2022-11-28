class selectorLevelScene extends Phaser.Scene {
    constructor(){
        super("selectorLevelScene");

    }
        preload() {
            this.load.image('image-menu', '../../resources/img/bg-image-menu.jpg');
            this.load.image('volver', '../../resources/img/botonvolver.png');
            this.load.image('nivel1', '../../resources/img/nivel1.png');
            this.load.image('nivel2', '../../resources/img/nivel2.png');
            this.load.image('nivel3', '../../resources/img/nivel3.png');
        }

    create(){
        this.add.image(0,0,"image-menu").setOrigin(0).setScale(0.75);
        let playButtonVolver = this.add.image(game.config.width/2,game.config.height/2+175,"volver").setScale(0.5);

        let playButtonLvl1 = this.add.image(120,game.config.height/2,"nivel1").setScale(1);

        let playButtonLvl2 = this.add.image(game.config.width/2,game.config.height/2-87,"nivel2").setScale(1);

        let playButtonLvl3 = this.add.image(game.config.width-120,game.config.height/2,"nivel3").setScale(1);

        playButtonVolver.setInteractive();
        playButtonVolver.on('pointerdown',()=>{
            
            this.scene.start('selectorModeScene')
        })

        playButtonLvl1.setInteractive();
        playButtonLvl1.on('pointerdown',()=>{
            //this.scene.start('selectorCharacterScene',level)
            this.scene.start('Level1')
        })
        //playButtonLvl2.setInteractive();
        //playButtonLvl2.on('pointerdown',()=>{
        //    this.scene.start('selectorCharacterScene',level)
        //})
        //playButtonLvl3.setInteractive();
        //playButtonLvl3.on('pointerdown',()=>{
        //    this.scene.start('selectorCharacterScene',level)
        //})
    }
};