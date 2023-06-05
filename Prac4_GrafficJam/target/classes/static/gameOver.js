class gameOver extends Phaser.Scene{
   
    constructor(){
        super("gameOver");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "gameOver"})
    }

    preload() {
        this.load.image('menus', 'resources/GameOver.png');
        this.load.image('inic', 'resources/menu.png');

    }
    
    create(){
        this.background = this.add.image(0,0,'menus').setOrigin(0).setScale(1);

        let inicio = this.add.image(400,450,'inic').setScale(0.1);
        inicio.setInteractive();

        inicio.on('pointerdown', function(){
            this.scene.stop('pauseScene');
            this.scene.stop('gameWin');
            this.scene.start('selectorModeScene');      
            
            if(!gameAlreadyDeleted){ // Controlamos que la partida todavía no se haya borrado en el servidor, si no dará problemas
                deleteGame(); // Borrado de la partida online
            }

        }, this);
    }
};