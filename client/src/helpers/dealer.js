import Card from './card'

export default class Dealer {
    constructor(scene) {
        this.dealCards = () => {
            let xOffset = 80

            if(scene.isPlayerA) {
                console.log('isPlayerA')
                for (let i = 0; i<10; i++) {
                    let opponentCard = new Card(scene, xOffset + 130*i, 125)
                    scene.opponentCards.push(opponentCard.render('CardTemplateBack').disableInteractive())
                }

            } else {
                console.log('isPlayerB')
                for (let i = 0; i<10; i++) {
                    let opponentCard = new Card(scene, xOffset + 130*i, 125)
                    scene.opponentCards.push(opponentCard.render('CardTemplateBack').disableInteractive())
                }
            }

            scene.yourCards.push(new Card(scene, xOffset + 130*0, 650).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + 130*1, 650).render('Card01Soldier'))
            scene.yourCards.push(new Card(scene, xOffset + 130*2, 650).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + 130*3, 650).render('Card02Calvary'))
            scene.yourCards.push(new Card(scene, xOffset + 130*4, 650).render('Card03Elephant'))
            scene.yourCards.push(new Card(scene, xOffset + 130*5, 650).render('Card03Elephant'))
            scene.yourCards.push(new Card(scene, xOffset + 130*6, 650).render('Card04Shogun'))
            scene.yourCards.push(new Card(scene, xOffset + 130*7, 650).render('Card05Queen'))
            scene.yourCards.push(new Card(scene, xOffset + 130*8, 650).render('Card06King'))
            scene.yourCards.push(new Card(scene, xOffset + 130*9, 650).render('Card07Indra'))
        }
    }
}