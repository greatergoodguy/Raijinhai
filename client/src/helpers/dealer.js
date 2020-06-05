import Card from './card'

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let playerSprite;
            let opponentSprite;

            if(scene.isPlayerA) {
                console.log('isPlayerA')
                playerSprite = 'cyanCardFront'
                opponentSprite = 'magentaCardBack'
            } else {
                console.log('isPlayerB')
                playerSprite = 'magentaCardFront'
                opponentSprite = 'cyanCardBack'
            }

            for (let i = 0; i<5; i++) {
                let playerCard = new Card(scene)
                playerCard.render(475 + (i*100), 650, playerSprite)

                let opponentCard = new Card(scene)
                scene.opponentCards.push(opponentCard.render(475 + (i*100), 125, opponentSprite).disableInteractive())
            }
        }
    }
}