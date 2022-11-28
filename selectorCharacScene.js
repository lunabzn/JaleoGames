class selectorCharacterScene extends Phaser.Scene {
    constructor(){
        super("selectorCharacterScene");

    }
        preload() {
            this.load.image('image-menu', 'assets/bg-image-menu.jpg');
            this.load.image('character1','assets/character1.png');
            this.load.image('character2','assets/character2.png');
        }

    create(level){
        this.add.image(0,0,"image-menu").setOrigin(0).setScale(0.75);
        let playButtonVolver = this.add.image(game.config.width/2,game.config.height/2+175,"volver").setScale(0.5);
        let playButtonCha1 = this.add.image(200,game.config.height/2-50,"character1").setScale(0.4);
        let playButtonCha2 = this.add.image(game.config.width-200,game.config.height/2-50,"character2").setScale(0.4);

        var LvlCharacter=level;
        
        console.log(LvlCharacter);

        playButtonVolver.setInteractive();
        playButtonVolver.on('pointerdown',()=>{
            
            this.scene.start('selectorLevelScene');
            
        })

        playButtonCha1.setInteractive();
        playButtonCha1.on('pointerdown',()=>{
            LvlCharacter+=10;

            if(LvlCharacter==11)  {
                console.log('Entraremos al escenario 1, con la combinacion de personajes 1');
    
            };
            if(LvlCharacter==12)  {
                console.log('Entraremos al escenario 2, con la combinacion de personajes 1');
    
            };
            if(LvlCharacter==13)  {
                console.log('Entraremos al escenario 3, con la combinacion de personajes 1');
    
            };


        })

        playButtonCha2.setInteractive();
        playButtonCha2.on('pointerdown',()=>{
            LvlCharacter+=20;

            if(LvlCharacter==21)  {
                console.log('Entraremos al escenario 1, con la combinacion de personajes 2');
    
            };
            if(LvlCharacter==22)  {
    
                console.log('Entraremos al escenario 2, con la combinacion de personajes 2');
            };
            if(LvlCharacter==23)  {
                console.log('Entraremos al escenario 3, con la combinacion de personajes 2');
    
            }

        })
        

        

    }   
};