class Level1 extends Phaser.Scene {

    constructor() {
        super("Level1");
    }

    //funcion que genera un numero aletorio comprendido entre un minimo y un maximo (ambos incluidos)
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    preload() {

        //medida estandar (tanto ancho como alto)
        var fStandarWidth = 80;
        var fStandarHeight = 80;

        //cantidad de frames (empieza en 0)
        var endF = 17


        //carga de fondo
        this.load.image('sky', '../../resources/img//sky.png');

        //carga de personajes: vivo y tuerto
        this.load.spritesheet('vivo', '../../resources/img/spritesVivoDef.png', { frameWidth: fStandarWidth - 5, frameHeight: fStandarHeight, endframe: endF });
        this.load.spritesheet('tuerto', '../../resources/img/spritesTuertoDef.png', { frameWidth: fStandarWidth, frameHeight: fStandarHeight, endframe: endF });

        //carga de enemigo: policia chica
        this.load.spritesheet('girlPolice', '../../resources/img/spritesPoliciaChicaDef.png', { frameWidth: fStandarWidth, frameHeight: fStandarHeight, endframe: endF });

    }



    create() {

        this.background = this.add.image(400, 300, 'sky');

        // Creación de los dos personajes
        this.player1 = this.physics.add.sprite(100, 200, 'vivo');
        this.player2 = this.physics.add.sprite(100, 400, 'tuerto');
        this.player1.body.setSize(this.player1.width * 0.5, this.player1.height * 0.85);
        this.player2.body.setSize(this.player2.width * 0.5, this.player2.height * 0.85);

        this.quantEnemiesRound1 = 3;
        this.quantEnemiesRound2 = 5;
        this.quantEnemiesRound3 = 7;
        this.roundCont = 1;

        this.activeEnemies = [this.quantEnemiesRound1];
        this.countDead = 0;

        this.createEnemies(this.activeEnemies, this.quantEnemiesRound1);

        this.player1.turnedLeft = false;
        this.player2.turnedLeft = false;

        this.player1.life = 5;
        this.player2.life = 5;

        this.player1.attackLeft = false;
        this.player1.attackRight = false;
        this.player2.attackLeft = false;
        this.player2.attackRight = false;

        this.physics.add.collider(this.player1, this.player2);

        // Controles de los dos jugadores
        // J1: ASDW
        this.player1.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.player1.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.player1.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.player1.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.player1.atkP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // J2: cursores
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player2.atkP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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

        this.anims.create({
            key: 'p1DefeatLeft',
            frames: this.anims.generateFrameNumbers('vivo', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'p1DefeatRight',
            frames: this.anims.generateFrameNumbers('vivo', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: 1
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

        this.anims.create({
            key: 'p2DefeatLeft',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 1
        });

        this.anims.create({
            key: 'p2DefeatRight',
            frames: this.anims.generateFrameNumbers('tuerto', { start: 4, end: 5 }),
            frameRate: 10,
            repeat: 1
        });

        //ANIMACIONES ENEMIGO
        this.anims.create({
            key: 'eLeft',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eTurnLeft',
            frames: [{ key: 'girlPolice', frame: 12 }],
            frameRate: 20,
        });

        this.anims.create({
            key: 'eRight',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 14, end: 17 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eTurnRight',
            frames: [{ key: 'girlPolice', frame: 13 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'eAttackLeft',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 6, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eAttackRight',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 7, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eGotAttackedLeft',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eGotAttackedRight',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

    }

    createEnemies(enemies, size) {
        for (var i = 0; i < size; i++) {
            enemies[i] = this.physics.add.sprite(this.randomNum(250, 700), this.randomNum(200, 500), 'girlPolice');
            enemies[i].body.setSize(enemies[i].width * 0.3, enemies[i].height * 0.85);
            enemies[i].setImmovable(true);
            enemies[i].alive = true;
            enemies[i].turnedLeft = true;
            enemies[i].life = 3;

            this.physics.add.collider(this.player1, enemies[i], function (player, police) {
                if (player.atkP1.isDown) {
                    police.life -= 1;
                    if (police.life <= 0) {
                        police.y = -50;
                    }
                }
                //numero con el que se ataca
                var nAttack = 1;
                //la probabilidad del ataque del enemigo es del 0.0001%
                var probability = Math.floor(Math.random() * (100) + 1);

                var playerCoords = player.getCenter();
                var enemyCoords = police.getCenter();

                if (nAttack == probability) {
                    if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
                    {
                        police.play('eAttackLeft', true);
                        player.life -= 1;
                    } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
                    {
                        police.play('eAttackRight', true);
                        player.life -= 1;
                    }
                }
            });

            this.physics.add.collider(this.player2, enemies[i], function (player, police) {
                if (player.atkP2.isDown) {
                    police.life -= 1;
                    if (police.life <= 0) {
                        police.y = -50;
                    }
                }
                //numero con el que se ataca
                var nAttack = 1;
                //la probabilidad del ataque del enemigo es del 0.0001%
                var probability = Math.floor(Math.random() * (100) + 1);

                var playerCoords = player.getCenter();
                var enemyCoords = police.getCenter();

                if (nAttack == probability) {
                    if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
                    {
                        police.play('eAttackLeft', true);
                        player.life -= 1;
                    } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
                    {
                        police.play('eAttackRight', true);
                        player.life -= 1;
                    }
                }
            });
        }
    }

    enemyWalk(player, enemy) {
        var playerCoords = player.getCenter();
        var enemyCoords = enemy.getCenter();

        if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
        {
            enemy.play('eLeft', true);
        }
        else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
        {
            enemy.play('eRight', true);
        }
    }

    enemyStop(player, enemy) {
        var playerCoords = player.getCenter();
        var enemyCoords = enemy.getCenter();
        enemy.setVelocityX(0);
        enemy.setVelocityY(0);
        if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
        {
            enemy.play('eTurnLeft', true);
        }
        else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
        {
            enemy.play('eTurnRight', true);
        }
    }

    angleBetweenPlayerThing(player, coordx, coordy) {
        var centerCoords = player.getCenter();
        var angle = Phaser.Math.Angle.Between(centerCoords.x, centerCoords.y, coordx, coordy);
        return angle;
    }

    enemyFollow(player, enemy) {
        //velocidad del enemigo
        var vEnemy = 100;

        this.physics.moveToObject(enemy, player, vEnemy);
        //posicion del centro del sprite jugador
        var playerPos = player.getCenter();

        //posicion del centro del sprite enemigo
        var enemyPos = enemy.getCenter();
        var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
        //separacion de sprites
        var separation = 45;

        var angleTopRight = this.angleBetweenPlayerThing(player, player.getTopRight().x, player.getTopRight().y);
        var angleBottomRight = this.angleBetweenPlayerThing(player, player.getBottomRight().x, player.getBottomRight().y);
        var angleTopLeft = this.angleBetweenPlayerThing(player, player.getTopLeft().x, player.getTopLeft().y);
        var angleBottomLeft = this.angleBetweenPlayerThing(player, player.getBottomLeft().x, player.getBottomLeft().y);
        var anglePlayerEnemy = this.angleBetweenPlayerThing(player, enemyPos.x, enemyPos.y);
        var pi = Math.PI;
        this.enemyWalk(player, enemy);
        if (dist <= separation) {
            this.enemyStop(player, enemy);
            if ((anglePlayerEnemy >= angleTopRight && anglePlayerEnemy <= angleBottomRight)) {
                this.enemyAttack(player, enemy);
            } else if ((anglePlayerEnemy >= -1 * pi && anglePlayerEnemy <= angleTopLeft) || (anglePlayerEnemy <= pi && anglePlayerEnemy >= angleBottomLeft)) {
                this.enemyAttack(player, enemy);
            }
        }
    }

    enemyAttack(player, enemy) {
        //numero con el que se ataca
        var nAttack = 1;
        //la probabilidad del ataque del enemigo es del 0.0001%
        var probabilitty = this.randomNum(1, 100);

        var playerCoords = player.getCenter();
        var enemyCoords = enemy.getCenter();

        if (nAttack == probabilitty) {
            if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
            {
                enemy.play('eAttackLeft', true);
            } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
            {
                enemy.play('eAttackRight', true);
            }
        }
    }

    update() {

        // ACTUALIZAR ENEMIGOS
        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                if (this.activeEnemies[i].life <= 0) {
                    this.activeEnemies[i].alive = false;
                    this.countDead++;
                }
            }
        }

        if (this.countDead == this.activeEnemies.length) {
            this.roundCont++;
            if (this.roundCont == 2) {
                this.activeEnemies.length = this.quantEnemiesRound2;
                this.countDead = 0;
                this.createEnemies(this.activeEnemies, this.quantEnemiesRound2);
            } else if (this.roundCont == 3) {
                this.activeEnemies.length = this.quantEnemiesRound3;
                this.countDead = 0;
                this.createEnemies(this.activeEnemies, this.quantEnemiesRound3);
            }
        }

        // ACTUALIZAR JUGADORES
        if (this.player1.life <= 0) {
            if (this.player1.turnedLeft) {
                this.player1.play('p1DefeatLeft', true);
            } else {
                this.player1.play('p1DefeatRight', true);
            }
        } else {
            // Eventos de controles del JUGADOR 1
            if (this.player1.keyA.isDown) {
                this.player1.setVelocityX(-160);
                this.player1.turnedLeft = true;
                this.player1.play('p1Left', true);

                if (this.player1.keyW.isDown) {
                    this.player1.setVelocityY(-160);
                }

                if (this.player1.keyS.isDown) {
                    this.player1.setVelocityY(160);
                }
            }
            else if (this.player1.keyD.isDown) {
                this.player1.setVelocityX(160);
                this.player1.turnedLeft = false;
                this.player1.play('p1Right', true);

                if (this.player1.keyW.isDown) {
                    this.player1.setVelocityY(-160);
                }

                if (this.player1.keyS.isDown) {
                    this.player1.setVelocityY(160);
                }
            }
            else if (this.player1.keyW.isDown) {
                this.player1.setVelocityY(-160);
                if (this.player1.turnedLeft) {
                    this.player1.play('p1UpLeft', true);
                } else {
                    this.player1.play('p1UpRight', true);
                }
            }
            else if (this.player1.keyS.isDown) {
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
            if (this.player1.atkP1.isDown) {
                if (this.player1.turnedLeft) {
                    this.player1.setVelocityX(0);
                    this.player1.setVelocityY(0);
                    this.player1.attackLeft = true;
                    this.player1.play('p1AttackLeft');
                } else {
                    this.player1.setVelocityX(0);
                    this.player1.setVelocityY(0);
                    this.player1.attackRight = true;
                    this.player1.play('p1AttackRight');
                }
            }
            if (this.player1.atkP1.isUp) {
                this.player1.attackRight = false;
                this.player1.attackLeft = false;
            }
        }

        if (this.player2.life <= 0) {
            if (this.player2.turnedLeft) {
                this.player2.play('p2DefeatLeft', true);
            } else {
                this.player2.play('p2DefeatRight', true);
            }
        } else {
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
            if (this.player2.atkP2.isDown) {
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
            if (this.player2.atkP2.isUp) {
                this.player2.attackRight = false;
                this.player2.attackLeft = false;
            }
        }




        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                if (i % 2 == 0) {
                    this.enemyFollow(this.player1, this.activeEnemies[i]);
                } else {
                    this.enemyFollow(this.player2, this.activeEnemies[i]);
                }
            }
        }
    }

}
