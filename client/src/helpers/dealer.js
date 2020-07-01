import Card from './card'

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let xOffset = 80
            let offsetInterval = 143

            let opponentCardYPos1 = 101
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*0, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*1, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*2, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*3, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*4, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*5, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*6, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*7, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*8, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*9, opponentCardYPos1).render('CardTemplateBack').disableInteractive())

            let cardYPos1 = 858
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*0, cardYPos1).render('Card05Queen'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*1, cardYPos1).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*2, cardYPos1).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*3, cardYPos1).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*4, cardYPos1).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*5, cardYPos1).render('Card03Elephant'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*6, cardYPos1).render('Card03Elephant'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*7, cardYPos1).render('Card04Shogun'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*8, cardYPos1).render('Card06King'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*9, cardYPos1).render('Card07Indra'))
        }
    }
}