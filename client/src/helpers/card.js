export default class Card {
    constructor(scene, originX, originY) {
        let self = this
        this.originX = originX
        this.originY = originY

        this.render = (sprite) => {
            let card = scene.add.image(self.originX, self.originY, sprite).setScale(0.25, 0.25).setInteractive()
            card.data = { 'originX': self.originX, 'originY': self.originY}
            scene.input.setDraggable(card)
            return card
        }
    }
}