class selectorLevelScene extends Phaser.Scene {
    constructor() {
        super("selectorLevelScene");

    }
    preload() {
        this.load.image('image-menu', 'resources/bg-image-menu.jpg');
        this.load.image('volver', 'resources/botonvolver.png');
        this.load.image('nivel1', 'resources/nivel1.png');
        this.load.image('nivel2', 'resources/nivel2.png');
        this.load.image('nivel3', 'resources/nivel3.png');
        this.load.image('nivel3Lock', 'resources/nivel3Lock.png');
        this.load.image('nivel2Lock', 'resources/nivel2Lock.png');
        this.load.audio("click", ["resources/click.mp3"]);
    }

    create() {
        var mensaje = this.scene.settings.data.mensaje

        console.log(mensaje[0])
        console.log(mensaje[1])

        this.add.image(0, 0, "image-menu").setOrigin(0).setScale(0.75);
        let playButtonVolver = this.add.image(game.config.width / 2, game.config.height / 2 + 175, "volver").setScale(0.5);

        let playButtonLvl1 = this.add.image(120, game.config.height / 2, "nivel1").setScale(1);

        let playButtonLvl2 = this.add.image(game.config.width / 2, game.config.height / 2 - 87, "nivel2").setScale(1);

        let playButtonLvl3 = this.add.image(game.config.width - 120, game.config.height / 2, "nivel3").setScale(1);

        if(mensaje[0]==false){
            this.add.image(game.config.width / 2, game.config.height / 2 - 87, "nivel2Lock").setScale(1);
        }
        
        if(mensaje[1]==false){
            this.add.image(game.config.width - 120, game.config.height / 2, "nivel3Lock").setScale(1);
        }
        

        

        this.clickSound = this.sound.add("click");

        playButtonVolver.setInteractive();
        playButtonVolver.on('pointerdown', () => {

            this.clickSound.play();
            this.scene.start('selectorModeScene')
        })

        playButtonLvl1.setInteractive();
        playButtonLvl1.on('pointerdown', () => {
            this.clickSound.play();
            //this.scene.start('selectorCharacterScene',level)
            this.scene.stop('Level1');
            this.scene.start('countdown',{mensaje: mensaje});
        })

        playButtonLvl2.setInteractive();
        playButtonLvl2.on('pointerdown',()=>{
            this.clickSound.play();
            if(mensaje[0]==true){
                this.scene.stop('Level1');
                this.scene.stop('Level3');            
                this.scene.stop('Level2');
                this.scene.start('countdown2',{mensaje: mensaje});
            }
        })

        playButtonLvl3.setInteractive();
        playButtonLvl3.on('pointerdown',()=>{
            this.clickSound.play();
            if(mensaje[1]==true){
                this.scene.stop('Level1');
                this.scene.stop('Level3');            
                this.scene.stop('Level2');
                this.scene.start('countdown3',{mensaje: mensaje});
            }
        })
    }
};