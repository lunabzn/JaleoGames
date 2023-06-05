class pauseScene3 extends Phaser.Scene{
   
    constructor(){
        super("pauseScene3");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "pauseScene3"})
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
            this.scene.stop('gameWin3');
            this.scene.stop('gameOver');
            this.scene.stop('Level3');
            this.scene.start('selectorLevelScene');
            
        }, this);

        let resume = this.add.image(200,450,'resume').setScale(0.5);
        resume.setInteractive();
        resume.on('pointerdown',function(){    
            this.scene.stop('gameWin3');
            this.scene.stop('gameOver'); 
            this.scene.stop('pauseScene3');       
            this.scene.wake('Level3');
        }, this);

    }
};

