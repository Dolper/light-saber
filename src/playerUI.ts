import { LevelContoller } from "./LevelCotroller"

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
    private isOpenedMenu: boolean = false
    private uiUrl: UIText;

    constructor(levelController: LevelContoller) {
        this.levelContoller = levelController
        this.canvas = new UICanvas()
        this.initDamage()
        this.initGameOverUI()
        this.initQR()
        this.initMenu()
    }

    private initMenu() {
        this.uiBackMenu = new UIImage(this.canvas, new Texture("menu.png"))
        this.uiBackMenu.width = "800"
        this.uiBackMenu.height = "500"
        this.uiBackMenu.sourceWidth = 800
        this.uiBackMenu.sourceHeight = 500
        this.uiBackMenu.positionY = 0
        this.uiBackMenu.hAlign = "center"
        this.uiBackMenu.vAlign = "center"
        this.uiBackMenu.visible = false

        this.closeBtn = new UIImage(this.canvas, new Texture("uiClose.png"))
        this.closeBtn.width = "180"
        this.closeBtn.height = "45"
        this.closeBtn.sourceWidth = 233
        this.closeBtn.sourceHeight = 59
        this.closeBtn.positionY = 10
        this.closeBtn.positionX = 0
        this.closeBtn.vAlign = "bottom"
        this.closeBtn.hAlign = "center"
        this.closeBtn.visible = false
        this.closeBtn.onClick = new OnClick(() => {
            this.isOpenedMenu = !this.isOpenedMenu
            this.uiBackMenu.visible = this.isOpenedMenu
            this.menuBtn.visible = !this.isOpenedMenu
            this.closeBtn.visible = this.isOpenedMenu

            this.handsBtn.visible = !this.handsBtn.visible
        })

        this.menuBtn = new UIImage(this.canvas, new Texture("menuBtn.png"))
        this.menuBtn.width = "180"
        this.menuBtn.height = "45"
        this.menuBtn.sourceWidth = 233
        this.menuBtn.sourceHeight = 59
        this.menuBtn.positionY = 10
        this.menuBtn.positionX = 0
        this.menuBtn.vAlign = "bottom"
        this.menuBtn.hAlign = "center"
        this.menuBtn.visible = true
        this.menuBtn.onClick = new OnClick(() => {
            this.isOpenedMenu = !this.isOpenedMenu
            this.uiBackMenu.visible = this.isOpenedMenu
            this.closeBtn.visible = this.isOpenedMenu
            this.menuBtn.visible = !this.isOpenedMenu
            this.handsBtn.visible = !this.handsBtn.visible
        })

        this.handsBtn = new UIImage(this.canvas, new Texture("handsBtn.png"))
        this.handsBtn.width = "200"
        this.handsBtn.height = "50"
        this.handsBtn.sourceWidth = 245
        this.handsBtn.sourceHeight = 71
        this.handsBtn.positionY = 110
        this.handsBtn.positionX = 0
        this.handsBtn.vAlign = "bottom"
        this.handsBtn.hAlign = "center"
        this.handsBtn.visible = false
        this.handsBtn.onClick = new OnClick(() => {
            this.levelContoller.changeHands()
            this.closeMenu()
        })
    }

    private initQR() {
        this.qrPopup = new UIImage(this.canvas, new Texture("qrPopup.png"))
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
        this.uiPin.positionY = 280
        this.uiPin.visible = false

        this.uiUrl = new UIText(this.canvas)
        this.uiUrl.color = Color4.Gray()
        this.uiUrl.fontSize = 20
        this.uiUrl.width = 120
        this.uiUrl.height = 30
        this.uiUrl.vAlign = "bottom"
        this.uiUrl.hAlign = "left"
        this.uiUrl.positionX = 40
        this.uiUrl.positionY = 220
        this.uiUrl.value = 's.dapp-craft.com'
        this.uiUrl.visible = false
    }

    private initDamage() {
        this.uiArrowDown = new UIImage(this.canvas, new Texture("Adown.png"))
        this.uiArrowDown.width = "267"
        this.uiArrowDown.height = "104"
        this.uiArrowDown.sourceWidth = 533
        this.uiArrowDown.sourceHeight = 208
        this.uiArrowDown.positionY = 10
        this.uiArrowDown.vAlign = "bottom"
        this.uiArrowDown.visible = false

        this.uiArrowTop = new UIImage(this.canvas, new Texture("Atop.png"))
        this.uiArrowTop.width = "267"
        this.uiArrowTop.height = "104"
        this.uiArrowTop.sourceWidth = 533
        this.uiArrowTop.sourceHeight = 208
        this.uiArrowTop.positionY = 10
        this.uiArrowTop.vAlign = "top"
        this.uiArrowTop.visible = false

        this.uiArrowLeft = new UIImage(this.canvas, new Texture("Aleft.png"))
        this.uiArrowLeft.width = "104"
        this.uiArrowLeft.height = "267"
        this.uiArrowLeft.sourceWidth = 208
        this.uiArrowLeft.sourceHeight = 533
        this.uiArrowLeft.positionX = 10
        this.uiArrowLeft.hAlign = "left"
        this.uiArrowLeft.visible = false

        this.uiArrowRight = new UIImage(this.canvas, new Texture("Aright.png"))
        this.uiArrowRight.width = "104"
        this.uiArrowRight.height = "267"
        this.uiArrowRight.sourceWidth = 208
        this.uiArrowRight.sourceHeight = 533
        this.uiArrowRight.positionX = -10
        this.uiArrowRight.hAlign = "right"
        this.uiArrowRight.visible = false
    }

    public initGameOverUI() {
        this.uiBackGround = new UIImage(this.canvas, new Texture("bgRed.png"))
        this.uiBackGround.width = "100%"
        this.uiBackGround.height = "100%"
        this.uiBackGround.sourceWidth = 1
        this.uiBackGround.sourceHeight = 1
        this.uiBackGround.positionY = 0
        this.uiBackGround.vAlign = "bottom"
        this.uiBackGround.visible = false

        this.uiGameOver = new UIImage(this.canvas, new Texture("gameover.png"))
        this.uiGameOver.width = "462"
        this.uiGameOver.height = "117"
        this.uiGameOver.sourceWidth = 462
        this.uiGameOver.sourceHeight = 117
        this.uiGameOver.positionY = 400
        this.uiGameOver.vAlign = "bottom"
        this.uiGameOver.visible = false

        this.uiPlayAgain = new UIImage(this.canvas, new Texture("playagain.png"))
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
    public kill() {
        this.uiBackGround.visible = true
        this.uiGameOver.visible = true
        this.uiPlayAgain.visible = true
    }

    private reset() {
        this.uiPlayAgain.visible = false
        this.uiGameOver.visible = false
        this.uiBackGround.visible = false
        this.levelContoller.reset()
        log("PLAY AGAIN")
    }

    hideQR(visible:boolean) {
        this.qrPopup.visible = this.uiPin.visible = this.uiUrl.visible = visible
    }

    showQR(pin: string) {
        this.uiPin.value = "PIN: " + pin.toString()
        this.qrPopup.visible = this.uiPin.visible = this.uiUrl.visible = true
    }

    closeMenu() {
        this.isOpenedMenu = !this.isOpenedMenu
        this.uiBackMenu.visible = this.isOpenedMenu
        this.closeBtn.visible = this.isOpenedMenu
        this.menuBtn.visible = !this.isOpenedMenu
        this.handsBtn.visible = !this.handsBtn.visible
    }
}

