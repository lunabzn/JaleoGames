var WEB_resumeGame = false;
var WEB_makeLogOut = false;

class pauseOnlineScene extends Phaser.Scene{
   
    constructor(){
        super("pauseOnlineScene");
    }

    preload() {
        this.load.image('menup', 'resources/Fondopause.png');
        this.load.image('restart', 'resources/desconectar.png');
        this.load.image('resume', 'resources/reanudar.png');

    }
    
    create(){
        this.background = this.add.image(0,0,"menup").setOrigin(0).setScale(1);

        let logout = this.add.image(600,450,"restart").setScale(0.15);
        logout.setInteractive();
        logout.on('pointerdown',()=>{
            playerPauseLogOut(); // Avisamos al servidor de que salimos de la partida para que saque también al otro cliente
            deleteGame(); // Borramos la partida actual de la lista de partidas     
            
            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;
            
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.start('selectorModeScene'); 
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
            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;
            
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.start('selectorModeScene'); 
            WEB_makeLogOut = false;
        }
    }
};

function makeResumeGame(){
    WEB_resumeGame = true;
}

function makePlayerLogOut(){
    WEB_makeLogOut = true;
}