class audioManager extends Phaser.Scene {
    constructor() {
        super("audioManager");

    }

    preload() {
        this.load.audio("main", ["resources/main.mp3"]);
        this.load.audio("pause", ["resources/musica_pausa.mp3"]);
        this.load.audio("level1", ["resources/musica_nivel1.mp3"]);
    }

    create() {

        this.mainMusic = this.sound.add("main");
        this.pauseMusic = this.sound.add("pause");
        this.level1Music = this.sound.add("level1");

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
        
        var level1Config = {
            mute: true,
            volume: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.mainMusic.play(musicConfig);
        this.pauseMusic.play(pauseConfig);
        this.level1Music.play(level1Config);

        this.scene.launch('mainScene');
    }

    update() {
        
        if (this.scene.isActive('mainScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.level1Music.resume();
            this.mainMusic.setMute(false);
            this.pauseMusic.setMute(true);
            this.level1Music.setMute(true);
        }

        else if (this.scene.isActive('selectorModeScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.level1Music.resume();
            this.mainMusic.setMute(false);
            this.pauseMusic.setMute(true);
            this.level1Music.setMute(true);
        }

        else if (this.scene.isActive('selectorLevelScene')) {
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.level1Music.resume();
            this.mainMusic.setMute(true);
            this.pauseMusic.setMute(false);
            this.level1Music.setMute(true);
        }

        else if(this.scene.isActive('Level1')){
            this.mainMusic.resume();
            this.pauseMusic.resume();
            this.level1Music.resume();
            this.mainMusic.setMute(true);
            this.pauseMusic.setMute(true);
            this.level1Music.setMute(false);
        }
        
        else {
            this.mainMusic.pause();
            this.pauseMusic.pause();
        }
        
    }
};