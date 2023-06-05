class countdown extends Phaser.Scene{
   
    constructor(){
        super("countdown");
    }

    initialize(){        
        Phaser.Scene.call(this,{"key": "countdown"})
    }

    preload() {
    }
    
    create(){
        //función del contador
        this.start = false;
        var countdownText = this.add.text(350, 200, '', { font: '180px Arial', fill: '#ffffff', stroke: '#000', strokeThickness: '8' });
        var countdownTime = 4;

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

        this.time.delayedCall(4000, () => {
			this.scene.switch('Level1'),
            this.scene.stop('countdown'),
            console.log('cambio')
		})

    }
};