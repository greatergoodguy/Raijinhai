export default class Card {
    constructor(scene, originX, originY) {
        let self = this
        this.originX = originX
        this.originY = originY

        this.render = (sprite) => {
            let card = scene.add.image(self.originX, self.originY, sprite).setScale(0.3, 0.3).setInteractive()
            card.data = { 'originX': self.originX, 'originY': self.originY, 'isHand': true }
            scene.input.setDraggable(card)
            return card
        }
    }
}