class countdown3 extends Phaser.Scene{
   
    constructor(){
        super("countdown3");
    }

    initialize(){        
        Phaser.Scene.call(this,{"key": "countdown3"})
    }

    preload() {
    }
    
    create(){
        //función del contador
        this.start = false;
        var countdownText = this.add.text(350, 200, '', { font: '180px Arial', fill: '#ffffff', stroke: '#000', strokeThickness: '8' });
        var countdownTime = 4;

        var mensaje = this.scene.settings.data.mensaje
            console.log(mensaje[0])
            console.log(mensaje[1])

        //funcion contador
        function updateCountdown() {
            countdownTime--;
            countdownText.setText(countdownTime);
            if (countdownTime <= 0) {
                this.start=true;
                countdownText.setVisible(false);
                
            }
        }

        this.time.addEvent({
            delay: 1000,
            callback: updateCountdown,
            loop: true
        });

        this.time.delayedCall(4000, () =>{
			this.scene.stop('Level2'),
            this.scene.start('Level3', {mensaje:mensaje}),
            this.scene.stop('countdown3'),
            console.log('cambio')
		});

    }
};