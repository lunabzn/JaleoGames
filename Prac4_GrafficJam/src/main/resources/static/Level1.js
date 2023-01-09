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
        var fStandarWidth = 160;
        var fStandarHeight = 160;

        //cantidad de frames (empieza en 0)
        var endF = 17

        //carga de fondo
        this.load.image("background", "resources/fondol1.png");

        //boton de pausa
        this.load.image("pause", "resources/pausa.png");

        //sonidos de ataque y daño
        this.load.audio("spray", ["resources/ataque_vivo.mp3"]);
        this.load.audio("paint", ["resources/ataque_tuerto.mp3"]);
        this.load.audio("punch", ["resources/punetazo.mp3"]);

        //carga de personajes: vivo y tuerto
        this.load.spritesheet('vivo', 'resources/spritesVivoDef.png', { frameWidth: fStandarWidth - 10, frameHeight: fStandarHeight, endframe: endF });
        this.load.spritesheet('tuerto', 'resources/spritesTuertoDef.png', { frameWidth: fStandarWidth, frameHeight: fStandarHeight, endframe: endF });

        //collider pared
        this.load.spritesheet('invisibleCollider', 'resources/invisible.png', { frameWidth: 800, frameHeigh: 100, endframe: 1 });

        //carga de enemigo: policia chica
        this.load.spritesheet('girlPolice', 'resources/spritesPoliciaChicaDef.png', { frameWidth: fStandarWidth, frameHeight: fStandarHeight, endframe: 21 });

        //carga de vida: iconos de tuerto y vivo y corazones
        this.load.image('corazon', 'resources/cora.png');
        this.load.image('tuertoLife', 'resources/tuertoLife.png');
        this.load.image('vivoLife', 'resources/vivoLife.png');

    }



    create() {

        this.background = this.add.image(400, 300, 'background');
        this.invisibleCollider = this.physics.add.sprite(400, -50, 'invisibleCollider');

        //boton de pausa
        let pause = this.add.image(700, 520, "pause").setScale(0.07);
        pause.setInteractive();
        pause.on('pointerdown', () => {
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.switch('pauseScene');
        })

        // Creación de los dos personajes
        this.player1 = this.physics.add.sprite(100, 300, 'vivo').setCollideWorldBounds(true);
        this.player2 = this.physics.add.sprite(100, 500, 'tuerto').setCollideWorldBounds(true);

        this.quantEnemiesRound1 = 3;
        this.quantEnemiesRound2 = 4;
        this.quantEnemiesRound3 = 6;
        this.roundCont = 1;

        this.activeEnemies = [this.quantEnemiesRound1];
        this.velocities = [100, 80, 60];
        this.countDead = 0;

        this.createEnemies(this.activeEnemies, this.quantEnemiesRound1);

        this.player1.body.setSize(this.player1.width * 0.5, this.player1.height * 0.85);
        this.player2.body.setSize(this.player2.width * 0.5, this.player2.height * 0.85);
        this.invisibleCollider.body.setSize(800, 385);

        this.player1.turnedLeft = false;
        this.player2.turnedLeft = false;

        this.player1.life = 5;
        this.player2.life = 5;

        this.player1.attackLeft = false;
        this.player1.attackRight = false;
        this.player2.attackLeft = false;
        this.player2.attackRight = false;

        this.physics.add.collider(this.player1, this.player2);

        this.physics.add.collider(this.player1, this.invisibleCollider);
        this.physics.add.collider(this.player2, this.invisibleCollider);

        this.invisibleCollider.setImmovable(true);

        //Añadir vida vivo
        this.vivoLife = this.add.image(60, 45, 'vivoLife');
        this.cora1 = this.add.image(110, 55, 'corazon');
        this.cora2 = this.add.image(145, 55, 'corazon');
        this.cora3 = this.add.image(180, 55, 'corazon');
        this.cora4 = this.add.image(215, 55, 'corazon');
        this.cora5 = this.add.image(250, 55, 'corazon');

        this.vivoLife.setScrollFactor(0);
        this.cora1.setScrollFactor(0);
        this.cora2.setScrollFactor(0);
        this.cora3.setScrollFactor(0);
        this.cora4.setScrollFactor(0);
        this.cora5.setScrollFactor(0);


        //Añadir vida tuerto
        this.tuertoLife = this.add.image(745, 50, 'tuertoLife');
        this.cora6 = this.add.image(685, 55, 'corazon');
        this.cora7 = this.add.image(650, 55, 'corazon');
        this.cora8 = this.add.image(615, 55, 'corazon');
        this.cora9 = this.add.image(580, 55, 'corazon');
        this.cora10 = this.add.image(545, 55, 'corazon');

        this.tuertoLife.setScrollFactor(0);
        this.cora6.setScrollFactor(0);
        this.cora7.setScrollFactor(0);
        this.cora8.setScrollFactor(0);
        this.cora9.setScrollFactor(0);
        this.cora10.setScrollFactor(0);

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

        //Efectos de sonido
        this.spraySound = this.sound.add("spray");
        this.paintSound = this.sound.add("paint");
        this.punchSound = this.sound.add("punch");

        

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
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eTurnLeft',
            frames: [{ key: 'girlPolice', frame: 16 }],
            frameRate: 10,
        });

        this.anims.create({
            key: 'eRight',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 18, end: 21 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'eTurnRight',
            frames: [{ key: 'girlPolice', frame: 17 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'eAttackLeft',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 6, end: 8 }),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: 'eAttackRight',
            frames: this.anims.generateFrameNumbers('girlPolice', { start: 9, end: 11 }),
            frameRate: 1,
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

                console.log("colision p1");
                var playerCoords = player.getCenter();
                var enemyCoords = police.getCenter();  

                if (player.atkP1.isDown) {
                    police.life--;
                    if (police.life <= 0) {
                        police.y = -1000000;
                        police.body.moves = false;
                    }

                }
                //numero con el que se ataca
                var nAttack = 1;
                //la probabilidad del ataque del enemigo es del 0.0001%
                var probability = Math.floor(Math.random() * (100) + 1);
            });

            //this.physics.add.collider(this.player2, enemies[i], function (player, police) {console.log("colision collider")});
            //this.physics.add.collider(this.player1, enemies[i], function (player, police) {console.log("colision collider")});

            this.physics.add.collider(this.player2, enemies[i], function (player, police) {

                console.log("colision p2");
                var playerCoords = player.getCenter();
                var enemyCoords = police.getCenter();  
                var dist = Phaser.Math.Distance.Between(playerCoords.x, playerCoords.y, enemyCoords.x, enemyCoords.y);

                if (player.atkP2.isDown) {
                    police.life--;
                    if (police.life <= 0) {
                        police.y = -1000000;
                        police.body.moves = false;
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

    enemyFollow(player, enemy, v) {
        //velocidad del enemigo
        var vEnemy = v;

        this.physics.moveToObject(enemy, player, vEnemy);
        //posicion del centro del sprite jugador
        var playerPos = player.getCenter();

        //posicion del centro del sprite enemigo
        var enemyPos = enemy.getCenter();
        var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
        //separacion de sprites
        var separation = 100;

        var angleTopRight = this.angleBetweenPlayerThing(player, player.getTopRight().x, player.getTopRight().y);
        var angleBottomRight = this.angleBetweenPlayerThing(player, player.getBottomRight().x, player.getBottomRight().y);
        var angleTopLeft = this.angleBetweenPlayerThing(player, player.getTopLeft().x, player.getTopLeft().y);
        var angleBottomLeft = this.angleBetweenPlayerThing(player, player.getBottomLeft().x, player.getBottomLeft().y);
        var anglePlayerEnemy = this.angleBetweenPlayerThing(player, enemyPos.x, enemyPos.y);
        var pi = Math.PI;
        this.enemyWalk(player, enemy);

        if (dist <=separation) {
            this.enemyStop(player, enemy);
            if ((anglePlayerEnemy >= angleTopRight && anglePlayerEnemy <= angleBottomRight)) {
                this.enemyAttack(player, enemy);
            } else if ((anglePlayerEnemy >= -1 * pi && anglePlayerEnemy <= angleTopLeft) || (anglePlayerEnemy <= pi && anglePlayerEnemy >= angleBottomLeft)) {
                this.enemyAttack(player,enemy);
            }
        }
    }

    enemyAttack(player,enemy) {
     
        //numero con el que se ataca
        var nAttack = 1;
        //la probabilidad del ataque del enemigo es del 0.0001%
        var probabilitty = this.randomNum(1, 100);

        var playerCoords = player.getCenter();
        var enemyCoords = enemy.getCenter();
        
        var dist = Phaser.Math.Distance.Between(playerCoords.x, playerCoords.y, enemyCoords.x, enemyCoords.y);

        if(dist <=101){
            if (nAttack == probabilitty) {
                if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
                {
                    this.punchSound.play();
                    enemy.play('eAttackLeft', true);
                    player.life--;

                } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
                {
                    this.punchSound.play();
                    enemy.play('eAttackRight', true);                 
                    player.life--;
                }
            }
        }
        
    }

    updateHearts() {
        if (this.player1.life == 4) {
            this.cora5.destroy();
        }
        else if (this.player1.life == 3) {
            this.cora4.destroy();
        }
        else if (this.player1.life == 2) {
            this.cora3.destroy();
        }
        else if (this.player1.life == 1) {
            this.cora2.destroy();
        }
        else if (this.player1.life == 0) {
            this.cora1.destroy();
        }

        if (this.player2.life == 4) {
            this.cora10.destroy();
        }
        else if (this.player2.life == 3) {
            this.cora9.destroy();
        }
        else if (this.player2.life == 2) {
            this.cora8.destroy();
        }
        else if (this.player2.life == 1) {
            this.cora7.destroy();
        }
        else if (this.player2.life == 0) {
            this.cora6.destroy();
        }
    }
    

    updateVelocities(velocitiesSize) {
        var newVelocities = this.velocities;

        for(var i=0; i<2;i++){
            newVelocities.push(this.velocities[velocitiesSize-1+i]);
        }
        this.velocities = newVelocities;
    }

    isMoving(enemy) {
        if (enemy.body.velocity.x == 0 && enemy.body.velocity.y == 0) {
            return true;
        } else {
            return false;
        }
    }


    update() {


        //ACTUALIZA LA PROFUNDIDAD DE LOS ENEMIGOS
        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                var enemyPos = this.activeEnemies[i].getCenter();
                this.activeEnemies[i].depth = enemyPos.y;
            }
        }



        // ACTUALIZAR JUGADORES
        if (this.player1.life <= 0) {
            if (this.player1.turnedLeft) {
                this.player1.play('p1DefeatLeft', true);
                this.player1.setImmovable(true);
                this.player1.setVelocityX(0);
                this.player1.setVelocityY(0);

            } else {
                this.player1.play('p1DefeatRight', true);
                this.player1.setImmovable(true);
                this.player1.setVelocityX(0);
                this.player1.setVelocityY(0);
            }

        } else {
                // Eventos de controles del JUGADOR 1
                var playerPos = this.player1.getCenter();
                
                this.player1.depth  =this.player1.getCenter().y; //Para que no se superpongan
                this.player2.depth  = this.player2.getCenter().y; //Para que no se superpongan
                    
                if (this.player1.keyA.isDown) {
                    this.player1.setVelocityX(-160);
                    console.log("pulsando A")
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

            // Ataque JUGADOR 1
            if (this.player1.atkP1.isDown) {
                if (this.player1.turnedLeft) {
                    this.player1.setVelocityX(0);
                    this.player1.setVelocityY(0);
                    if (!this.player1.attackLeft) {
                        this.spraySound.play();

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
                        if (!this.player1.attackLeft) {
                            this.spraySound.play();

            }
            if (this.player1.atkP1.isUp) {
                this.player1.attackRight = false;
                this.player1.attackLeft = false;
            }
        }

        if (this.player2.life <= 0) {
            if (this.player2.turnedLeft) {
                this.player2.play('p2DefeatLeft', true);
                this.player2.setImmovable(true);
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
            } else {
                this.player2.play('p2DefeatRight', true);
                this.player2.setImmovable(true);
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
            }
        } else {


            for (var i = 0; i < this.activeEnemies.length; i++) {
                if (this.activeEnemies[i].alive) {

                    var playerPos = this.player2.getCenter();
                    var enemyPos = this.activeEnemies[i].getCenter();
                    var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
                    var distx = Phaser.Math.Distance.Between(playerPos.x,0, enemyPos.x,0);
                    var disty = Phaser.Math.Distance.Between(0,playerPos.y,0,enemyPos.y);
                    var separation = 60;

                    // Eventos de controles del JUGADOR 2
                    if (this.cursors.left.isDown) {
                        this.player2.setVelocityX(-160);
                        this.player2.turnedLeft = true;
                        this.player2.play('p2Left', true);

                        if (this.cursors.up.isDown ) {
                            this.player2.setVelocityY(-160);

                        }
                        this.player1.attackLeft = true;
                        this.player1.play('p1AttackLeft');
                    } else {
                        this.player1.setVelocityX(0);
                        this.player1.setVelocityY(0);
                        if (!this.player1.attackRight) {
                            this.spraySound.play();
                        }
                        this.player1.attackRight = true;
                        this.player1.play('p1AttackRight');
                    }
                }
                if (this.player1.atkP1.isUp) {
                    this.player1.attackRight = false;
                    this.player1.attackLeft = false;
                }
            
            

                if (this.player2.life <= 0) {
                    if (this.player2.turnedLeft) {
                        this.player2.play('p2DefeatLeft', true);
                        this.player2.setImmovable(true); 
                        this.player2.setVelocityX(0);
                        this.player2.setVelocityY(0);                
                    } else {
                        this.player2.play('p2DefeatRight', true);
                        this.player2.setImmovable(true);
                        this.player2.setVelocityX(0);
                        this.player2.setVelocityY(0); 
                    }
                } else {            

                for (var i = 0; i < this.activeEnemies.length; i++) {
                    if (this.activeEnemies[i].alive) {

                        var playerPos = this.player2.getCenter();
                        var enemyPos = this.activeEnemies[i].getCenter();
                        var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
                        var distx = Phaser.Math.Distance.Between(playerPos.x,0, enemyPos.x,0);
                        var disty = Phaser.Math.Distance.Between(0,playerPos.y,0,enemyPos.y);
                        var separation = 60;

                        // Eventos de controles del JUGADOR 2
                        if (this.cursors.left.isDown) {
                            this.player2.setVelocityX(-160);
                            this.player2.turnedLeft = true;
                            this.player2.play('p2Left', true);

                            if (this.cursors.up.isDown ) {
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
                    }        
                
                }

                // Ataque JUGADOR 2
                if (this.player2.atkP2.isDown) {
                    if (this.player2.turnedLeft) {
                        this.player2.setVelocityX(0);
                        this.player2.setVelocityY(0);
                        if (!this.player2.attackLeft) {
                            this.paintSound.play();
                        }
                        this.player2.attackLeft = true;
                        this.player2.play('p2AttackLeft');
                    } else {
                        this.player2.setVelocityX(0);
                        this.player2.setVelocityY(0);
                        if (!this.player2.attackRight) {
                            this.paintSound.play();
                        }
                        this.player2.attackRight = true;
                        this.player2.play('p2AttackRight');
                    }

                }

                }        
            
            }

            // Ataque JUGADOR 2
            if (this.player2.atkP2.isDown) {
                if (this.player2.turnedLeft) {

            setTimeout(() => {
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
                        if (!this.player2.attackLeft) {
                            this.paintSound.play();
                        }
                        this.player2.attackLeft = true;
                        this.player2.play('p2AttackLeft');
                    } else {
                        this.player2.setVelocityX(0);
                        this.player2.setVelocityY(0);
                        if (!this.player2.attackRight) {
                            this.paintSound.play();
                        }
                        this.player2.attackRight = true;
                        this.player2.play('p2AttackRight');
                    }
                }

                if (this.player2.atkP2.isUp) {
                    this.player2.attackRight = false;
                    this.player2.attackLeft = false;
                }

        }
            


        var velocitiesSize = this.velocities.length;
        var mediumVelocity = this.velocities[Math.floor(velocitiesSize/5)];


        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                if(this.velocities[i]>=mediumVelocity){
                    if (i % 2 == 0) {
                        if(this.player1.life > 0){
                            this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i]);
                        } else {
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                        }
                    } else {
                        if(this.player2.life > 0){
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                        } else {
                            this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i]);
                        }
                    }
                } else {
                    if (i % 2 == 0) {
                        if(this.player1.life > 0){
                            this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i] - 1);


            var velocitiesSize = this.velocities.length;
            var mediumVelocity = this.velocities[Math.floor(velocitiesSize / 2)];

            for (var i = 0; i < this.activeEnemies.length; i++) {
                if (this.activeEnemies[i].alive) {
                    if (this.velocities[i] >= mediumVelocity) {
                        if (i % 2 == 0) {
                            if (this.player1.life > 0) {
                                this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i]);
                            } else {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                            }

                        } else {
                            if (this.player2.life > 0) {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                            } else {
                                this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i]);
                            }
                        }
                    } else {

                        if(this.player2.life > 0){
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);

                        if (i % 2 == 0) {
                            if (this.player1.life > 0) {
                                this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i] - 1);
                            } else {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                            }

                        } else {
                            if (this.player2.life > 0) {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                            } else {
                                this.enemyFollow(this.player1, this.activeEnemies[i], this.velocities[i] - 1);
                            }
                        }
                    }
                }
            }
     

        ////////////////////////////ATAQUE ENEMIGOS///////////////////////////////
        //BUCLE PARA QUE FUNCIONEN COLISIONES SI EL JUGADOR ATACA SIN MOVERSE

        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {

                var playerPos = this.player1.getCenter();
                var enemyPos = this.activeEnemies[i].getCenter();
                var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
                if(dist <=101){

                    if (this.player1.atkP1.isDown) {
                        this.activeEnemies[i].life -= 1;
                        console.log("punch");
                        if (this.activeEnemies[i].life <= 0) {
                            this.activeEnemies[i].y = -100;
                            this.activeEnemies[i].body.moves = false;
                        }
                    }                
                }
            }
        }

        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                
                var playerPos = this.player2.getCenter();
                var enemyPos = this.activeEnemies[i].getCenter();
                var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);                
                if(dist <=101){
                    
                    if (this.player2.atkP2.isDown) {
                        this.activeEnemies[i].life -= 1;
                        console.log("pucch");
                        if (this.activeEnemies[i].life <= 0) {
                            this.activeEnemies[i].y = -100;
                            this.activeEnemies[i].body.moves = false;
                        }
                    }                
                }
            }
        }


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
                this.updateVelocities(velocitiesSize);
            } else if (this.roundCont == 3) {
                this.activeEnemies.length = this.quantEnemiesRound3;
                this.countDead = 0;
                this.createEnemies(this.activeEnemies, this.quantEnemiesRound3);
                this.updateVelocities(velocitiesSize);

            } else if (this.roundCont > 3) {
                this.scene.start('gameWin');
                this.scene.stop('Level1');
                this.scene.stop('pauseScene');

            }
        }

        if(this.roundCont > 3){
            this.scene.start('gameWin');
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');
            
        }

        //cambiar escena a gameover

        if (this.player1.life == 0 && this.player2.life == 0) {
            this.scene.start('gameOver');
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');          
            
        }

        //ACTUALIZA CORAZONES
        this.updateHearts();
   

    }

}
