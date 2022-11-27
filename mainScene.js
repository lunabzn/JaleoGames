class mainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");

    }

    preload() {
        this.load.image('play', 'assets/play.png');
        this.load.image('bg-image-menu', 'assets/bg-image-menu.jpg');
        //this.load.audio("main", ["master/resources/audio/main.mp3"]);
        this.load.audio("click", ["master/resources/audio/click.mp3"]);
    }

    create() {
        this.add.image(0, 0, "bg-image-menu").setOrigin(0).setScale(0.75);
        //this.mainSong = this.sound.add("main")
        this.clickSound = this.sound.add("click");

        var musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        //this.mainSong.play(musicConfig);

        let playButton = this.add.image(game.config.width / 2 + 40, game.config.height / 2 + 150, 'play').setScale(0.6);

        playButton.setInteractive();

        playButton.on('pointerdown', () => {
            //this.mainSong.stop();
            this.clickSound.play();
            this.scene.start('selectorModeScene')
        })
    }
};