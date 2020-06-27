import Card from './card'

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let xOffset = 70
            let offsetInterval = 100

            let opponentCardYPos1 = 105
            let opponentCardYPos2 = 255
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*0, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*1, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*2, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*3, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*4, opponentCardYPos1).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*0, opponentCardYPos2).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*1, opponentCardYPos2).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*2, opponentCardYPos2).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*3, opponentCardYPos2).render('CardTemplateBack').disableInteractive())
            scene.opponentCards.push(new Card(scene, xOffset + offsetInterval*4, opponentCardYPos2).render('CardTemplateBack').disableInteractive())

            let cardYPos1 = 720
            let cardYPos2 = 870
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*0, cardYPos1).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*0.5, cardYPos1).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*1.5, cardYPos1).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*2, cardYPos1).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*3, cardYPos1).render('Card03Elephant'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*3.5, cardYPos1).render('Card03Elephant'))
            
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*1, cardYPos2).render('Card04Shogun'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*2, cardYPos2).render('Card05Queen'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*3, cardYPos2).render('Card06King'))
            scene.yourCards.push(new Card(scene, xOffset + offsetInterval*4, cardYPos2).render('Card07Indra'))
        }
    }
}