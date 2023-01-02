class pauseScene extends Phaser.Scene{
   
    constructor(){
        super("pauseScene");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "pauseScene"})
    }

    preload() {
        this.load.image('menup', 'resources/Fondopause.png');
        this.load.image('restart', 'resources/volveraempezar.png');
        this.load.image('resume', 'resources/reanudar.png');

    }
    
    create(){
        this.add.image(0,0,'menup').setOrigin(0).setScale(1);

        var restart = this.add.image(600,450,"restart").setScale(0.5);
        restart.setInteractive();
        restart.on('pointerdown', function(){       
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('Level1');
            this.scene.start('Level1');
            
        }, this);

        let resume = this.add.image(200,450,'resume').setScale(0.5);
        resume.setInteractive();
        resume.on('pointerdown',function(){    
            this.scene.stop('gameWin');
            this.scene.stop('gameOver'); 
            this.scene.stop('pauseScene');       
            this.scene.wake('Level1');
        }, this);

    }
};

