class Level1 extends Phaser.Scene {

    constructor() {
        super("Level1");
    }

    preload() {
        this.load.spritesheet('vivo', '../../resources/img/spritesVivo8.png', { frameWidth: 160, frameHeight: 160 , endframe: 18});
        this.load.spritesheet('tuerto', '../../resources/img/spritesTuerto8.png', { frameWidth: 160, frameHeight: 160 , endframe: 18});
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
        // ANIMACIONES JUGADOR 1
        this.anims.create({
            key: 'p1Left',
            frames: this.anims.generateFrameNumbers('vivo', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1TurnLeft',
            frames: [{ key: 'vivo', frame: 12 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'p1Right',
            frames: this.anims.generateFrameNumbers('vivo', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1TurnRight',
            frames: [{ key: 'vivo', frame: 13 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'p1UpLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1UpRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1DownLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1DownRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1AttackLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p1AttackRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        // ANIMACIONES JUGADOR 2
        this.anims.create({
            key: 'p2Left',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2TurnLeft',
            frames: [{ key: 'tuerto', frame: 12 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'p2Right',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2TurnRight',
            frames: [{ key: 'tuerto', frame: 13 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'p2UpLeft',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2UpRight',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2DownLeft',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2DownRight',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2AttackLeft',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'p2AttackRight',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }

    
    update() {

        // Eventos de controles del JUGADOR 1
        if (this.keyA.isDown) {
            this.player1.setVelocityX(-160);
            this.player1.turnedLeft = true;
            this.player1.play('p1Left', true);

            if (this.keyW.isDown) {
                this.player1.setVelocityY(-160);
            }

            if (this.keyS.isDown) {
                this.player1.setVelocityY(160);
            }
        }
        else if (this.keyD.isDown) {
            this.player1.setVelocityX(160);
            this.player1.turnedLeft = false;
            this.player1.play('p1Right', true);

            if (this.keyW.isDown) {
                this.player1.setVelocityY(-160);
            }

            if (this.keyS.isDown) {
                this.player1.setVelocityY(160);
            }
        }
        else if (this.keyW.isDown) {
            this.player1.setVelocityY(-160);
            if (this.player1.turnedLeft) {
                this.player1.play('p1UpLeft', true);
            } else {
                this.player1.play('p1UpRight', true);
            }
        }
        else if (this.keyS.isDown) {
            this.player1.setVelocityY(160);
            if (this.player1.turnedLeft) {
                this.player1.play('p1DownLeft', true);
            } else {
                this.player1.play('p1DownRight', true);
            }
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.setVelocityY(0);
            if (this.player1.turnedLeft) {
                this.player1.play('p1TurnLeft');
            } else {
                this.player1.play('p1TurnRight');
            }
        }

        // Ataque JUGADOR 1
        if (this.atkP1.isDown) {
            if (this.player1.turnedLeft) {
                this.player1.setVelocityX(0);
                this.player1.setVelocityY(0);
                this.player1.play('p1AttackLeft');
            } else {
                this.player1.setVelocityX(0);
                this.player1.setVelocityY(0);
                this.player1.play('p1AttackRight');
            }
        }


        // Eventos de controles del JUGADOR 2
        if (this.cursors.left.isDown) {
            this.player2.setVelocityX(-160);
            this.player2.turnedLeft = true;
            this.player2.play('p2Left', true);

            if (this.cursors.up.isDown) {
                this.player2.setVelocityY(-160);
            }

            if (this.cursors.down.isDown) {
                this.player2.setVelocityY(160);
            }
        }
        else if (this.cursors.right.isDown) {
            this.player2.setVelocityX(160);
            this.player2.turnedLeft = false;
            this.player2.play('p2Right', true);

            if (this.cursors.up.isDown) {
                this.player2.setVelocityY(-160);
            }

            if (this.cursors.down.isDown) {
                this.player2.setVelocityY(160);
            }
        }
        else if (this.cursors.up.isDown) {
            this.player2.setVelocityY(-160);
            if (this.player2.turnedLeft) {
                this.player2.play('p2UpLeft', true);
            } else {
                this.player2.play('p2UpRight', true);
            }
        }
        else if (this.cursors.down.isDown) {
            this.player2.setVelocityY(160);
            if (this.player2.turnedLeft) {
                this.player2.play('p2DownLeft', true);
            } else {
                this.player2.play('p2DownRight', true);
            }
        }
        else {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(0);
            if (this.player2.turnedLeft) {
                this.player2.play('p2TurnLeft');
            } else {
                this.player2.play('p2TurnRight');
            }
        }

        // Ataque JUGADOR 2
        if (this.atkP2.isDown) {
            if (this.player2.turnedLeft) {
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
                this.player2.play('p2AttackLeft');
            } else {
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
                this.player2.play('p2AttackRight');
            }
        }

        
    }

}