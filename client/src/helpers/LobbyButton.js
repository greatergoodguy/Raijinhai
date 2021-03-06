import 'phaser';

export default class LobbyButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, text, gameData, onButtonClick) {
    super(scene)

    this.scene = scene
    this.onButtonClick = onButtonClick
    this.gameData = gameData

    this.xScale = 2.0

    this.button = this.scene.add.sprite(0, 0, 'buttonLong_brown').setScale(this.xScale, 1.1).setInteractive()
    this.text = this.scene.add.text(0, 0, text, { fontFamily: 'Assistant-SemiBold', fontSize: '32px', fill: '#fff' })
    Phaser.Display.Align.In.Center(this.text, this.button)

    this.add(this.button)
    this.add(this.text)

    this.button.on('pointerdown', function () {
      this.button.setTint(0xDCDCDC)
      this.button.setTexture('buttonLong_brown_pressed')
    }.bind(this));

    this.button.on('pointerup', function () {
      this.button.setTint()
      this.button.setTexture('buttonLong_brown')
      this.onButtonClick()
    }.bind(this));

    this.button.on('pointerover', function () {
      this.button.setTint(0xDCDCDC)
      this.button.setTexture('buttonLong_brown')
    }.bind(this));

    this.button.on('pointerout', function () {
      this.button.setTint()
      this.button.setTexture('buttonLong_brown')
    }.bind(this));

    this.x = x
    this.y = y

    this.scene.add.existing(this)
  }

  updateText(newText) {
    this.text.setText(newText)
    Phaser.Display.Align.In.Center(this.text, this.button)
  }

  setInteractive() {
    this.button.setInteractive()
  }

  disableInteractive() {
    this.button.disableInteractive()
  }

  setDisabled() {
    this.button.setTint(0x808080)
    this.button.setTexture('buttonLong_brown_pressed')
  }

  setEnabled() {
    this.button.setTint()
    this.button.setTexture('buttonLong_brown')
  }
}