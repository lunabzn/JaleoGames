class mainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");

    }

    preload() {
        this.load.image('play', '../../resources/img/play.png');
        this.load.image('menuP', '../../resources/img/menuP.png');
        this.load.audio("click", ["../../resources/audio/click.mp3"]);
    }

    create() {

        this.add.image(0, 0, "menuP").setOrigin(0);
        this.clickSound = this.sound.add("click");
        let playButton = this.add.image(650, game.config.height / 2 + 150, 'play').setScale(0.4);

        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('selectorModeScene')
        })
    }
};