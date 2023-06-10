class loadingServer extends Phaser.Scene {
    constructor() {
        super("loadingServer");
    }

    preload() {
        this.load.image('Lobby', 'resources/Lobby.png');
    }

    create() {
        console.log("barrera = " + barrera);
        console.log("crearPartidaBool = " + crearPartidaBool);
        this.add.image(0, 0, "Lobby").setOrigin(0).setScale(1);
    }

    update() {
        if ((partidaCreada == false) && (yaHayUnJugador == true)) { // si todavía no se ha creado una partida y ya se ha creado un jugador
            createGame(); // llama a connection.js que solicita la creación de partida
            partidaCreada = true;
            gameAlreadyDeleted = false;
        }

        if (StartGame == true) { // StartGame valdrá true cuando haya dos jugadores
            console.log("START GAME!");
            this.scene.start("onlineLevel");
        }
    }
}