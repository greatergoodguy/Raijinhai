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

        this.lobbyButtons = []
		this.lobbyLabels = []

        this.clickSound = this.sound.add('click')
        let clickSound = this.clickSound

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

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', 'Lobby', 128)
        this.titleBitmapText.setOrigin(0.5, 0)

        this.invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        let invisiblePixel = this.invisiblePixel
        invisiblePixel.setOrigin(0, 0)

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })

        let socket = this.game.socket
        socket.emit("enter lobby")
        if(!socket.hasListeners("add slots")) {
			socket.on("add slots", this.addSlots.bind(this));
			socket.on("update slot", this.updateSlot.bind(this));
        }
    }

    addSlots(serverData) {
        console.log('LobbyScene.addSlots')
        console.log(serverData)
        let serverDataAsList = Object.values(serverData)
        let self = this
        let clickSound = this.clickSound
        let invisiblePixel = this.invisiblePixel
		for(var i = 0; i < serverDataAsList.length; i++) {
            var gameData = serverDataAsList[i]
            var buttonText = ''
            let callback = this.joinGame
            if(gameData.state == 'empty') {
                buttonText = gameData.roomNumber + ': Join Game (0/2)'
                callback = this.joinGame
            } else {
                buttonText = 'Game Full'
                callback = this.gameFull
            }
            
            this.lobbyButtons[i] = new LobbyButton(this, 400, 300 + i*70, buttonText, gameData, function() {
                let button = this
                clickSound.play()
                self.cameras.main.fadeOut(FADE_DURATION)
                invisiblePixel.setInteractive()
                self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                    self.scene.start('Pending Game', button.gameData)
                })
            }, i)
		}
	}

    updateSlot(updateInfo) {
        console.log('LobbyScene.updateSlot')
        console.log(updateInfo)
    }

    update() {
    }

    joinGame() {
        console.log('LobbyScene.joinGame')
    }

    gameFull() {
        console.log('LobbyScene.gameFull')
    }
}