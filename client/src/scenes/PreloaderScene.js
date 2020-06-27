import { FADE_DURATION }  from '../config/const'
import config from '../config/config'
import io from 'socket.io-client'

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Preloader' 
        })
    }

    init() {
        console.log("PreloaderScene: init()")
        //  Inject our CSS
        var element = document.createElement('style')
        document.head.appendChild(element)
        var sheet = element.sheet
        var styles = '@font-face { font-family: "troika"; src: url("src/assets/fonts/ttf/troika.otf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "Caroni"; src: url("src/assets/fonts/ttf/caroni.otf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "Piedra-Regular"; src: url("src/assets/fonts/ttf/Piedra-Regular.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
        styles = '@font-face { font-family: "Assistant-SemiBold"; src: url("src/assets/fonts/ttf/Assistant-SemiBold.ttf") format("opentype"); }\n'
        sheet.insertRule(styles, 0)
    }

    displayLoader() {
        let self = this
        let loadingText = this.add.text(config.width/2, config.height/2, "Loading... 0%").setFontSize(48)
        loadingText.setOrigin(0.5, 0.5)    
        this.load.on('progress', function(progress) {
            loadingText.setText("Loading... " + Math.round(progress*100) + "%")
        })
        this.load.on('complete', function() {
            self.cameras.main.fadeOut(FADE_DURATION)
            self.cameras.main.once('camerafadeoutcomplete', function (camera) {
                self.scene.start('Title')
                //self.scene.start('Game')
            })
        })
    }

    preload() {
        this.displayLoader()
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')

        this.load.image('TitleImage', 'src/assets/TitleImage.png')
        this.load.image('TitleImageShut', 'src/assets/TitleImageShut.png')
        //this.load.image('TableBoard', 'src/assets/TableBoard.png')
        this.load.image('TableBoard', 'src/assets/TableBoard2.jpeg')

        this.load.image('blueButton0', 'src/assets/ui/blue_button00.png')
        this.load.image('blueButton1', 'src/assets/ui/blue_button01.png')
        this.load.image('blueButton2', 'src/assets/ui/blue_button02.png')
        this.load.image('blueButton3', 'src/assets/ui/blue_button03.png')
        this.load.image('blueButton4', 'src/assets/ui/blue_button04.png')
        this.load.image('blueButton5', 'src/assets/ui/blue_button05.png')
        this.load.image('buttonLong_brown', 'src/assets/ui/buttonLong_brown.png')
        this.load.image('buttonLong_brown_pressed', 'src/assets/ui/buttonLong_brown_pressed.png')
        this.load.image('InvisiblePixel', 'src/assets/ui/InvisiblePixel.png')

        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png')
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png')
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png')
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png')

        this.load.image('Card01Soldier', 'src/assets/pieces/Card01Soldier.png')
        this.load.image('Card02Calvary', 'src/assets/pieces/Card02Calvary.png')
        this.load.image('Card03Elephant', 'src/assets/pieces/Card03Elephant.png')
        this.load.image('Card04Shogun', 'src/assets/Card04Shogun.png')
        this.load.image('Card05Queen', 'src/assets/Card05Queen.png')
        this.load.image('Card06King', 'src/assets/Card06King.png')
        this.load.image('Card07Indra', 'src/assets/Card07Indra.png')
        this.load.image('CardTemplateBack', 'src/assets/CardTemplateBack.png')

        this.load.bitmapFont('khodijah', 'src/assets/fonts/khodijah.png', 'src/assets/fonts/khodijah.fnt')

        this.load.audio("click", "src/assets/sounds/click.ogg")
        this.load.audio("door", "src/assets/sounds/door.mp3")

        this.game.socket = io('http://localhost:3000')
        //this.game.socket = io('https://raijinhai-server.herokuapp.com')
    }

    create() {
        WebFont.load({
            custom: {
                families: [ 'troika', 'Caroni', 'Piedra-Regular', 'Assistant-SemiBold' ]
            },
            active: function ()
            {}
        })
    }

    update() {}
}