import Card from '../helpers/card'
import Zone from '../helpers/zone'
import Dealer from '../helpers/dealer'
import io from 'socket.io-client'

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

    preload() {
        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png')
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png')
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png')
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png')

        this.load.image('Card01Soldier', 'src/assets/Card01Soldier.png')
        this.load.image('Card02Calvary', 'src/assets/Card02Calvary.png')
        this.load.image('Card03Elephant', 'src/assets/Card03Elephant.png')
        this.load.image('Card04Shogun', 'src/assets/Card04Shogun.png')
        this.load.image('Card05Queen', 'src/assets/Card05Queen.png')
        this.load.image('Card06King', 'src/assets/Card06King.png')
        this.load.image('Card07Indra', 'src/assets/Card07Indra.png')
        this.load.image('CardTemplateBack', 'src/assets/CardTemplateBack.png')
    }

    create() {
        let self = this

        this.isPlayerA = false
        this.opponentCards = []

        this.zone = new Zone(this)
        this.playerDropZone = this.zone.renderZone(400, 375)
        this.playerDropZoneOutline = this.zone.renderOutline(this.playerDropZone)

        this.opponentDropZone = this.zone.renderZone(1100, 375)
        this.opponentDropZone.disableInteractive()
        this.opponentDropZoneOutline = this.zone.renderOutline(this.opponentDropZone)
        
        this.dealer = new Dealer(this)

        let socket = io('http://localhost:3000')
        //let socket = io('https://raijinhai-server.herokuapp.com')
        socket.on('connect', function() {
            console.log('Connected!' + socket.id)
        })

        let playerText = this.add.text(75, 520, ['']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        this.gameStart = this.add.text(75, 350, ['GAME START']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        this.zoneText = this.add.text(700, 375, ['']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF').setInteractive()
        this.add.text(350, 520, ['Your Zone']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF')
        this.add.text(1050, 520, ['Opponent Zone']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00FFFF')

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
            }

        })

        socket.on('turnFinished', function(roundData) {
            console.log(roundData)
            self.opponentZoneCard.setTexture(roundData[socket.id]['opponentPiece'])
            self.zoneText.setText(roundData[socket.id]['zoneText'])
        })

        socket.on('newRound', function(roundData) {
            console.log(roundData)
            self.playerDropZone.setInteractive()

            self.zoneText.setText("")

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
                self.opponentCards.unshift(self.opponentZoneCard)
            }
        })

        this.gameStart.on('pointerdown', function () {
            socket.emit('dealCards')
        })

        this.gameStart.on('pointerover', function () {
            self.gameStart.setColor('#ff69b4')
        })

        this.gameStart.on('pointerout', function () {
            self.gameStart.setColor('#00FFFF')
        })

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
            gameObject.disableInteractive()
            self.playerZoneCard = gameObject
            socket.emit('cardPlayed', gameObject.texture.key, socket.id)
        })
    }

    update() {

    }
}