import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import Button from '../helpers/button'
import LobbyButton from '../helpers/LobbyButton'

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Lobby' 
        })
    }

    preload() {}

    create() {
        let self = this

        this.lobbyButtons = {}
		this.lobbyLabels = []

        this.clickSound = this.sound.add('click')
        let clickSound = this.clickSound

        let titleImage = this.add.image(0, 0, 'TableBoard');
        titleImage.setOrigin(0, 0)

        this.buttonBack = new Button(this, config.width/2, 880, 'Back', function() {
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
        invisiblePixel.depth = 2

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
        socket.on('disconnect', this.leaveLobby.bind(this))
    }

    leaveLobby() {
        let socket = this.game.socket
        socket.removeAllListeners()
        this.scene.start('Title')
    }

    addSlots(serverData) {
        console.log('LobbyScene.addSlots')
        console.log(serverData)
        let serverDataAsList = Object.values(serverData)
        let socket = this.game.socket
        let self = this
        let clickSound = this.clickSound
        let invisiblePixel = this.invisiblePixel
		for(var i = 0; i < serverDataAsList.length; i++) {
            var gameData = serverDataAsList[i]
            
            this.lobbyButtons[gameData.id] = new LobbyButton(this, config.width/2, 300 + i*70, '1: Join Game (0/2)', gameData, function() {
                let button = this
                clickSound.play()
                self.cameras.main.fadeOut(FADE_DURATION)
                invisiblePixel.setInteractive()
                self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                    socket.removeAllListeners()
                    self.scene.start('Pending Game', button.gameData)
                })
            })
            
            this.setLobbyButton(this.lobbyButtons[gameData.id], gameData)

        }
	}

    updateSlot(updateInfo) {
        console.log('LobbyScene.updateSlot')
        console.log(updateInfo)
        console.log(updateInfo.gameId)
        console.log(updateInfo.pendingGame)
        console.log('players: ' + Object.keys(updateInfo.pendingGame.players).length)
        this.setLobbyButton(this.lobbyButtons[updateInfo.gameId], updateInfo.pendingGame)
    }

    setLobbyButton(lobbyButton, gameData) {
        var roomNumber = gameData.roomNumber
        var numberOfPlayers = Object.keys(gameData.players).length

        if(numberOfPlayers >= 2) {
            lobbyButton.updateText('Full (' + numberOfPlayers + '/2)')   
            lobbyButton.setDisabled()
            lobbyButton.disableInteractive()
        } else {
            lobbyButton.updateText('Room ' + roomNumber + ' (' + numberOfPlayers + '/2)')   
            lobbyButton.setEnabled()
            lobbyButton.setInteractive()
        }
    }

    getMethods(obj)
    {
        var res = [];
        for(var m in obj) {
            if(typeof obj[m] == "function") {
                res.push(m)
            }
        }
        return res;
    }

    update() {
    }
}