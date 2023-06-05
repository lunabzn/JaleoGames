
// VARIABLES PARA GESTIÓN DE WEBSOCKETS
var WEB_goLeft = false;
var WEB_goRight = false;
var WEB_goUp = false;
var WEB_goDown = false;
var WEB_dontGoLeft = false;
var WEB_dontGoRight = false;
var WEB_dontGoUp = false;
var WEB_dontGoDown = false;
var WEB_pauseGame = false;
var WEB_playerAttack = false;
var WEB_dontPlayerAttack = false;
var WEB_playerStop = false;
var WEB_randomNum = 0;
var WEB_playerHasDied = false;
var WEB_gameOver = false;
var WEB_gameWin = false;


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
        this.invisibleCollider = this.physics.add.sprite(400, -50, 'invisibleCollider');

        // Boton de pausa
        let pause = this.add.image(425, 50, "pause").setScale(0.07);
        pause.setInteractive();
        pause.on('pointerdown', () => {
            pauseGame();
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.switch('pauseOnlineScene');
        })

        // Creación de los dos personajes
        if (Soy_J1) {
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

        this.probabilities = [];

        this.quantEnemiesRound1 = 3;
        this.quantEnemiesRound2 = 4;
        this.quantEnemiesRound3 = 6;
        this.roundCont = 1;

        this.activeEnemies = [this.quantEnemiesRound1];
        this.velocities = [100, 80, 60];
        this.countDead = 0;

        this.createEnemies(this.activeEnemies, this.quantEnemiesRound1);

        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.85);
        this.player2.body.setSize(this.player2.width * 0.5, this.player2.height * 0.85);
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
        this.physics.add.collider(this.player, this.invisibleCollider);
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
        // ANIMACIONES VIVO
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


        // ANIMACIONES TUERTO
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

        // Preparamos los dos personajes orientados hacia la derecha
        if (Soy_J1) {
            this.player2.play('p2TurnRight');
        } else {
            this.player2.play('p1TurnRight');
        }

        // WS SYNC
        // Jugadores
        player1_global = this.player;
        player2_global = this.player2;

        // Enemigos
        activeEnemies_global = this.activeEnemies;
        activeEnemies_length = this.activeEnemies.length;
    }

    /////////// FUNCIONES AUXILIARES //////////

    createEnemies(enemies, size) {

        var enemyPosX = [];
        var enemyPosY = [];
        var equaldistX = 400/size;
        var equaldistY = 250/size;
        var auxX=equaldistX;
        var auxY=equaldistY;

        for(var i=0;i<size;i++){
            enemyPosX[i]= 750 - equaldistX;
            equaldistX=auxX*(i+2);
            console.log(enemyPosX[i]);
        }

        for(var i=0;i<size;i++){
            enemyPosY[i]= 500 - equaldistY;
            equaldistY=auxY*(i+2);
            console.log(enemyPosY[i]);
        }

        var posbol=true;//boleano para alternar la creacion de las posiciones de los enemigos

        for (var i = 0; i < size; i++) {

            if(posbol==true){
                enemies[i] = this.physics.add.sprite(enemyPosX[i], enemyPosY[i], 'girlPolice');
            }else{
                enemies[i] = this.physics.add.sprite(enemyPosX[i], enemyPosY[size-i], 'girlPolice');
            }
            
            enemies[i].name =i.toString();

            enemies[i].body.setSize(enemies[i].width * 0.3, enemies[i].height * 0.85);
            enemies[i].setImmovable(true);
            enemies[i].alive = true;
            enemies[i].turnedLeft = true;
            enemies[i].life = 3;

            this.physics.add.collider(this.player, enemies[i], function (player, police) {
                // if (player.atkP1.isDown) {
                //     police.life -= 1;
                //     if (police.life <= 0) {
                //         police.y = -100;
                //         police.body.moves = false;
                //     }
                // }
                // //numero con el que se ataca
                // var nAttack = 1;
                // //la probabilidad del ataque del enemigo es del 0.0001%
                // var probability = Math.floor(Math.random() * (100) + 1);

                // var playerCoords = player.getCenter();
                // var enemyCoords = police.getCenter();

                // if (nAttack == probability) {
                //     if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
                //     {
                //         police.play('eAttackLeft', true);
                //         player.life -= 1;
                //     } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
                //     {
                //         police.play('eAttackRight', true);
                //         player.life -= 1;
                //     }
                // }
            });

            this.physics.add.collider(this.player2, enemies[i], function (player, police) {
                // if (player.atkP2.isDown) {
                //     police.life -= 1;
                //     if (police.life <= 0) {
                //         police.y = -100;
                //         police.body.moves = false;
                //     }
                // }
                // //numero con el que se ataca
                // var nAttack = 1;
                // //la probabilidad del ataque del enemigo es del 0.0001%
                // var probability = Math.floor(Math.random() * (100) + 1);

                // var playerCoords = player.getCenter();
                // var enemyCoords = police.getCenter();

                // if (nAttack == probability) {
                //     if (playerCoords.x < enemyCoords.x)//si el enemigo va hacia la izquierda
                //     {
                //         police.play('eAttackLeft', true);
                //         player.life -= 1;
                //     } else if (playerCoords.x > enemyCoords.x)//si el enemigo va hacia la derecha
                //     {
                //         police.play('eAttackRight', true);
                //         player.life -= 1;
                //     }
                // }
            });

            if(posbol==true){
                posbol=false;
            } else if(posbol==false){
                posbol=true;
            }
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
        // Numero con el que se ataca
        var nAttack = 1;

        if(Soy_J1){//para que ambos clientes tengan la misma probabilidad de ataque
            probability = this.randomNum(1, 100);
            randomNumber();
        } else {
            probability = Random_Num;
        }

        // La probabilidad del ataque del enemigo es del 0.0001%
        var playerCoords = player.getCenter();
        var enemyCoords = enemy.getCenter();

        if (nAttack == probability) {
            if (playerCoords.x < enemyCoords.x) { //si el enemigo va hacia la izquierda
                this.punchSound.play();
                enemy.play('eAttackLeft', true);
                player.life -= 1;
                this.updateHearts();
            } else if (playerCoords.x > enemyCoords.x) { //si el enemigo va hacia la derecha
                this.punchSound.play();
                enemy.play('eAttackRight', true);
                player.life -= 1;
                this.updateHearts();
            }
            if(player == this.player && player.life <= 0){
                console.log("MATO A JUGADOR");
                killPlayer();
            }
        }
    }

    updateHearts() {
        if (Soy_J1) {
            if (this.player.life == 4) {
                this.cora5.destroy();
                console.log("cora5 destruido");
            }
            if (this.player.life == 3) {
                this.cora4.destroy();
                console.log("cora4 destruido");
            }
            if (this.player.life == 2) {
                this.cora3.destroy();
                console.log("cora3 destruido");
            }
            if (this.player.life == 1) {
                this.cora2.destroy();
                console.log("cora2 destruido");
            }
            if (this.player.life == 0) {
                this.cora1.destroy();
                console.log("cora1 destruido");
            }

            if (this.player2.life == 4) {
                this.cora10.destroy();
                console.log("cora10 destruido");
            }
            if (this.player2.life == 3) {
                this.cora9.destroy();
                console.log("cora9 destruido");
            }
            if (this.player2.life == 2) {
                this.cora8.destroy();
                console.log("cora8 destruido");
            }
            if (this.player2.life == 1) {
                this.cora7.destroy();
                console.log("cora7 destruido");
            }
            if (this.player2.life == 0) {
                this.cora6.destroy();
                console.log("cora6 destruido");
            }
        } else {
            console.log("cliente 2");
            if (this.player2.life == 4) {
                this.cora5.destroy();
                console.log("cora5 destruido");
            }
            if (this.player2.life == 3) {
                this.cora4.destroy();
                console.log("cora4 destruido");
            }
            if (this.player2.life == 2) {
                this.cora3.destroy();
                console.log("cora3 destruido");
            }
            if (this.player2.life == 1) {
                this.cora2.destroy();
                console.log("cora2 destruido");
            }
            if (this.player2.life == 0) {
                this.cora1.destroy();
                console.log("cora1 destruido");
            }

            if (this.player.life == 4) {
                this.cora10.destroy();
                console.log("cora10 destruido");
            }
            if (this.player.life == 3) {
                this.cora9.destroy();
                console.log("cora9 destruido");
            }
            if (this.player.life == 2) {
                this.cora8.destroy();
                console.log("cora8 destruido");
            }
            if (this.player.life == 1) {
                this.cora7.destroy();
                console.log("cora7 destruido");
            }
            if (this.player.life == 0) {
                this.cora6.destroy();
                console.log("cora6 destruido");
            }
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


    /////////// UPDATE //////////

    update() {

        ////////////////////////////////// APARTADO ONLINE (WEBSOCKETS)

        // Sincronización de posiciones
        this.player.setPosition(player1_global.getCenter().x , player1_global.getCenter().y); 
        this.player2.setPosition(player2_global.getCenter().x , player2_global.getCenter().y);

        for (var i = 0; i < this.activeEnemies.length; i++) {
            // Actualizo la posiciónde cada enemigo
            this.activeEnemies[i].setPosition(activeEnemies_global[i].getCenter().x, activeEnemies_global[i].getCenter().y);
        }

        if (WEB_goLeft && !WEB_goRight) { // Movimiento L la izquierda del otro jugador
            //console.log("Mov. Izq");
            this.player2.setVelocityX(-160);
            this.player2.turnedLeft = true;
            WEB_goRight = false;
            
            if (Soy_J1) {
                this.player2.play('p2Left', true); // si soy el J1, el player2 tiene el skin de Tuerto. Ejecutamos la animacion de mov L la izq de Tuerto 
            } else {
                this.player2.play('p1Left', true); // si soy el J2, el player2 tiene el skin de Vivo. Ejecutamos la animacion de mov L la izq de Vivo
            }

            if (WEB_goUp) {
                if (Soy_J1) {
                    //console.log("Mov. Izq-Up");
                    this.player2.stop('p2Left', true);
                    this.player2.play('p2Left', true);
                } else {
                    //console.log("Mov. Izq-Up");
                    this.player2.stop('p1Left', true);
                    this.player2.play('p1Left', true);
                }
                this.player2.setVelocityY(-160);
                WEB_goDown = false;
            }

            if (WEB_goDown) {
                if (Soy_J1) {
                    //console.log("Mov. Izq-Down");
                    this.player2.stop('p2Left', true);
                    this.player2.play('p2Left', true);
                } else {
                    //console.log("Mov. Izq-Down");
                    this.player2.stop('p2Left', true);
                    this.player2.play('p1Left', true);
                }
                this.player2.setVelocityY(160);
                WEB_goUp = false;
            }

            if (WEB_dontGoLeft) {
                //console.log("WEB_dontGoLeft  " + WEB_dontGoLeft);
                WEB_goLeft = false;
                this.player2.setVelocityX(0);
                if (this.player2.turnedLeft) {
                    if (Soy_J1) {
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if (Soy_J1) {
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
                WEB_dontGoLeft = false;
            }

        } 
        
        if (WEB_goRight && !WEB_goLeft) {
            //console.log("Mov. Der");
            this.player2.setVelocityX(160);
            this.player2.turnedLeft = false;
            WEB_goLeft = false;

            if (Soy_J1) {
                this.player2.play('p2Right', true); // si soy el J1, el player2 tiene el skin de Tuerto. Ejecutamos la animacion de mov L la der de Tuerto 
            } else {
                this.player2.play('p1Right', true); // si soy el J2, el player2 tiene el skin de Vivo. Ejecutamos la animacion de mov L la der de Vivo
            }

            if (WEB_goUp) {
                if (Soy_J1) {
                    //console.log("Mov. Der-Up");
                    this.player2.play('p2UpRight', true);
                } else {
                    //console.log("Mov. Der-Up");
                    this.player2.play('p1UpRight', true);
                } 
                this.player2.setVelocityY(-160);
                WEB_goDown = false;
            }

            if (WEB_goDown) {
                if (Soy_J1) {
                    //console.log("Mov. Der-Down");
                    this.player2.play('p2DownRight', true);
                } else {
                    //console.log("Mov. Der-Down");
                    this.player2.play('p1DownRight', true);
                }
                this.player2.setVelocityY(160);
                WEB_goUp = false;
            }

            if (WEB_dontGoRight) {
                //console.log("WEB_dontGoRight  " + WEB_dontGoRight);
                WEB_goRight = false;
                this.player2.setVelocityX(0);
                if (this.player2.turnedLeft) {
                    if (Soy_J1) {
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if (Soy_J1) {
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
                WEB_dontGoRight = false;
            }

        } 
        
        if (WEB_goUp) {
            //console.log("Mov. Up");
            this.player2.setVelocityY(-160);

            if (this.player2.turnedLeft) {
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

            if (WEB_goLeft) {
                if (Soy_J1) {
                    //console.log("Mov. Up-Izq");
                    this.player2.play('p2UpLeft', true);
                } else {
                    //console.log("Mov. Up-Izq");
                    this.player2.play('p1UpLeft', true);
                }
                this.player2.setVelocityX(-160);
                WEB_goRight = false;
            }

            if (WEB_goRight) {
                if (Soy_J1) {
                    //console.log("Mov. Up-Der");
                    this.player2.play('p2UpRight', true);
                } else {
                    //console.log("Mov. Up-Der");
                    this.player2.play('p1UpRight', true);
                }
                this.player2.setVelocityX(160);
                WEB_goLeft = false;
            }

            if (WEB_dontGoUp) {
                //console.log("WEB_dontGoUp  " + WEB_dontGoUp);
                WEB_goUp = false;
                //this.player2.setVelocityY(0);
                if (this.player2.turnedLeft) {
                    if (Soy_J1) {
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if (Soy_J1) {
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
                WEB_dontGoUp = false;
            }

        } 
        
        if (WEB_goDown){
            //console.log("Mov. Down");
            this.player2.setVelocityY(160);

            if (this.player2.turnedLeft) {
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

            if (WEB_goLeft) {
                if (Soy_J1) {
                    //console.log("Mov. Down-Izq");
                    this.player2.play('p2DownLeft', true);
                } else {
                    //console.log("Mov. Down-Izq");
                    this.player2.play('p1DownLeft', true);
                }
                this.player2.setVelocityX(-160);
                WEB_goRight = false; // Si va L la izq ahora, aseguramos que no pueda ir hacia la derecha
            }

            if (WEB_goRight) {
                if (Soy_J1) {
                    //console.log("Mov. Down-Der");
                    this.player2.play('p2DownRight', true);
                } else {
                    //console.log("Mov. Down-Der");
                    this.player2.play('p1DownRight', true);
                }
                this.player2.setVelocityX(160);
                WEB_goLeft = false; // Si va L la der ahora, aseguramos que no pueda ir hacia la izquierda
            }

            if (WEB_dontGoDown) {
                //console.log("WEB_dontGoDown  " + WEB_dontGoDown);
                WEB_goDown = false;
                //this.player2.setVelocityX(0);
                // this.player2.setVelocityY(0);
                if (this.player2.turnedLeft) {
                    if (Soy_J1) {
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if (Soy_J1) {
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
                WEB_dontGoDown = false;
            }
        }     

        if (WEB_playerStop) {
            this.player2.setVelocityX(0);
            this.player2.setVelocityY(0);

            if (this.player2.turnedLeft) {
                if (Soy_J1) {
                    this.player2.play('p2TurnLeft');
                } else {
                    this.player2.play('p1TurnLeft');
                }
            } else {
                if (Soy_J1) {
                    this.player2.play('p2TurnRight');
                } else {
                    this.player2.play('p1TurnRight');
                }
            }
            WEB_playerStop = false;
        }
        
        if(WEB_pauseGame){
            this.scene.stop('gameWin');
            this.scene.stop('gameOver');
            this.scene.switch('pauseOnlineScene');
            WEB_pauseGame = false;
        }

        if (WEB_playerAttack) {
            if (this.player2.turnedLeft) { // ATAQUE A LA IZQ
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
                if (!this.player2.attackLeft) {
                    if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá sonar el sonido de pintura
                        this.paintSound.play();
                    } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá sonar el sonido de spray
                        this.spraySound.play();
                    }
                }
                this.player2.attackLeft = true;
                if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá ejecutarse la animación de ataque de Tuerto
                    this.player2.play('p2AttackLeft');
                } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá ejecutarse la animación de ataque de Vivo
                    this.player2.play('p1AttackLeft');
                }
            } else { // ATAQUE A LA DER
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);
                if (!this.player2.attackRight) {
                    if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá sonar el sonido de pintura
                        this.paintSound.play();
                    } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá sonar el sonido de spray
                        this.spraySound.play();
                    }
                }
                this.player2.attackRight = true;
                if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá ejecutarse la animación de ataque de Tuerto
                    this.player2.play('p2AttackRight');
                } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá ejecutarse la animación de ataque de Vivo
                    this.player2.play('p1AttackRight');
                }
            }

            if (WEB_dontPlayerAttack) {
                WEB_playerAttack = false;
                this.player2.attackRight = false;
                this.player2.attackLeft = false;
                if (this.player2.turnedLeft) {
                    if (Soy_J1) {
                        this.player2.play('p2TurnLeft');
                    } else {
                        this.player2.play('p1TurnLeft');
                    }
                } else {
                    if (Soy_J1) {
                        this.player2.play('p2TurnRight');
                    } else {
                        this.player2.play('p1TurnRight');
                    }
                }
                WEB_dontPlayerAttack = false;
            }
        }

        if(WEB_playerHasDied){
            if (this.player2.turnedLeft) {
                if(Soy_J1){
                    this.player2.play('p2DefeatLeft', true); // Animacion Tuerto
                } else {
                    this.player2.play('p1DefeatLeft', true); // Animacion Vivo
                }
                this.player2.setImmovable(true); 
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);                
            } else {
                if(Soy_J1){
                    this.player2.play('p2DefeatRight', true); // Animacion Tuerto
                } else {
                    this.player2.play('p1DefeatRight', true); // Animacion Vivo
                }
                this.player2.setImmovable(true);
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0); 
            }
            WEB_playerHasDied = false;
        }
        
        if(WEB_gameOver){
            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;

            this.scene.start('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.stop('pauseScene');

            WEB_gameOver = false;
        }

        if (WEB_gameWin) {
            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;

            this.scene.start('gameWinOnline');
            this.scene.stop('onlineLevel');
            this.scene.stop('pauseScene');

            WEB_gameWin = false;
        }

        // ACTUALIZA LA PROFUNDIDAD DE LOS ENEMIGOS
        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                var enemyPos = this.activeEnemies[i].getCenter();
                this.activeEnemies[i].depth = enemyPos.y;
            }
        }

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
                playerMoveLeft(); // Avisamos al otro cliente de que nos movemos L la izquierda
                this.player.setVelocityX(-160);
                this.player.turnedLeft = true;
                
                if(Soy_J1){
                    this.player.play('p1Left', true);
                } else {
                    this.player.play('p2Left', true);
                }                
                
                if (this.player.keyW.isDown) {
                    playerMoveUp();
                    //console.log("Sumo mov. arriba");
                    this.player.setVelocityY(-160);
                }

                if (this.player.keyS.isDown) {
                    playerMoveDown();
                    this.player.setVelocityY(160);
                }
            }
            else if (this.player.keyD.isDown) { // Si el Jugador 1 pulsa la D, se mueve hacia la der
                playerMoveRight(); // Avisamos al otro cliente de que nos movemos L la derecha
                this.player.setVelocityX(160);
                this.player.turnedLeft = false;
                
                if(Soy_J1){
                    this.player.play('p1Right', true);
                } else {
                    this.player.play('p2Right', true);
                } 

                if (this.player.keyW.isDown) {
                    playerMoveUp();
                    this.player.setVelocityY(-160);
                }

                if (this.player.keyS.isDown) {
                    playerMoveDown();
                    this.player.setVelocityY(160);
                }
            }
            else if (this.player.keyW.isDown) { // Si el Jugador 1 pulsa la W, se mueve hacia arriba
                playerMoveUp(); // Avisamos al otro cliente de que nos movemos hacia arriba
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
                //console.log("Entra en Mov.Arriba");
            }
            else if (this.player.keyS.isDown) { // Si el Jugador 1 pulsa la S, se mueve hacia abajo
                playerMoveDown(); // Avisamos al otro cliente de que nos movemos hacia abajo
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

                playerStop();
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

            if(this.player.keyA.isUp){
                //console.log("este jugador ha soltado la tecla A");
                playerStopMoveLeft();
            } 
            if (this.player.keyD.isUp) {
                //console.log("este jugador ha soltado la tecla D");
                playerStopMoveRight();
            } 
            if (this.player.keyW.isUp){
                //console.log("este jugador ha soltado la tecla W");
                playerStopMoveUp();
            } 
            if (this.player.keyS.isUp){
                //console.log("este jugador ha soltado la tecla S");
                playerStopMoveDown();
            }

            // Ataque JUGADOR 1
            if (this.player.atkP1.isDown) {
                playerAttack();
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
                playerStopAttack();
                this.player.attackRight = false;
                this.player.attackLeft = false;
            }
        }

        // J2
        if (this.player2.life <= 0) {
            if (this.player2.turnedLeft) {
                if(Soy_J1){
                    this.player2.play('p2DefeatLeft', true); // Animacion Tuerto
                } else {
                    this.player2.play('p1DefeatLeft', true); // Animacion Vivo
                }
                this.player2.setImmovable(true); 
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0);                
            } else {
                if(Soy_J1){
                    this.player2.play('p2DefeatRight', true); // Animacion Tuerto
                } else {
                    this.player2.play('p1DefeatRight', true); // Animacion Vivo
                }
                this.player2.setImmovable(true);
                this.player2.setVelocityX(0);
                this.player2.setVelocityY(0); 
            }
        } else {
            // Eventos de controles del JUGADOR 2 (para la versión en LOCAL, en online se eliminan)
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
                // this.player2.setVelocityX(0);
                // this.player2.setVelocityY(0);
                // if (this.player2.turnedLeft) {
                //     if(Soy_J1){
                //         this.player2.play('p2TurnLeft');
                //     } else {
                //         this.player2.play('p1TurnLeft');
                //     }
                // } else {
                //     if(Soy_J1){
                //         this.player2.play('p2TurnRight');
                //     } else {
                //         this.player2.play('p1TurnRight');
                //     }
                // }
            }

            // Ataque JUGADOR 2
            // if (WEB_playerAttack) {
            //     if (this.player2.turnedLeft) { // ATAQUE A LA IZQ
            //         this.player2.setVelocityX(0);
            //         this.player2.setVelocityY(0);
            //         if (!this.player2.attackLeft) {
            //             if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá sonar el sonido de pintura
            //                 this.paintSound.play();
            //             } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá sonar el sonido de spray
            //                 this.spraySound.play();
            //             }
            //         }
            //         this.player2.attackLeft = true;
            //         if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá ejecutarse la animación de ataque de Tuerto
            //             this.player2.play('p2AttackLeft');
            //         } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá ejecutarse la animación de ataque de Vivo
            //             this.player2.play('p1AttackLeft');
            //         }
            //     } else { // ATAQUE A LA DER
            //         this.player2.setVelocityX(0);
            //         this.player2.setVelocityY(0);
            //         if (!this.player2.attackRight) {
            //             if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá sonar el sonido de pintura
            //                 this.paintSound.play();
            //             } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá sonar el sonido de spray
            //                 this.spraySound.play();
            //             }
            //         }
            //         this.player2.attackRight = true;
            //         if(Soy_J1){ // si yo soy el J1 (el que creó la partida), el jugador 2 (usuario online) tiene la skin de Tuerto, por lo que deberá ejecutarse la animación de ataque de Tuerto
            //             this.player2.play('p2AttackRight');
            //         } else { // si yo soy el J2 (el que se unió L la partida), el jugador 2 (usuario online) tiene la skin de Vivo, por lo que deberá ejecutarse la animación de ataque de Vivo
            //             this.player2.play('p1AttackRight');
            //         }
            //     }
            // }
            // if (WEB_dontPlayerAttack) {
            //     console.log("ha dejado de atacar");
            //     this.player2.attackRight = false;
            //     this.player2.attackLeft = false;
            //     WEB_dontPlayerAttack = false;
            // }
        }

        var velocitiesSize = this.velocities.length;
        var mediumVelocity = this.velocities[Math.floor(velocitiesSize/2)];

        // ACTUALIZACIÓN PARA QUE LOS ENEMIGOS SIGAN A LOS PERSONAJES
        if(Soy_J1){
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
        } else {
            for (var i = 0; i < this.activeEnemies.length; i++) {
                if (this.activeEnemies[i].alive) {
                    if(this.velocities[i]>=mediumVelocity){
                        if (i % 2 == 0) {
                            if(this.player2.life > 0){
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                            } else {
                                this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i]);
                            }
                        } else {
                            if(this.player.life > 0){
                                this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i]);
                            } else {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i]);
                            }
                        }
                    } else {
                        if (i % 2 == 0) {
                            if(this.player2.life > 0){
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                            } else {
                                this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i] - 1);
                            }
                        } else {
                            if(this.player.life > 0){
                                this.enemyFollow(this.player, this.activeEnemies[i], this.velocities[i] - 1);
                            } else {
                                this.enemyFollow(this.player2, this.activeEnemies[i], this.velocities[i] - 1);
                            }
                        }
                    }
                }
            }
        }

        ////////////////////////////ATAQUE JUGADORES///////////////////////////////
        for (var i = 0; i < this.activeEnemies.length; i++) {
            if (this.activeEnemies[i].alive) {
                var playerPos = this.player.getCenter();
                var enemyPos = this.activeEnemies[i].getCenter();
                var dist = Phaser.Math.Distance.Between(playerPos.x, playerPos.y, enemyPos.x, enemyPos.y);
                
                if (dist <= 101) {
                    if (this.player.atkP1.isDown) {
                        this.activeEnemies[i].life -= 1;
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
                
                if (dist <= 101) {
                    if (WEB_playerAttack) {
                        this.activeEnemies[i].life -= 1;
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

        // Cuando han muerto todos los enemigos de una ronda
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

                partidaCreada = false;
                yaHayUnJugador = false;
                StartGame = false;

                gameWinSync(); // avisamos al otro cliente de que se ha acabado la partida

                this.scene.start('gameWinOnline');
                this.scene.stop('onlineLevel');
                this.scene.stop('pauseScene');
            }
        }

        //Cambiar escena L gameover
        if(this.player.life==0 && this.player2.life==0){
            
            partidaCreada = false;
            yaHayUnJugador = false;
            StartGame = false;

            gameOverSync(); // avisamos al otro cliente de que se ha acabado la partida

            this.scene.start('gameOver');
            this.scene.stop('onlineLevel');
            this.scene.stop('pauseScene');
        }

        // WS SYNC
        player1_global = this.player;
        player1_life = this.player.life;

        player2_global = this.player2;
        player2_life = this.player2.life;

        activeEnemies_global = this.activeEnemies;
        activeEnemies_length = this.activeEnemies.length;
    }

    /////////// SINCRONIZACIÓN DE POSICIONES ENTRE JUGADORES //////////
    // Envío una actualización de las posiciones de los dos jugadores
    checkSync = setInterval(this.makeSyncWSSendMessage, 200);


    makeSyncWSSendMessage() {
        if(StartGame == true){ // Si la partida está en curso
            if (player2_life >= 0 && Soy_J1) { // si el jugador del otro cliente sigue vivo y soy el Jugador 1
                // Sincronización posición jugadores:
                // Este mensaje lo envía el J1, por lo que la pos de Vivo será la de player1 y la de Tuerto la de player2
                syncWS.sendWS(player1_global.getCenter(), player2_global.getCenter()) // envío mensaje de WS para actualizar la información de las posiciones
            }
            
            if (Soy_J1) {
                for (var i = 0; i < activeEnemies_length; i++) {
                    if (activeEnemies_global[i].alive) { // si el enemigo está vivo, envío su posición para actulizarla en el otro cliente
                        // Sincronización posición enemigos:
                        enemySyncWS.sendWS(i, activeEnemies_global[i].getCenter());
                    }
                }
            }
        }
    }
}

// FUNCIONES A EJECUTAR CUANDO connection.js LO SOLICITE

// Estas funciones se ejecutan cuando el cliente ha recibido en connection.js un aviso del servidor para que actualice algún aspecto del juego
// Las funciones activan booleanos que en el update permiten actualizar el juego según las acciones del otro cliente

function activate_WEB_goLeft(){
    //console.log("El OTRO jugador se va L mover L la izquierda");
    WEB_goLeft = true;
}

function activate_WEB_goRight(){
    //console.log("El OTRO jugador se va L mover L la derecha");
    WEB_goRight = true;
}

function activate_WEB_goUp(){
    //console.log("El OTRO jugador se va L mover hacia arriba");
    WEB_goUp = true;
}

function activate_WEB_goDown(){
    //console.log("El OTRO jugador se va L mover hacia abajo");
    WEB_goDown = true;
}

function deactivate_WEB_goLeft(){
    //console.log("El OTRO jugador ha soltado la tecla A");
    WEB_dontGoLeft = true;
}

function deactivate_WEB_goRight(){
    //console.log("El OTRO jugador ha soltado la tecla D");
    WEB_dontGoRight = true;
}

function deactivate_WEB_goUp(){
    //console.log("El OTRO jugador ha soltado la tecla W");
    WEB_dontGoUp = true;
}

function deactivate_WEB_goDown(){
    //console.log("El OTRO jugador ha soltado la tecla S");
    WEB_dontGoDown = true;
}

function makePauseGame(){
    WEB_pauseGame = true;
}

function activate_WEB_playerAttack(){
    WEB_playerAttack = true;
}

function deactivate_WEB_dontPlayerAttack(){
    WEB_dontPlayerAttack = true;
}

function activate_WEB_playerStop(){
    WEB_playerStop = true;
}

function activate_WEB_playerHasDied(){
    WEB_playerHasDied = true;
}

function activate_WEB_gameOver(){
    WEB_gameOver = true;
}

function activate_WEB_gameWin(){
    WEB_gameWin = true;
}