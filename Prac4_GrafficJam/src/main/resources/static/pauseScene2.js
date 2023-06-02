class pauseScene2 extends Phaser.Scene{
   
    constructor(){
        super("pauseScene2");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "pauseScene2"})
    }

    preload() {
        this.load.image('menup', 'resources/Fondopause.png');
        this.load.image('restart', 'resources/volverM.png');
        this.load.image('resume', 'resources/reanudar.png');

    }
    
    create(){
        this.add.image(0,0,'menup').setOrigin(0).setScale(1);

        var restart = this.add.image(600,450,"restart").setScale(0.1165);
        restart.setInteractive();
        restart.on('pointerdown', function(){       
            this.scene.stop('gameWin2');
            this.scene.stop('gameOver');
            this.scene.stop('Level2');
            this.scene.start('selectorLevelScene');
            
        }, this);

        let resume = this.add.image(200,450,'resume').setScale(0.5);
        resume.setInteractive();
        resume.on('pointerdown',function(){    
            this.scene.stop('gameWin2');
            this.scene.stop('gameOver'); 
            this.scene.stop('pauseScene2');       
            this.scene.wake('Level2');
        }, this);

    }
};

