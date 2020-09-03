export class Player {
    public health
    private text
    private uiImageA
    private canvas: UICanvas
    constructor() {
        this.health = 100
        this.canvas = new UICanvas()

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

        if(this.health == 0)
        {
            this.uiImageA = new UIImage(this.canvas, new Texture("gameover.png"))
            this.uiImageA.width = "800"
            this.uiImageA.height = "560"
            this.uiImageA.sourceWidth = 504
            this.uiImageA.sourceHeight = 367
            this.uiImageA.positionY = 200
            this.uiImageA.vAlign = "top"
            this.uiImageA.visible = true

        }
    }
}