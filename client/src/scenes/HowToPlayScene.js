import config from '../config/config'
import Button from '../helpers/button';

export default class HowToPlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'How To Play' 
        })
    }

    preload() {
        this.load.image('TitleImage', 'src/assets/TitleImage.png');
        this.load.image('blueButton1', 'src/assets/ui/blue_button02.png');
        this.load.image('blueButton2', 'src/assets/ui/blue_button03.png');
    }

    create() {
        let self = this

        let titleImage = this.add.image(0, 0, 'TitleImage');
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, 50, 350, 'blueButton1', 'blueButton2', 'Back', function() {
            self.scene.start('Title')
        });
    }

    update() {
    }
}