import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import Button from '../helpers/button'

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Credits' 
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

        this.button1 = new Button(this, 50, 450, 'blueButton1', 'blueButton2', 'Back', function() {
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Title')
            })
        })

        let invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        invisiblePixel.setOrigin(0, 0)

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })
    }

    update() {
    }
}