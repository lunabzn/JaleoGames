class Level1 extends Phaser.Scene {

    constructor() {
        super("Level1");
    }

    preload() {
        this.load.spritesheet('guy', '../../resources/img/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('sky', '../../resources/img//sky.png');
        this.load.audio("level1", ["../../resources/audio/musica_nivel1.mp3"]);
    }

    create() {
        this.background = this.add.image(400, 300, 'sky');
        this.level1Music = this.sound.add("level1");

        var level1MusicConfig = {
            mute: false,
            volume: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

        this.level1Music.play(level1MusicConfig);

        // Creación de los dos personajes
        this.player1 = this.physics.add.sprite(100, 200, 'guy');
        this.player2 = this.physics.add.sprite(100, 400, 'guy');

        // Controles de los dos jugadores
        // J1: ASDW
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.player1keys = [this.keyA, this.keyD, this.keyW, this.keyS];
        // J2: cursores
        this.cursors = this.input.keyboard.createCursorKeys();

        // Animaciones de movimiento de los jugadores
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('guy', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'guy', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('guy', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('guy', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('guy', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

    }

    update() {

        // Eventos de controles del JUGADOR 1
        if (this.keyA.isDown) {
            this.player1.setVelocityX(-160);
            this.player1.play('left', true);
        }
        else if (this.keyD.isDown) {
            this.player1.setVelocityX(160);
            this.player1.play('right', true);
        }
        else if (this.keyW.isDown) {
            this.player1.setVelocityY(-160);
            this.player1.play('up', true);
        }
        else if (this.keyS.isDown) {
            this.player1.setVelocityY(160);
            this.player1.play('down', true);
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(0);
            this.player1.play('turn');
        }

        // Eventos de controles del JUGADOR 2
        if (this.cursors.left.isDown) {
            this.player2.setVelocityX(-160);
            this.player2.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player2.setVelocityX(160);
            this.player2.play('right', true);
        }
        else if (this.cursors.up.isDown) {
            this.player2.setVelocityY(-160);
            this.player2.play('up', true);
        }
        else if (this.cursors.down.isDown) {
            this.player2.setVelocityY(160);
            this.player2.play('down', true);
        }
        else {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(0);
            this.player2.play('turn');
        }
    }

}