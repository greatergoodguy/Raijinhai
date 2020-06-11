import { FADE_DURATION }  from '../config/const'
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

        var clickSound = this.sound.add('click')

        let titleImage = this.add.image(0, 0, 'TitleImage')
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, 50, 250, 'Start Game', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Lobby')
            })
        });

        this.button2 = new Button(this, 50, 350, 'How To Play', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('How To Play')
            })
        });
        this.button3 = new Button(this, 50, 450, 'Credits', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Credits')
            })
        });

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', 'Raijinhai', 128)
        this.titleBitmapText.setOrigin(0.5, 0)

        let invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        invisiblePixel.setOrigin(0, 0)

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })
    }

    update() {}
}