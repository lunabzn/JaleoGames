class mainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");

    }

    preload() {
        this.load.image('play', '../../resources/img/play.png');
        this.load.image('bg-image-menu', '../../resources/img/bg-image-menu.jpg');
        this.load.audio("click", ["../../resources/audio/click.mp3"]);
    }

    create() {

        this.add.image(0, 0, "bg-image-menu").setOrigin(0).setScale(0.75);
        this.clickSound = this.sound.add("click");
        let playButton = this.add.image(game.config.width / 2 + 40, game.config.height / 2 + 150, 'play').setScale(0.6);

        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.clickSound.play();
            this.scene.start('selectorModeScene')
        })
    }
};