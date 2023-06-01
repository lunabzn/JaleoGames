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

        // barrera se activa cuando se ha creado ya un jugador MIRAR SI HAY QUE DESACTIVARLA PARA SEGUNDAS PARTIDAS ONLINE

        if ((crearPartidaBool == false) && (barrera == true)) { // si todavía no se ha creado una partida y 
            createGame(); // llama a connection.js que solicita la creación de partida
            console.log("He enviado peticion para crear partida");
            crearPartidaBool = true;
            console.log("StartGame = " + StartGame);
            console.log("crearPartidaBool = " + crearPartidaBool);
        }

        if (StartGame == true) { // StartGame valdrá true cuando haya dos jugadores
            this.scene.start("onlineLevel");
        }
    }
}