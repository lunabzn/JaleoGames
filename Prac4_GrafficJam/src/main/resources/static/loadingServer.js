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
        if ((crearPartidaBool == false) && (barrera == true)) {
            createGame();
            console.log("He enviado peticion para crear partida");
            crearPartidaBool = true;
            console.log(StartGame);
        }

        if (StartGame == true) {
            this.scene.start("onlineLevel");
        }
    }
}