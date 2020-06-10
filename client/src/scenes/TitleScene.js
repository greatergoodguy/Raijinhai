import config from '../config/config'
import Button from '../helpers/button';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Title' 
        })
    }

    preload() {}

    create() {
        let self = this

        let titleImage = this.add.image(0, 0, 'TitleImage')
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, 50, 250, 'blueButton1', 'blueButton2', 'Start Game', function() {
            console.log('Start Game')
        });

        this.button2 = new Button(this, 50, 350, 'blueButton1', 'blueButton2', 'How To Play', function() {
            //self.cameras.main.fadeOut(5000)
            self.scene.start('How To Play')
        });
        this.button3 = new Button(this, 50, 450, 'blueButton1', 'blueButton2', 'Credits', function() {
            //self.cameras.main.fadeIn(1000);
            self.scene.start('Credits')
        });

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', 'Raijinhai', 128);
        this.titleBitmapText.setOrigin(0.5, 0)
    }

    update() {}
}