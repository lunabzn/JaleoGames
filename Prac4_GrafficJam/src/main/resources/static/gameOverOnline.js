class gameOverOnline extends Phaser.Scene{
   
    constructor(){
        super("gameOverOnline");
    }

    initialize(){
        Phaser.Scene.call(this,{"key": "gameOverOnline"})
    }

    preload() {
        this.load.image('menusO', 'resources/GameOver.png');
        this.load.image('inic', 'resources/menu.png');

    }

    create() {
        this.background = this.add.image(0, 0, 'menusO').setOrigin(0).setScale(1);

        let inicio = this.add.image(400, 460, 'inic').setScale(0.1);

        inicio.setInteractive();

        inicio.on('pointerdown', function(){
            this.background.destroy();
            this.scene.stop('pauseScene');
            this.scene.stop('gameWin');
            this.scene.start('selectorModeScene');      
            
            if(!gameAlreadyDeleted){ // Controlamos que la partida todavía no se haya borrado en el servidor, si no dará problemas
                deleteGame(); // Borrado de la partida online
            }     
        }, this);

        this.events.on('shutdown', () => {
            this.background.destroy();
        });
    }
};