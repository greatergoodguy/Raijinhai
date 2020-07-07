import { FADE_DURATION, TITLE_FONT_SIZE }  from '../config/const'
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

        let titleImage = this.add.image(0, 0, 'TitleScreen')
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, config.width/2, 300, 'Start Game', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Lobby')
            })
        });

        this.button2 = new Button(this, config.width/2, 500, 'How To Play', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('How To Play')
            })
        });
        this.button2.visible = false

        this.button3 = new Button(this, config.width/2, 400, 'Credits', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Credits')
            })
        });

        this.titleBitmapText = this.add.bitmapText(config.width/2, 30, 'khodijah', 'Raijinhai', TITLE_FONT_SIZE)
        this.titleBitmapText.setOrigin(0.5, 0)

        let invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        invisiblePixel.setOrigin(0, 0)

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })


        this.backgroundSquare = this.add.sprite(config.width/2, 500, 'whiteSquare').setScale(4, 3.5)
        this.backgroundSquare.setOrigin(0.5, 0)
        this.backgroundSquare.setTint(0x746865)

        this.credits = "How To Play:\n\nEach round, both players select\none combatant to engage in a\n1 v 1 duel. The one with the\nhigher attack wins the round.\n\nWin the game by destroying\nthe opponent's King."
        this.text = this.add.text(config.width/2 - 180, 520, this.credits, { fontFamily: 'RobotoSlab-Regular', fontSize: '24px', fill: '#fff' })
    }

    update() {}
}