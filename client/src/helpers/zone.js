export default class Zone {
    constructor(scene) {
        this.renderZone = (x, y) => {
            let dropZone = scene.add.zone(x, y, 160, 200).setRectangleDropZone(160, 200)
            dropZone.setData({ cards: 0, isOccupied: false })
            return dropZone
        }

        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics()
            dropZoneOutline.lineStyle(4, 0xff68b4)
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}