import Title from "../scenes/title"
import Game from "../scenes/game"

export default {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1340,
    height: 780,
    scene: [
        Title,
        Game
    ]
}