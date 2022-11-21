class Level1 extends Phaser.Scene {

    constructor() {
        super("Level1");
    }

    preload() {
        this.load.spritesheet('vivo', '../../resources/img/spritesVivo.png', { frameWidth: 310, frameHeight: 331 });
        this.load.image('sky', '../../resources/img//sky.png');
    }

    create() {
        this.background = this.add.image(400, 300, 'sky');

        // Creación de los dos personajes
        this.player1 = this.physics.add.sprite(100, 200, 'vivo');
        this.player2 = this.physics.add.sprite(100, 400, 'vivo');
        
        this.player1.turnedLeft = false;
        this.player2.turnedLeft = false;

        // Controles de los dos jugadores
        // J1: ASDW
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.atkP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // J2: cursores
        this.cursors = this.input.keyboard.createCursorKeys();
        this.atkP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Animaciones de movimiento de los jugadores
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('vivo', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turnLeft',
            frames: [{ key: 'vivo', frame: 9 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('vivo', { start: 11, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turnRight',
            frames: [{ key: 'vivo', frame: 10 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'upLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'upRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 11, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'downRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 11, end: 14 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attackLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 3, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'attackRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 4, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {

        // Eventos de controles del JUGADOR 1
        if (this.keyA.isDown) {
            this.player1.setVelocityX(-160);
            this.player1.turnedLeft = true;
            this.player1.play('left', true);
        }
        else if (this.keyD.isDown) {
            this.player1.setVelocityX(160);
            this.player1.turnedLeft = false;
            this.player1.play('right', true);
        }
        else if (this.keyW.isDown) {
            this.player1.setVelocityY(-160);
            if(this.player1.turnedLeft){
                this.player1.play('upLeft', true);
            } else {
                this.player1.play('upRight', true);
            }
        }
        else if (this.keyS.isDown) {
            this.player1.setVelocityY(160);
            if(this.player1.turnedLeft){
                this.player1.play('downLeft', true);
            } else {
                this.player1.play('downRight', true);
            }
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(0);
            if(this.player1.turnedLeft){
                this.player1.play('turnLeft');
            } else {
                this.player1.play('turnRight');
            }
        }

        // Ataque JUGADOR 1
        if(this.atkP1.isDown){
            if(this.player1.turnedLeft){
                this.player1.play('attackLeft');
            } else {
                this.player1.play('attackRight');
            }
        }

        // // Eventos de controles del JUGADOR 2
        // if (this.cursors.left.isDown) {
        //     this.player2.setVelocityX(-160);
        //     this.player2.play('left', true);
        // }
        // else if (this.cursors.right.isDown) {
        //     this.player2.setVelocityX(160);
        //     this.player2.play('right', true);
        // }
        // else if (this.cursors.up.isDown) {
        //     this.player2.setVelocityY(-160);
        //     this.player2.play('up', true);
        // }
        // else if (this.cursors.down.isDown) {
        //     this.player2.setVelocityY(160);
        //     this.player2.play('down', true);
        // }
        // else {
        //     this.player2.setVelocityX(0);
        //     this.player2.setVelocityY(0);
        //     this.player2.play('turn');
        // }

        // // Ataque JUGADOR 2
        // if(this.atkP2.isDown){
        //     this.player2.play('attack');
        // }
    }

}