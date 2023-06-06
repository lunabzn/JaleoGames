class gameWinOnline extends Phaser.Scene{
   
    constructor(){
        super("gameWinOnline");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "gameWinOnline"});
    }

    preload() {
        this.load.image('menuOnline', 'resources/finalL1.png');
        this.load.image('inicioOnline', 'resources/menu.png');
    }
    
    create(){
        this.background = this.add.image(0,0,'menuOnline').setOrigin(0).setScale(1);
        //gameWinOnlineActive = true;

        console.log("He cambiado WEB_gameWin a false");

        let inicio = this.add.image(400,550,'inicioOnline').setScale(0.07);
        inicio.setInteractive();

        inicio.on('pointerdown',function(){
            gameWinOnlineActive = false;
            this.scene.start('selectorModeScene');
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');

            if(!gameAlreadyDeleted){ // Controlamos que la partida todavía no se haya borrado en el servidor, si no dará problemas
                deleteGame(); // Borrado de la partida online
            }
        }, this);
    }
};
