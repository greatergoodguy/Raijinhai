import PreloaderScene from "../scenes/PreloaderScene"
import TitleScene from "../scenes/TitleScene"
import LobbyScene from "../scenes/LobbyScene"
import PendingGameScene from "../scenes/PendingGameScene"
import HowToPlayScene from "../scenes/HowToPlayScene"
import CreditsScene from "../scenes/CreditsScene"
import GameScene from "../scenes/GameScene"

export default {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 1450,
    height: 960,
    scene: [
        PreloaderScene,
        TitleScene,
        LobbyScene,
        PendingGameScene,
        HowToPlayScene,
        CreditsScene,
        GameScene
    ]
}