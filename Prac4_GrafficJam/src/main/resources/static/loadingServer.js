class loadingServer extends Phaser.Scene {
    constructor() {
        super("loadingServer");
    }

    preload() {
        this.load.image('bg-image-menu', 'resources/bg-image-menu.jpg');
    }

    create() {
        console.log("barrera = " + barrera);
        console.log("crearPartidaBool = " + crearPartidaBool);
        this.add.image(0, 0, "bg-image-menu").setOrigin(0).setScale(0.75);
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