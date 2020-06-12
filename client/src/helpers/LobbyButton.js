import 'phaser';

export default class LobbyButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, gameData, onButtonClick) {
    super(scene)
    this.scene = scene
    this.onButtonClick = onButtonClick
    this.gameData = gameData

    this.xScale = 4.0

    this.button = this.scene.add.sprite(0, 0, 'blueButton2').setScale(this.xScale, 1.1).setInteractive()
    this.text = this.scene.add.text(0, 0, text, { fontSize: '32px', fill: '#fff' })
    Phaser.Display.Align.In.Center(this.text, this.button)

    this.add(this.button)
    this.add(this.text)

    this.button.on('pointerdown', function () {
      this.button.setTexture('blueButton3')
    }.bind(this));

    this.button.on('pointerup', function () {
      this.button.setTexture('blueButton2')
      this.onButtonClick()
    }.bind(this));

    this.button.on('pointerover', function () {
      this.button.setTexture('blueButton4')
    }.bind(this));

    this.button.on('pointerout', function () {
      this.button.setTexture('blueButton2')
    }.bind(this));

    this.x = x + (this.button.width/2) * this.xScale
    this.y = y

    this.scene.add.existing(this)
  }
}