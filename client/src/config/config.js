import PreloaderScene from "../scenes/PreloaderScene"
import TitleScene from "../scenes/TitleScene"
import LobbyScene from "../scenes/LobbyScene"
import HowToPlayScene from "../scenes/HowToPlayScene"
import CreditsScene from "../scenes/CreditsScene"
import GameScene from "../scenes/GameScene"

export default {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1340,
    height: 780,
    scene: [
        PreloaderScene,
        TitleScene,
        LobbyScene,
        HowToPlayScene,
        CreditsScene,
        GameScene
    ]
}