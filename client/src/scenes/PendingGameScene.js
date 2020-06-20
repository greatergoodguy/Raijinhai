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
        var self = this
        let socket = this.game.socket
        let title = 'Room ' + this.gameData.roomNumber

        let areYouReady = false

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
                socket.removeAllListeners()
                self.scene.start('Lobby')
            })
        })

        this.titleBitmapText = this.add.bitmapText(config.width/2, 50, 'khodijah', title, 128)
        this.titleBitmapText.setOrigin(0.5, 0)

        let invisiblePixel = this.add.image(0, 0, 'InvisiblePixel').setScale(config.width, config.height)
        invisiblePixel.setOrigin(0, 0)
        invisiblePixel.depth = 2

        self.cameras.main.fadeIn(FADE_DURATION)
        invisiblePixel.setInteractive()
        self.cameras.main.once('camerafadeincomplete', function (camera) {
            invisiblePixel.disableInteractive()
        })

        this.youText = this.add.text(400, 300, 'You: Not Ready', { fontSize: '32px', fill: '#000' })
        this.youText.setColor('#ff0000')
        this.opponentText = this.add.text(400, 400, 'Empty', { fontSize: '32px', fill: '#000' })
        this.opponentText.setColor('#ff0000')

        this.buttonReady = new Button(this, 400, 500, 'Ready', function() {
            clickSound.play()
            areYouReady = !areYouReady
            if(areYouReady) {
                self.youText.setText('You: Ready')
                self.youText.setColor('#00ff00')
            } else {
                self.youText.setText('You: Not Ready')
                self.youText.setColor('#ff0000')
            }
            socket.emit('on player ready', {gameId: self.gameData.id, playerId: socket.id, ready: areYouReady})
        })

        socket.on("show current players", this.populateCharacterSquares.bind(this))
        socket.on("player ready", this.playerReady.bind(this))
		socket.on("player joined", this.playerJoined.bind(this))
        socket.on("player left", this.playerLeft.bind(this))
        socket.on('disconnect', this.leavePendingGame.bind(this))
		socket.on("start game on client", function(data) {
            self.cameras.main.fadeOut(FADE_DURATION)
            invisiblePixel.setInteractive()
            console.log('PendingGameScene.startGame()')
            console.log(data)
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                socket.removeAllListeners()
                self.scene.start('Game', self.gameData.id)
            })
        })
    }

    leavePendingGame() {
        let socket = this.game.socket
        socket.emit("leave pending game")
        socket.removeAllListeners()
        this.scene.start('Title')
    }

    update() {
    }


	populateCharacterSquares(data) {
        console.log('PendingGameScene.populateCharacterSquares()')
        console.log(data)
        this.updateOpponentReady(data)
    }

    playerReady(data) {
        console.log('PendingGameScene.playerReady()')
        console.log(data)
        this.updateOpponentReady(data)
    }
    
    playerJoined(data) {
        console.log('PendingGameScene.playerJoined()')
        console.log(data)
        this.updateOpponentReady(data)
    }
    
    playerLeft(data) {
        console.log('PendingGameScene.playerLeft()')
        console.log(data)
        this.updateOpponentReady(data)
    }


    updateOpponentReady(data) {
        let socket = this.game.socket
        var playerIds = Object.keys(data.players)
        var yourId = socket.id
        var opponentId = playerIds.find(id => id != socket.id)
        var opponentData = data.players[opponentId]
        console.log(Object.keys(data.players))
        console.log(Object.keys(data.players).length)
        console.log('yourId: ' + yourId)
        console.log('opponentId: ' + opponentId)
        console.log(opponentData)

        if(!opponentId) {
            this.opponentText.setText('No Opponent')
            this.opponentText.setColor('#ff0000')
        } else if(!opponentData.ready) {
            this.opponentText.setText('Opponent: Not Ready')
            this.opponentText.setColor('#ff0000')
        } else {
            this.opponentText.setText('Opponent: Ready')
            this.opponentText.setColor('#00ff00')
        }
    }
}