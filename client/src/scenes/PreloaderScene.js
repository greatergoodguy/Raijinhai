import config from '../config/config'

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'Preloader' 
        })
    }

    displayLoader() {
        let self = this
        let loadingText = this.add.text(config.width/2, config.height/2, "Loading... ").setFontSize(72)
        loadingText.setOrigin(0.5, 0.5)    
        this.load.on('progress', function(progress) {
            loadingText.setText("Loading... " + Math.round(progress*100) + "%")
        })
        this.load.on('complete', function() {
            self.scene.start("Title")
        })
    }

    preload() {
        this.displayLoader()
        this.load.image('TitleImage', 'src/assets/TitleImage.png');
        this.load.image('blueButton1', 'src/assets/ui/blue_button02.png');
        this.load.image('blueButton2', 'src/assets/ui/blue_button03.png');

        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png')
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png')
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png')
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png')

        this.load.image('Card01Soldier', 'src/assets/Card01Soldier.png')
        this.load.image('Card02Calvary', 'src/assets/Card02Calvary.png')
        this.load.image('Card03Elephant', 'src/assets/Card03Elephant.png')
        this.load.image('Card04Shogun', 'src/assets/Card04Shogun.png')
        this.load.image('Card05Queen', 'src/assets/Card05Queen.png')
        this.load.image('Card06King', 'src/assets/Card06King.png')
        this.load.image('Card07Indra', 'src/assets/Card07Indra.png')
        this.load.image('CardTemplateBack', 'src/assets/CardTemplateBack.png')

        this.load.bitmapFont('khodijah', 'src/assets/fonts/khodijah.png', 'src/assets/fonts/khodijah.fnt')
    }

    create() {}

    update() {}
}