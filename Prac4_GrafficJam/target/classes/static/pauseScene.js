class pauseScene extends Phaser.Scene{
   
    constructor(){
        super("pauseScene");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "pauseScene"})
    }

    preload() {
        this.load.image('menup', 'resources/Fondopause.png');
        this.load.image('volver', 'resources/botonvolver.png');
        this.load.image('resume', 'resources/reanudar.png');
        this.load.audio("click", ["resources/click.mp3"]);
    }
    
    create(){
        this.add.image(0,0,'menup').setOrigin(0).setScale(1);
        this.clickSound = this.sound.add("click");

        var volver = this.add.image(600,450,"volver").setScale(0.5);
        volver.setInteractive();
        volver.on('pointerdown', function(){   
            this.clickSound.play();    
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('Level1');
            this.scene.start('selectorLevelScene');
            
        }, this);

        let resume = this.add.image(200,450,'resume').setScale(0.5);
        resume.setInteractive();
        resume.on('pointerdown',function(){   
            this.clickSound.play(); 
            this.scene.stop('gameWin');
            this.scene.stop('gameOver'); 
            this.scene.stop('pauseScene');  
            
            this.scene.wake('Level1');
           
            
        }, this);

    }
};

