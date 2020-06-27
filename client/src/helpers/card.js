export default class Card {
    constructor(scene, originX, originY) {
        let self = this
        this.originX = originX
        this.originY = originY

        this.render = (sprite) => {
            let card = scene.add.image(self.originX, self.originY, sprite).setScale(0.18, 0.18).setInteractive()
            if(sprite == 'Card01Soldier') {
                card.setScale(0.5, 0.5)
            }
            card.data = { 'originX': self.originX, 'originY': self.originY}
            scene.input.setDraggable(card)
            return card
        }
    }
}