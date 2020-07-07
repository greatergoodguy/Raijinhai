import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import Button from '../helpers/button'

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Credits' 
        })
    }

    preload() {}

    create() {
        let self = this

        var clickSound = this.sound.add('click')

        let titleImage = this.add.image(0, 0, 'TitleScreen');
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, config.width/2, 530, 'Back', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Title')
            })
        })

        this.titleBitmapText = this.add.bitmapText(config.width/2, 30, 'khodijah', 'Credits', 128)
        this.titleBitmapText.setOrigin(0.5, 0)

        let invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        invisiblePixel.setOrigin(0, 0)

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })

        this.backgroundSquare = this.add.sprite(config.width/2, 200, 'whiteSquare').setScale(4, 2.7)
        this.backgroundSquare.setOrigin(0.5, 0)
        this.backgroundSquare.setTint(0x746865)

        this.credits = "Developer: Tom Yu\n\nArtist: Tom Yu\n\nEmail:\nxuetomyu@gmail.com"
        this.text = this.add.text(config.width/2 - 180, 220, this.credits, { fontFamily: 'RobotoSlab-Regular', fontSize: '32px', fill: '#fff' })
    }

    update() {
    }
}