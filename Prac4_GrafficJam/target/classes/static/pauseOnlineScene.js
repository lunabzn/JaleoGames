var WEB_resumeGame = false;
var WEB_makeLogOut = false;

class pauseOnlineScene extends Phaser.Scene{
   
    constructor(){
        super("pauseOnlineScene");
    }

    preload() {
        this.load.image('menupo', 'resources/FondopauseOnline.png');
        this.load.image('restart', 'resources/desconectar.png');
        this.load.image('resume', 'resources/reanudar.png');

    }
    
    create(){
        this.background = this.add.image(0,0,"menupo").setOrigin(0).setScale(1);

        let logout = this.add.image(600,450,"restart").setScale(0.1165);
        logout.setInteractive();
        logout.on('pointerdown',()=>{
            playerPauseLogOut(); // Avisamos al servidor de que salimos de la partida para que saque también al otro cliente
            
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.start('selectorModeScene'); 

            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;

            deleteGame(); // Borrado de la partida online
        })

        let resume = this.add.image(200,450,'resume').setScale(0.5);
        resume.setInteractive();
        resume.on('pointerdown',function(){
            resumeGame(); // Avisamos al servidor para que reanude también la partida del otro cliente
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');        
            this.scene.wake('onlineLevel');
            this.scene.stop('pauseOnlineScene');
        }, this);

    }

    update(){
        if(WEB_resumeGame){
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');        
            this.scene.wake('onlineLevel');
            this.scene.stop('pauseOnlineScene');
            WEB_resumeGame = false;
        }

        if(WEB_makeLogOut){
            
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.start('selectorModeScene'); 
            WEB_makeLogOut = false;

            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;

            if(!gameAlreadyDeleted){ // Controlamos que la partida todavía no se haya borrado en el servidor, si no dará problemas
                deleteGame(); // Borrado de la partida online
            }
        }
    }
};

function makeResumeGame(){
    WEB_resumeGame = true;
}

function makePlayerLogOut(){
    WEB_makeLogOut = true;
}