import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import Button from '../helpers/button';
import LobbyButton from '../helpers/LobbyButton';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Lobby' 
        })
    }

    preload() {}

    create() {
        let self = this

        var clickSound = this.sound.add('click')

        let titleImage = this.add.image(0, 0, 'TitleImage');
        titleImage.setOrigin(0, 0)

        this.buttonBack = new Button(this, 50, 300, 'Back', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Title')
            })
        })

        this.buttonJoinGame = new LobbyButton(this, 400, 300, 'Join Game (0/2)', function() {
        })

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', 'Lobby', 128)
        this.titleBitmapText.setOrigin(0.5, 0)

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