
// VARIABLES PARA GESTIÓN DE WEBSOCKETS
var WEB_goLeft = false;
var WEB_goRight = false;
var WEB_goUp = false;
var WEB_goDown = false;


class onlineLevel extends Phaser.Scene {

    constructor() {
        super("onlineLevel");
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
        this.load.spritesheet('invisibleCollider','resources/invisible.png',{frameWidth: 800, frameHeigh:100 , endframe:1});

        //carga de enemigo: policia chica
        this.load.spritesheet('girlPolice', 'resources/spritesPoliciaChicaDef.png', { frameWidth: fStandarWidth, frameHeight: fStandarHeight, endframe: endF });

        //carga de vida: iconos de tuerto y vivo y corazones
        this.load.image('corazon', 'resources/cora.png');
        this.load.image('tuertoLife', 'resources/tuertoLife.png');
        this.load.image('vivoLife', 'resources/vivoLife.png');
    }



    create() {

        this.background = this.add.image(400, 300, 'background');
        this.invisibleCollider = this.physics.add.sprite(400,-50,'invisibleCollider');

        // Boton de pausa
        let pause = this.add.image(700, 520, "pause").setScale(0.07);
        pause.setInteractive();
        pause.on('pointerdown', () => {
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.switch('pauseScene');
        })

        // Creación de los dos personajes
        if(Soy_J1){
            console.log("Soy el Jugador 1");
            this.player = this.physics.add.sprite(100, 300, 'vivo').setCollideWorldBounds(true);
            this.player2 = this.physics.add.sprite(100, 500, 'tuerto').setCollideWorldBounds(true);
            LocalJ1 = true;
        } else {
            console.log("Soy el Jugador 2");
            this.player = this.physics.add.sprite(100, 500, 'tuerto').setCollideWorldBounds(true);
            this.player2 = this.physics.add.sprite(100, 300, 'vivo').setCollideWorldBounds(true);
            LocalJ1 = false;
        }

        this.quantEnemiesRound1 = 3;
        this.quantEnemiesRound2 = 4;
        this.quantEnemiesRound3 = 6;
        this.roundCont = 1;

        this.activeEnemies = [this.quantEnemiesRound1];
        this.velocities = [100,80,60];
        this.countDead = 0;

        this.createEnemies(this.activeEnemies, this.quantEnemiesRound1);

        this.player.body.setSize(this.player.width*0.5, this.player.height*0.85);
        this.player2.body.setSize(this.player2.width*0.5, this.player2.height*0.85);
        this.invisibleCollider.body.setSize(800, 385);

        this.player.turnedLeft = false;
        this.player2.turnedLeft = false;

        this.player.life = 5;
        this.player2.life = 5;

        this.player.attackLeft = false;
        this.player.attackRight = false;
        this.player2.attackLeft = false;
        this.player2.attackRight = false;

        this.physics.add.collider(this.player, this.player2);
        this.physics.add.collider(this.player,this.invisibleCollider);
        this.physics.add.collider(this.player2,this.invisibleCollider);
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
        this.player.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.player.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.player.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.player.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.player.atkP1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

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
    /////////// FIN FUNCION CREATE //////////

    createEnemies(enemies, size) {
        for (var i = 0; i < size; i++) {
            enemies[i] = this.physics.add.sprite(this.randomNum(250, 700), this.randomNum(200, 500), 'girlPolice');
            enemies[i].body.setSize(enemies[i].width * 0.3, enemies[i].height * 0.85);
            enemies[i].setImmovable(true);
            enemies[i].alive = true;
            enemies[i].turnedLeft = true;
            enemies[i].life = 3;

            this.physics.add.collider(this.player, enemies[i], function (player, police) {
                if (player.atkP1.isDown) {
                    police.life -= 1;
                    if (police.life <= 0) {
                        police.y = -100;
                        police.body.moves = false;
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
                        police.y = -100;
                        police.body.moves = false;
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
        var separation = 80;

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
                this.punchSound.play();
                enemy.play('eAttackLeft', true);
            } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
            {
                this.punchSound.play();
                enemy.play('eAttackRight', true);
            }
        }
    }

    updateHearts(){
        if(this.player.life==4){
            this.cora5.destroy();
         }
         else if(this.player.life==3){
            this.cora4.destroy();
         }
         else if(this.player.life==2){
            this.cora3.destroy();
         }
         else if(this.player.life==1){
            this.cora2.destroy();
         }
         else if(this.player.life==0){
            this.cora1.destroy();
         }

        if(this.player2.life==4){
           this.cora10.destroy();
        }
        else if(this.player2.life==3){
           this.cora9.destroy();
        }
        else if(this.player2.life==2){
           this.cora8.destroy();
        }
        else if(this.player2.life==1){
           this.cora7.destroy();
        }
        else if(this.player2.life==0){
           this.cora6.destroy();
        }
    }

    updateVelocities(velocitiesSize) {
        var newVelocities = this.velocities;
        for (var i = 0; i < 2; i++) {
            newVelocities.push(this.velocities[velocitiesSize - 1 + i] - 20);
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

        ////////////////////////////////// APARTADO ONLINE (WEBSOCKETS)

        if (WEB_goLeft) { // Movimiento a la izquierda del otro jugador
            this.player2.setVelocityX(-160);
            this.player2.turnedLeft = true;

            if (Soy_J1) {
                this.player2.play('p2Left', true); // si soy el J1, el player2 tiene el skin de Tuerto. Ejecutamos la animacion de mov a la izq de Tuerto 
            } else {
                this.player2.play('p1Left', true); // si soy el J2, el player2 tiene el skin de Vivo. Ejecutamos la animacion de mov a la izq de Vivo
            }

            if (WEB_goUp) {
                this.player2.setVelocityY(-160);
            }
            if (WEB_goDown) {
                this.player2.setVelocityY(160);
            }

            WEB_goLeft = false;

        } else if (WEB_goRight){
            this.player2.setVelocityX(160);
            this.player2.turnedLeft = false;

            if (Soy_J1) {
                this.player2.play('p2Right', true); // si soy el J1, el player2 tiene el skin de Tuerto. Ejecutamos la animacion de mov a la der de Tuerto 
            } else {
                this.player2.play('p1Right', true); // si soy el J2, el player2 tiene el skin de Vivo. Ejecutamos la animacion de mov a la der de Vivo
            }

            if (WEB_goUp) {
                this.player2.setVelocityY(-160);
            }
            if (WEB_goDown) {
                this.player2.setVelocityY(160);
            }

            WEB_goRight = false;

        } else if (WEB_goUp) {
            this.player.setVelocityY(-160);
            if (this.player.turnedLeft) {
                if (Soy_J1) {
                    this.player2.play('p2UpLeft', true);
                } else {
                    this.player2.play('p1UpLeft', true);
                }
            } else {
                if (Soy_J1) {
                    this.player2.play('p2UpRight', true);
                } else {
                    this.player2.play('p1UpRight', true);
                }
            }

        } else if (WEB_goDown){
            this.player.setVelocityY(160);
            if (this.player.turnedLeft) {
                if(Soy_J1){
                    this.player2.play('p2DownLeft', true);
                } else {
                    this.player2.play('p1DownLeft', true);
                } 
            } else {
                if(Soy_J1){
                    this.player2.play('p2DownRight', true);
                } else {
                    this.player2.play('p1DownRight', true);
                }
            }
        } 


        //ACTUALIZA CORAZONES
        this.updateHearts();

        //////////// ACTUALIZAR JUGADORES
        // J1
        if (this.player.life <= 0) { // Si el jugador está muerto, no se puede mover
            if (this.player.turnedLeft) {
                if(Soy_J1){
                    this.player.play('p1DefeatLeft', true); // Animacion Vivo
                } else {
                    this.player.play('p2DefeatLeft', true); // Animacion Tuerto
                }
                this.player.setImmovable(true);
                this.player.setVelocityX(0);
                this.player.setVelocityY(0); 

            } else {
                if(Soy_J1){
                    this.player.play('p1DefeatRight', true);
                } else {
                    this.player.play('p2DefeatRight', true);
                }
                this.player.setImmovable(true);
                this.player.setVelocityX(0);
                this.player.setVelocityY(0); 
            }
        } else {
            // Eventos de controles del JUGADOR 1
            if (this.player.keyA.isDown) { // Si el Jugador 1 pulsa la A, se mueve hacia la izq
                playerMoveLeft();
                this.player.setVelocityX(-160);
                this.player.turnedLeft = true;
                
                if(Soy_J1){
                    this.player.play('p1Left', true);
                } else {
                    this.player.play('p2Left', true);
                }                
                
                if (this.player.keyW.isDown) {
                    this.player.setVelocityY(-160);
                }

                if (this.player.keyS.isDown) {
                    this.player.setVelocityY(160);
                }
            }
            else if (this.player.keyD.isDown) { // Si el Jugador 1 pulsa la D, se mueve hacia la der
                playerMoveRight();
                this.player.setVelocityX(160);
                this.player.turnedLeft = false;
                
                if(Soy_J1){
                    this.player.play('p1Right', true);
                } else {
                    this.player.play('p2Right', true);
                } 

                if (this.player.keyW.isDown) {
                    this.player.setVelocityY(-160);
                }

                if (this.player.keyS.isDown) {
                    this.player.setVelocityY(160);
                }
            }
            else if (this.player.keyW.isDown) { // Si el Jugador 1 pulsa la W, se mueve hacia arriba
                playerMoveUp();
                this.player.setVelocityY(-160);
                if (this.player.turnedLeft) {
                    if(Soy_J1){
                        this.player.play('p1UpLeft', true);
                    } else {
                        this.player.play('p2UpLeft', true);
                    } 
                } else {
                    if(Soy_J1){
                        this.player.play('p1UpRight', true);
                    } else {
                        this.player.play('p2UpRight', true);
                    } 
                }
            }
            else if (this.player.keyS.isDown) { // Si el Jugador 1 pulsa la S, se mueve hacia abajo
                playerMoveDown();
                this.player.setVelocityY(160);
                if (this.player.turnedLeft) {
                    if(Soy_J1){
                        this.player.play('p1DownLeft', true);
                    } else {
                        this.player.play('p2DownLeft', true);
                    } 
                } else {
                    if(Soy_J1){
                        this.player.play('p1DownRight', true);
                    } else {
                        this.player.play('p2DownRight', true);
                    }
                }
            }
            else { // Si el Jugador 1 no pulsa ninguna tecla, se queda quieto mirando hacia la última dirección que estaba
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);
                if (this.player.turnedLeft) {
                    if(Soy_J1){
                        this.player.play('p1TurnLeft');
                    } else {
                        this.player.play('p2TurnLeft');
                    }
                } else {
                    if(Soy_J1){
                        this.player.play('p1TurnRight');
                    } else {
                        this.player.play('p2TurnRight');
                    }
                }
            }

            // Ataque JUGADOR 1
            if (this.player.atkP1.isDown) {
                if (this.player.turnedLeft) {
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(0);
                    if (!this.player.attackLeft) {
                        this.spraySound.play();
                    }
                    this.player.attackLeft = true;
                    if(Soy_J1){
                        this.player.play('p1AttackLeft');
                    } else {
                        this.player.play('p2AttackLeft');
                    }
                } else {
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(0);
                    if (!this.player.attackRight) {
                        this.spraySound.play();
                    }
                    this.player.attackRight = true;
                    if(Soy_J1){
                        this.player.play('p1AttackRight');
                    } else {
                        this.player.play('p2AttackRight');
                    }
                }
            }
            if (this.player.atkP1.isUp) {
                this.player.attackRight = false;
                this.player.attackLeft = false;
            }
        }

        // J2
        if (this.player2.life <= 0) {
            if (this.player2.turnedLeft) {
                if(Soy_J1){
                    this.player2.play('p1DefeatLeft', true); // Animacion Vivo
                } else {
                    this.player2.play('p1DefeatLeft', true); // Animacion Tuerto
                }
                this.player2.setImmovable(true); 
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);                
            } else {
                if(Soy_J1){
                    this.player2.play('p1DefeatRight', true); // Animacion Vivo
                } else {
                    this.player2.play('p2DefeatRight', true); // Animacion Tuerto
                }
                this.player2.setImmovable(true);
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0); 
            }
        } else {
            // Eventos de controles del JUGADOR 2
            if (this.cursors.left.isDown) {
                // this.player2.setVelocityX(-160);
                // this.player2.turnedLeft = true;
                // this.player2.play('p2Left', true);

                // if (this.cursors.up.isDown) {
                //     this.player2.setVelocityY(-160);
                // }

                // if (this.cursors.down.isDown) {
                //     this.player2.setVelocityY(160);
                // }
            }
            else if (this.cursors.right.isDown) {
                // this.player2.setVelocityX(160);
                // this.player2.turnedLeft = false;
                // this.player2.play('p2Right', true);

                // if (this.cursors.up.isDown) {
                //     this.player2.setVelocityY(-160);
                // }

                // if (this.cursors.down.isDown) {
                //     this.player2.setVelocityY(160);
                // }
            }
            else if (this.cursors.up.isDown) {
                // this.player2.setVelocityY(-160);
                // if (this.player2.turnedLeft) {
                //     this.player2.play('p2UpLeft', true);
                // } else {
                //     this.player2.play('p2UpRight', true);
                // }
            }
            else if (this.cursors.down.isDown) {
                // this.player2.setVelocityY(160);
                // if (this.player2.turnedLeft) {
                //     this.player2.play('p2DownLeft', true);
                // } else {
                //     this.player2.play('p2DownRight', true);
                // }
            }
            else {
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
                if (this.player2.turnedLeft) {
                    if(Soy_J1){
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if(Soy_J1){
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
            }

            // Ataque JUGADOR 2
            // if (this.player2.atkP2.isDown) {
            //     if (this.player2.turnedLeft) {
            //         this.player2.setVelocityX(0);
            //         this.player2.setVelocityY(0);
            //         if (!this.player2.attackLeft) {
            //             this.paintSound.play();
            //         }
            //         this.player2.attackLeft = true;
            //         this.player2.play('p2AttackLeft');
            //     } else {
            //         this.player2.setVelocityX(0);
            //         this.player2.setVelocityY(0);
            //         if (!this.player2.attackRight) {
            //             this.paintSound.play();
            //         }
            //         this.player2.attackRight = true;
            //         this.player2.play('p2AttackRight');
            //     }
            // }
            // if (this.player2.atkP2.isUp) {
            //     this.player2.attackRight = false;
            //     this.player2.attackLeft = false;
            // }
        }

        var velocitiesSize = this.velocities.length;
        var mediumVelocity = this.velocities[Math.floor(velocitiesSize/2)];

        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                if(this.velocities[i]>=mediumVelocity){
                    if (i % 2 == 0) {
                        if(this.player.life > 0){
                            this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i]);
                        } else {
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                        }
                    } else {
                        if(this.player2.life > 0){
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                        } else {
                            this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i]);
                        }
                    }
                } else {
                    if (i % 2 == 0) {
                        if(this.player.life > 0){
                            this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i] - 1);
                        } else {
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                        }
                    } else {
                        if(this.player2.life > 0){
                            this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                        } else {
                            this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i] - 1);
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
            }else if(this.roundCont > 3){
                this.scene.start('gameWin');
                this.scene.stop('Level1');
                this.scene.stop('pauseScene');
            }
        }

        //cambiar escena a gameover
        if(this.player.life==0 && this.player2.life==0){
            this.scene.start('gameOver');
            this.scene.stop('Level1');
            this.scene.stop('pauseScene');
        }
    }

}

// FUNCIONES A EJECUTAR CUANDO connection.js LO SOLICITE
function activate_WEB_goLeft(){
    console.log("onlineLevel.js: El otro jugador se va a mover a la izquierda");
    WEB_goLeft = true;
}

function activate_WEB_goRight(){
    console.log("onlineLevel.js: El otro jugador se va a mover a la derecha");
    WEB_goRight = true;
}

function activate_WEB_goUp(){
    console.log("onlineLevel.js: El otro jugador se va a mover hacia arriba");
    WEB_goUp = true;
}

function activate_WEB_goDown(){
    console.log("onlineLevel.js: El otro jugador se va a mover hacia abajo");
    WEB_goDown = true;
}