import config from '../config/config'
import Button from '../helpers/button';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Title' 
        })
    }

    preload() {
        console.log("TitleScene")
        this.load.image('TitleImage', 'src/assets/TitleImage.png')
        this.load.image('blueButton1', 'src/assets/ui/blue_button02.png')
        this.load.image('blueButton2', 'src/assets/ui/blue_button03.png')
    }

    create() {
        let self = this
        let titleImage = this.add.image(0, 0, 'TitleImage')
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, 230, 200, 'blueButton1', 'blueButton2', 'Start Game', function() {
            console.log('Start Game')
        });
        this.button2 = new Button(this, 230, 300, 'blueButton1', 'blueButton2', 'How To Play', function() {
            //self.cameras.main.fadeOut(5000)
            self.scene.start('How To Play')
        });
        this.button3 = new Button(this, 230, 400, 'blueButton1', 'blueButton2', 'Credits', function() {
            //self.cameras.main.fadeIn(1000);
            self.scene.start('Credits')
        });

        this.titleText = this.add.text(670, 70, ['Raijinhai']).setFontSize(72).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        this.titleText.setOrigin(0.5, 0)
    }

    update() {
    }
}