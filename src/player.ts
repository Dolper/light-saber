import { LevelContoller } from "./LevelCotroller"

export class Player {
    public health
    private text
    private uiPlayAgain: UIImage
    private uiBackGround: UIImage
    private uiGameOver: UIImage
    private canvas: UICanvas
    private damageSystem
    private levelContoller: LevelContoller

    constructor(levelController: LevelContoller) {
        this.levelContoller = levelController
        this.health = 100
        this.canvas = new UICanvas()
        this.damageSystem = new DamageSystem(this.canvas)
        engine.addSystem(this.damageSystem)
        // Create a textShape component, setting the canvas as parent
        this.text = new UIText(this.canvas)
        this.text.value = this.health + " HP"
        this.text.fontSize = 15
        this.text.positionY = 20
        this.text.vAlign = "bottom"
    }

    public damage() {
        this.health -= 5
        this.text.value = this.health + " HP"
        this.damageSystem.isDamage = true
        if (this.health == 0) {
            this.uiBackGround = new UIImage(this.canvas, new Texture("bgRed.png"))
            this.uiBackGround.width = "100%"
            this.uiBackGround.height = "100%"
            this.uiBackGround.sourceWidth = 1
            this.uiBackGround.sourceHeight = 1
            this.uiBackGround.positionY = 0
            this.uiBackGround.vAlign = "bottom"
            this.uiBackGround.visible = true

            this.uiGameOver = new UIImage(this.canvas, new Texture("gameover.png"))
            this.uiGameOver.width = "462"
            this.uiGameOver.height = "117"
            this.uiGameOver.sourceWidth = 462
            this.uiGameOver.sourceHeight = 117
            this.uiGameOver.positionY = 400
            this.uiGameOver.vAlign = "bottom"
            this.uiGameOver.visible = true

            this.uiPlayAgain = new UIImage(this.canvas, new Texture("playagain.png"))
            this.uiPlayAgain.width = "294"
            this.uiPlayAgain.height = "89"
            this.uiPlayAgain.sourceWidth = 294
            this.uiPlayAgain.sourceHeight = 89
            this.uiPlayAgain.positionY = 230
            this.uiPlayAgain.vAlign = "bottom"
            this.uiPlayAgain.visible = true
            this.uiPlayAgain.onClick = new OnClick(() => {
                this.reset()
            })
        }
        if (this.health < 0) this.text.value = "GAME OVER"
    }

    private reset() {
        this.levelContoller.reset()
        this.health = 100
        log("PLAY AGAIN")
        this.text.value = this.health + " HP"
        this.uiPlayAgain.visible = false
        this.uiGameOver.visible = false
        this.uiBackGround.visible = false
    }
}


export class DamageSystem implements ISystem {
    private dt = 0
    public isDamage = false
    private canvas: UICanvas
    private uiArrowDown: UIImage
    private uiArrowTop: UIImage
    private uiArrowRight: UIImage
    private uiArrowLeft: UIImage
    private isCountDown = false

    public constructor(canvas: UICanvas) {
        this.canvas = canvas
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

    update(dt: number) {
        if (this.isDamage) {
            this.uiArrowDown.visible = true
            this.uiArrowTop.visible = true
            this.uiArrowRight.visible = true
            this.uiArrowLeft.visible = true
            this.isDamage = false
            this.isCountDown = true

        }

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
}
