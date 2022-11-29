class audioManager extends Phaser.Scene {
    constructor() {
        super("audioManager");

    }

    preload() {
        this.load.audio("main", ["../../resources/audio/main.mp3"]);
        this.load.audio("pause", ["../../resources/audio/musica_pausa.mp3"]);
    }

    create() {

        this.mainMusic = this.sound.add("main");
        this.pauseMusic = this.sound.add("pause");

        var musicConfig = {
            mute: false,
            volume: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        var pauseConfig = {
            mute: true,
            volume: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }        

        this.mainMusic.play(musicConfig);
        this.pauseMusic.play(pauseConfig);

        this.scene.launch('mainScene');
    }

    update() {
        

        if (this.scene.isActive('mainScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.mainMusic.setMute(false);
            this.pauseMusic.setMute(true);
        }

        else if (this.scene.isActive('selectorModeScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.mainMusic.setMute(false);
            this.pauseMusic.setMute(true);
        }

        else if (this.scene.isActive('selectorLevelScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.mainMusic.setMute(true);
            this.pauseMusic.setMute(false);
        }
        
        else {
            this.mainMusic.pause();
            this.pauseMusic.pause();
        }
        
    }
};