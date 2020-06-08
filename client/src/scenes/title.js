import config from '../config/config'
import Button from '../helpers/button';

export default class Title extends Phaser.Scene {
    constructor() {
        super({
            key: 'Title' 
        })
    }

    preload() {
        console.log("TitleScene")
        this.load.image('TitleImage', 'src/assets/TitleImage.png');
        this.load.image('blueButton1', 'src/assets/ui/blue_button02.png');
        this.load.image('blueButton2', 'src/assets/ui/blue_button03.png');
    }

    create() {
        let titleImage = this.add.image(0, 0, 'TitleImage');
        titleImage.setOrigin(0, 0)

        this.button1 = new Button(this, 230, 200, 'blueButton1', 'blueButton2', 'Start Game');
        this.button2 = new Button(this, 230, 300, 'blueButton1', 'blueButton2', 'How To Play');
    }

    update() {
    }
}