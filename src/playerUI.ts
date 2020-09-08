import { LevelContoller } from "./LevelCotroller"
import * as ui from '../node_modules/@dcl/ui-utils/index'
import { PromptStyles, ButtonStyles } from "../node_modules/@dcl/ui-utils/utils/types"

export class PlayerUI {
    private uiPlayAgain: UIImage
    private uiBackGround: UIImage
    private uiBackMenu: UIImage
    private uiGameOver: UIImage
    private canvas: UICanvas
    private levelContoller: LevelContoller

    private dt = 0
    private uiArrowDown: UIImage
    private uiArrowTop: UIImage
    private uiArrowRight: UIImage
    private uiArrowLeft: UIImage
    private isCountDown = false
    private qrPopup: UIImage
    private uiPin: UIText
    private menuBtn: UIImage
    private closeBtn: UIImage
    private handsBtn: UIImage
    private privacyBtn: UIImage
    private discordBtn: UIImage
    private isOpenedMenu: boolean = false
    private uiUrl: UIText;
    private isCanChangeHands = false

    constructor(levelController: LevelContoller) {
        this.levelContoller = levelController
        this.canvas = new UICanvas()
        this.initDamage()
        this.initGameOverUI()
        this.initQR()
        this.initMenu()
    }

    private initMenu() {
        this.uiBackMenu = new UIImage(this.canvas, new Texture("textures/menu.png"))
        this.uiBackMenu.width = "800"
        this.uiBackMenu.height = "500"
        this.uiBackMenu.sourceWidth = 800
        this.uiBackMenu.sourceHeight = 500
        this.uiBackMenu.positionY = 0
        this.uiBackMenu.hAlign = "center"
        this.uiBackMenu.vAlign = "center"
        this.uiBackMenu.visible = false

        this.closeBtn = new UIImage(this.canvas, new Texture("textures/uiClose.png"))
        this.closeBtn.width = "160"
        this.closeBtn.height = "40"
        this.closeBtn.sourceWidth = 220
        this.closeBtn.sourceHeight = 51
        this.closeBtn.positionY = 10
        this.closeBtn.positionX = 0
        this.closeBtn.vAlign = "bottom"
        this.closeBtn.hAlign = "center"
        this.closeBtn.visible = false
        this.closeBtn.onClick = new OnClick(() => {
            this.closeMenu()
        })

        this.menuBtn = new UIImage(this.canvas, new Texture("textures/menuBtn.png"))
        this.menuBtn.width = "160"
        this.menuBtn.height = "40"
        this.menuBtn.sourceWidth = 220
        this.menuBtn.sourceHeight = 51
        this.menuBtn.positionY = 10
        this.menuBtn.positionX = 0
        this.menuBtn.vAlign = "bottom"
        this.menuBtn.hAlign = "center"
        this.menuBtn.visible = true
        this.menuBtn.onClick = new OnClick(() => {
            this.closeMenu()
        })

        this.discordBtn = new UIImage(this.canvas, new Texture("textures/discordBtn.png"))
        this.discordBtn.width = "99"
        this.discordBtn.height = "99"
        this.discordBtn.sourceWidth = 99
        this.discordBtn.sourceHeight = 99
        this.discordBtn.positionY = 95
        this.discordBtn.positionX = 280
        this.discordBtn.vAlign = "bottom"
        this.discordBtn.hAlign = "center"
        this.discordBtn.visible = false
        this.discordBtn.onClick = new OnClick(() => {
            openExternalURL("https://discord.gg/J4ASyB6")
        })

        this.privacyBtn = new UIImage(this.canvas, new Texture("textures/privacyBtn.png"))
        this.privacyBtn.width = "200"
        this.privacyBtn.height = "50"
        this.privacyBtn.sourceWidth = 245
        this.privacyBtn.sourceHeight = 71
        this.privacyBtn.positionY = 90
        this.privacyBtn.positionX = 90
        this.privacyBtn.vAlign = "bottom"
        this.privacyBtn.hAlign = "center"
        this.privacyBtn.visible = false
        this.privacyBtn.onClick = new OnClick(() => {
            openExternalURL("http://blog.dapp-craft.com/star-mars-prv")
        })

        this.handsBtn = new UIImage(this.canvas, new Texture("textures/handsBtn.png"))
        this.handsBtn.width = "200"
        this.handsBtn.height = "50"
        this.handsBtn.sourceWidth = 245
        this.handsBtn.sourceHeight = 71
        this.handsBtn.positionY = 140
        this.handsBtn.positionX = 90
        this.handsBtn.vAlign = "bottom"
        this.handsBtn.hAlign = "center"
        this.handsBtn.visible = false
        this.handsBtn.onClick = new OnClick(() => {
            this.levelContoller.changeHands()
            this.closeMenu()
        })
    }

    private initQR() {
        this.qrPopup = new UIImage(this.canvas, new Texture("textures/qrPopup.png"))
        this.qrPopup.width = "271"
        this.qrPopup.height = "303"
        this.qrPopup.sourceWidth = 271
        this.qrPopup.sourceHeight = 303
        this.qrPopup.positionY = 200
        this.qrPopup.positionX = 30
        this.qrPopup.vAlign = "bottom"
        this.qrPopup.hAlign = "left"
        this.qrPopup.visible = false

        this.uiPin = new UIText(this.canvas)
        this.uiPin.color = Color4.Red()
        this.uiPin.fontSize = 20
        this.uiPin.width = 120
        this.uiPin.height = 30
        this.uiPin.vAlign = "bottom"
        this.uiPin.hAlign = "left"
        this.uiPin.positionX = 95
        this.uiPin.positionY = 275
        this.uiPin.visible = false

        this.uiUrl = new UIText(this.canvas)
        this.uiUrl.color = Color4.Gray()
        this.uiUrl.fontSize = 12
        this.uiUrl.width = 120
        this.uiUrl.height = 30
        this.uiUrl.vAlign = "bottom"
        this.uiUrl.hAlign = "left"
        this.uiUrl.positionX = 90
        this.uiUrl.positionY = 300
        this.uiUrl.value = 's.dapp-craft.com'
        this.uiUrl.visible = false
    }

    private initDamage() {
        this.uiArrowDown = new UIImage(this.canvas, new Texture("textures/Adown.png"))
        this.uiArrowDown.width = "267"
        this.uiArrowDown.height = "104"
        this.uiArrowDown.sourceWidth = 533
        this.uiArrowDown.sourceHeight = 208
        this.uiArrowDown.positionY = 10
        this.uiArrowDown.vAlign = "bottom"
        this.uiArrowDown.visible = false

        this.uiArrowTop = new UIImage(this.canvas, new Texture("textures/Atop.png"))
        this.uiArrowTop.width = "267"
        this.uiArrowTop.height = "104"
        this.uiArrowTop.sourceWidth = 533
        this.uiArrowTop.sourceHeight = 208
        this.uiArrowTop.positionY = 10
        this.uiArrowTop.vAlign = "top"
        this.uiArrowTop.visible = false

        this.uiArrowLeft = new UIImage(this.canvas, new Texture("textures/Aleft.png"))
        this.uiArrowLeft.width = "104"
        this.uiArrowLeft.height = "267"
        this.uiArrowLeft.sourceWidth = 208
        this.uiArrowLeft.sourceHeight = 533
        this.uiArrowLeft.positionX = 10
        this.uiArrowLeft.hAlign = "left"
        this.uiArrowLeft.visible = false

        this.uiArrowRight = new UIImage(this.canvas, new Texture("textures/Aright.png"))
        this.uiArrowRight.width = "104"
        this.uiArrowRight.height = "267"
        this.uiArrowRight.sourceWidth = 208
        this.uiArrowRight.sourceHeight = 533
        this.uiArrowRight.positionX = -10
        this.uiArrowRight.hAlign = "right"
        this.uiArrowRight.visible = false
    }

    public initGameOverUI() {
        this.uiBackGround = new UIImage(this.canvas, new Texture("textures/bgRed.png"))
        this.uiBackGround.width = "100%"
        this.uiBackGround.height = "100%"
        this.uiBackGround.sourceWidth = 1
        this.uiBackGround.sourceHeight = 1
        this.uiBackGround.positionY = 0
        this.uiBackGround.vAlign = "bottom"
        this.uiBackGround.visible = false

        this.uiGameOver = new UIImage(this.canvas, new Texture("textures/gameover.png"))
        this.uiGameOver.width = "462"
        this.uiGameOver.height = "117"
        this.uiGameOver.sourceWidth = 462
        this.uiGameOver.sourceHeight = 117
        this.uiGameOver.positionY = 550
        this.uiGameOver.vAlign = "bottom"
        this.uiGameOver.visible = false

        this.uiPlayAgain = new UIImage(this.canvas, new Texture("textures/playagain.png"))
        this.uiPlayAgain.width = "294"
        this.uiPlayAgain.height = "89"
        this.uiPlayAgain.sourceWidth = 294
        this.uiPlayAgain.sourceHeight = 89
        this.uiPlayAgain.positionY = 230
        this.uiPlayAgain.vAlign = "bottom"
        this.uiPlayAgain.visible = false
        this.uiPlayAgain.isPointerBlocker = true
        this.uiPlayAgain.onClick = new OnClick(() => {
            this.reset()
        })
    }

    update(dt: number) {
        if (this.isCountDown) {
            this.dt += dt
        }

        if (this.dt > 0.5) {
            this.uiArrowDown.visible = false
            this.uiArrowTop.visible = false
            this.uiArrowRight.visible = false
            this.uiArrowLeft.visible = false
            this.isCountDown = false
            this.dt = 0
        }
    }

    public damage() {
        this.uiArrowDown.visible = true
        this.uiArrowTop.visible = true
        this.uiArrowRight.visible = true
        this.uiArrowLeft.visible = true
        this.isCountDown = true
        this.dt = 0
    }

    public showHighscore(data) {
        let NameColumn = 'Name\n'
        let ScoreColumn = 'Score\n'
        data.forEach(s => {
            NameColumn += s.userName + '\n'
            ScoreColumn += s.score + '\n'
        })
        let prompt = new ui.CustomPrompt(PromptStyles.LIGHTLARGE,400, 400)
        prompt.canvas = this.canvas
        prompt.addText('Highscore', 0, 150, Color4.Red(), 30)
        prompt.addText(NameColumn, -100, -100).text.hTextAlign = 'left'
        prompt.addText(ScoreColumn, 100, -100).text.hTextAlign = 'right'

        prompt.addButton(
            'Again',
            0,
            -200,
            () => {
                log('Try again')
                this.reset()
                prompt.close()
            },
            ButtonStyles.E
        )
        //
        // prompt.addButton(
        //     'Go Miner Zone',
        //     100,
        //     -100,
        //     () => {
        //         log('No')
        //         prompt.close()
        //     },
        //     ButtonStyles.F
        // )
    }

    public kill() {
        // this.showHighscore([])
        // this.uiBackGround.visible = true
        this.uiGameOver.visible = true
        // this.uiPlayAgain.visible = true
    }

    private reset() {
        this.uiPlayAgain.visible = false
        this.uiGameOver.visible = false
        this.uiBackGround.visible = false
        this.levelContoller.reset()
        log("PLAY AGAIN")
    }

    hideQR(visible: boolean) {
        this.qrPopup.visible = this.uiPin.visible = this.uiUrl.visible = visible
    }

    showQR(pin: string) {
        this.uiPin.value = "PIN: " + pin.toString()
        this.qrPopup.visible = this.uiPin.visible = this.uiUrl.visible = true

    }

    closeMenu() {
        this.isOpenedMenu = !this.isOpenedMenu
        this.uiBackMenu.visible = !this.uiBackMenu.visible
        this.menuBtn.visible = !this.menuBtn.visible
        this.closeBtn.visible = !this.closeBtn.visible
        this.handsBtn.visible = !this.handsBtn.visible
        this.privacyBtn.visible = !this.privacyBtn.visible
        this.discordBtn.visible = !this.discordBtn.visible
    }
}

