import Card from '../helpers/card'
import Zone from '../helpers/zone'
import Dealer from '../helpers/dealer'
import io from 'socket.io-client'
import Button from '../helpers/button'
import config from '../config/config'

const pieceValues = {
    'Card05Queen': 0,
    'Card01Soldier': 1,
    'Card02Calvary': 2,
    'Card03Elephant': 3,
    'Card04Shogun': 4,
    'Card06King': 5,
    'Card07Indra': 6,
}

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game' 
        })
    }

    init(gameId) {
        this.gameId = gameId
	}

    create() {
        let self = this

        this.isPlayerA = false
        this.opponentCards = []
        this.yourCards = []

        let titleImage = this.add.image(0, 0, 'TableBoard')
        titleImage.visible = false
        titleImage.setOrigin(0, 0)

        let titleImageShut = this.add.image(0, 0, 'TableBoard')
        titleImageShut.setOrigin(0, 0)

        this.doorSound = this.sound.add('door')
        this.sound.pauseOnBlur = false
        

        let zoneOffsetY = 140
        this.zone = new Zone(this)
        this.playerDropZone = this.zone.renderZone(config.width/2, config.height/2 + zoneOffsetY)
        //this.playerDropZoneOutline = this.zone.renderOutline(this.playerDropZone)

        this.opponentDropZone = this.zone.renderZone(config.width/2, config.height/2 - zoneOffsetY)
        this.opponentDropZone.disableInteractive()
        //this.opponentDropZoneOutline = this.zone.renderOutline(this.opponentDropZone)
        
        this.previewCard = this.add.image(25, config.height/2, 'CardTemplateBack').setScale(0.7, 0.7)
        this.previewCard.setOrigin(0, 0.5)

        this.zonePlaceholderCard = this.add.image(config.width/2, config.height/2 + zoneOffsetY, 'CardTemplateBack').setScale(0.3, 0.3)
        this.zonePlaceholderCard.setOrigin(0.5, 0.5)
        this.zonePlaceholderCard.visible = false

        this.dealer = new Dealer(this)

        let socket = this.game.socket
        socket.emit("on game start", {gameId: this.gameId, playerId: socket.id})

        let playerText = this.add.text(75, 520, ['']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        playerText.visible = false
        this.gameStart = this.add.text(75, 350, ['GAME START']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        this.gameStart.visible = false
        this.zoneText = this.add.text(config.width/2, config.height/2, ['']).setFontSize(30).setFontFamily('Piedra-Regular').setColor('#fc5e21').setInteractive()
        this.zoneText.setStroke('#70146a', 8)
        this.zoneText.setShadow(2, 2, '#333333', 2, true, true)
        this.zoneText.setOrigin(0.5, 0.5)
        
        this.yourZoneText = this.add.text(0, 0, ['Your Zone']).setFontSize(18).setFontFamily('RobotoSlab-Regular').setColor('#138808')
        this.yourZoneText.setOrigin(0.5, 0)
        Phaser.Display.Align.In.BottomCenter(this.yourZoneText, this.playerDropZone)
        this.opponentZoneText = this.add.text(0, 0, ['Opponent Zone']).setFontSize(18).setFontFamily('RobotoSlab-Regular').setColor('#c90b0b')
        this.opponentZoneText.setOrigin(0.5, 0.5)
        this.opponentZoneText.rotation = Math.PI
        Phaser.Display.Align.In.TopCenter(this.opponentZoneText, this.opponentDropZone)

        // TODO: Delete Me
        //self.dealer.dealCards()

        socket.on('dealCards', function(gameData, invertedGameData) {
            console.log(gameData)

            if(gameData[socket.id] === 1) {
                self.isPlayerA = true
                playerText.setText('Player 1')
                self.opponentId = invertedGameData[2]
            } else if(gameData[socket.id] === 2) {
                self.isPlayerA = false
                playerText.setText('Player 2')
                self.opponentId = invertedGameData[1]
            } else {
                console.log("Something went wrong")
            }

            self.dealer.dealCards()
            self.gameStart.disableInteractive()
            self.gameStart.visible = false
        })

        socket.on('cardPlayed', function(socketId) {
            console.log('socket.on(cardPlayed)')
            if(socketId !== socket.id) {
                var playedCard = self.opponentCards.shift()
                console.log(self.opponentCards)
                playedCard.x = self.opponentDropZone.x;
                playedCard.y = self.opponentDropZone.y
                self.opponentZoneCard = playedCard
                self.opponentZoneCard.rotation = Math.PI
            }

        })

        socket.on('turnFinished', function(roundData) {
            console.log(roundData)
            this.zonePlaceholderCard.visible = false
            self.opponentZoneCard.setTexture(roundData[socket.id]['opponentPiece'])
            self.zoneText.setText(roundData[socket.id]['zoneText'])
            this.doorSound.play()
            titleImage.visible = true
            titleImageShut.visible = false
        }.bind(this))

        socket.on('newRound', function(roundData) {
            console.log(roundData)
            self.playerDropZone.setInteractive()

            self.zoneText.setText("")

            this.doorSound.play()
            titleImage.visible = false
            titleImageShut.visible = true

            if(roundData[socket.id]['destroyPiece']) {
                self.playerZoneCard.data = null
                self.playerZoneCard.destroy()
            } else {
                self.playerZoneCard.setInteractive()
                self.playerZoneCard.x = self.playerZoneCard.data['originX']
                self.playerZoneCard.y = self.playerZoneCard.data['originY']
            }

            if(roundData[self.opponentId]['destroyPiece']) {
                self.opponentZoneCard.data = null
                self.opponentZoneCard.destroy()
            } else {
                self.opponentZoneCard.setTexture('CardTemplateBack')
                self.opponentZoneCard.x = self.opponentZoneCard.data['originX']
                self.opponentZoneCard.y = self.opponentZoneCard.data['originY']
                self.opponentZoneCard.rotation = 0
                self.opponentCards.unshift(self.opponentZoneCard)
            }
        }.bind(this))

        this.gameStart.on('pointerdown', function () {
            socket.emit('dealCards')
        })

        this.gameStart.on('pointerover', function () {
            self.gameStart.setColor('#ff69b4')
        })

        this.gameStart.on('pointerout', function () {
            self.gameStart.setColor('#00FFFF')
        })

        this.input.on('pointerover', function(pointer, gameObject) {
            if(gameObject.length >= 1 && gameObject[0].data && gameObject[0].data.isHand) {
                let textureKey = gameObject[0].texture.key
                this.previewCard.setTexture(textureKey)
            }
        }.bind(this))

        this.input.on('dragstart', function(pointer, gameObject) {
            gameObject.setTint(0xff69b4)
            self.children.bringToTop(gameObject)
        })

        this.input.on('dragend', function(pointer, gameObject, dropped) {
            gameObject.setTint()
            if(!dropped) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX
            gameObject.y = dragY
        })

        this.input.on('drop', function(pointer, gameObject, dropZone) {
            dropZone.disableInteractive()
            dropZone.data.values.cards++
            gameObject.x = dropZone.x
            gameObject.y = dropZone.y
            //gameObject.disableInteractive()
            self.playerZoneCard = gameObject
            socket.emit('cardPlayed', self.gameId, gameObject.texture.key, socket.id)
            this.zonePlaceholderCard.visible = true
            self.children.bringToTop(this.zonePlaceholderCard)
        }.bind(this))

        socket.on("player left", this.playerLeft.bind(this))

        socket.on("endGame", this.endGame.bind(this))

        socket.on('disconnect', this.endGame.bind(this))
    }

    update() {}

    playerLeft(data) {
        console.log('GameScene.playerLeft()')
        console.log(data)

        var opponentCard
        for(opponentCard of this.opponentCards) {
            opponentCard.data = null
        }

        var yourCard
        for(yourCard of this.yourCards) {
            yourCard.data = null
        }
                
        if(this.opponentZoneCard) {
            this.opponentZoneCard.data = null
        }
        if(this.playerZoneCard) {
            this.playerZoneCard.data = null
        }

        this.game.socket.emit("leave pending game")
        this.game.socket.removeAllListeners()
        this.scene.start('Title')
    }

    endGame() {
        console.log('GameScene.endGame()')
        var opponentCard
        for(opponentCard of this.opponentCards) {
            opponentCard.data = null
        }

        var yourCard
        for(yourCard of this.yourCards) {
            yourCard.data = null
        }

        if(this.opponentZoneCard) {
            this.opponentZoneCard.data = null
        }
        if(this.playerZoneCard) {
            this.playerZoneCard.data = null
        }

        this.game.socket.emit("leave pending game")
        this.game.socket.removeAllListeners()
        this.scene.start('Title')
    }
}