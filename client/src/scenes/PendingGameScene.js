import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import Button from '../helpers/button';

export default class PendingGameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Pending Game' 
        })
    }

    init(gameData) {
        this.gameData = gameData
        console.log(this.gameData)
	}

    preload() {}

    create() {
        console.log('PendingGameScene.create()')
        let self = this
        let socket = this.game.socket
        let title = 'Room ' + this.gameData.roomNumber

        socket.emit("enter pending game", {gameId: this.gameData.id})

        var clickSound = this.sound.add('click')

        let titleImage = this.add.image(0, 0, 'TitleImage');
        titleImage.setOrigin(0, 0)

        this.buttonBack = new Button(this, 50, 300, 'Back', function() {
            clickSound.play()
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                socket.emit("leave pending game")
                self.scene.start('Lobby')
            })
        })

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', title, 128)
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