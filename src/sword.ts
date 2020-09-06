import { Tools } from "./tools"

const camera = Camera.instance
import utils from "../node_modules/decentraland-ecs-utils/index"
import * as ui from '../node_modules/@dcl/ui-utils/index'

export class Sword {
    public uiPin: UIText
    public entity: Entity
    public swordLight: Entity
    public swordBase: Entity
    public qrPopup: UIImage
    public canvas: UICanvas = new UICanvas()

    constructor(pin: string) {
        this.qrPopup = new UIImage(this.canvas, new Texture("qrPopup.png"))
        this.qrPopup.width = "271"
        this.qrPopup.height = "303"
        this.qrPopup.sourceWidth = 271
        this.qrPopup.sourceHeight = 303
        this.qrPopup.positionY = 30
        this.qrPopup.positionX = 30
        this.qrPopup.vAlign = "bottom"
        this.qrPopup.hAlign = "left"
        this.qrPopup.visible = false

        this.uiPin = new UIText(this.canvas)
        this.uiPin.value = "PIN: " + pin
        this.uiPin.color = Color4.Red()
        this.uiPin.fontSize = 20
        this.uiPin.width = 120
        this.uiPin.height = 30
        this.uiPin.vAlign = "bottom"
        this.uiPin.hAlign = "left"
        this.uiPin.positionX = 95
        this.uiPin.positionY = 110
        this.uiPin.visible = false

        this.entity = new Entity()
        this.entity.addComponent(new Transform({
            position: new Vector3(16, 1.5, 16),
            scale: new Vector3(2, 2, 2)
        }))
        this.entity.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(15, 90, 0)))

        this.swordBase = new Entity()
        this.swordBase.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        }))
        this.swordBase.addComponent(new GLTFShape("swordBase.glb"))
        this.swordBase.addComponent(
            new OnPointerDown(() => {
                this.entity.getComponent(Transform).position = new Vector3(0.3, 0.5, 0.9)
                this.entity.getComponent(Transform).scale = new Vector3(1, 1, 1)
                this.entity.setParent(Attachable.PLAYER)
                this.qrPopup.visible = true
                this.uiPin.visible = true
                this.entity.getComponent(utils.KeepRotatingComponent).stop()
                engine.addSystem(new SaberSystem(this))
                
                let pistol = new Entity()
                pistol.addComponent(new Transform({
                    position: new Vector3(16, 1.5, 16),
                    scale: new Vector3(1.5, 1.5, 1.5)
                }))
                pistol.addComponent(new GLTFShape("pistol.glb"))
                pistol.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(15, 90, 0)))
                pistol.addComponent(
                    new OnPointerDown(() => {
                    },
                    {
                        button: ActionButton.PRIMARY,
                        showFeedback: true,
                        hoverText: "WILL BE AVAILABLE IN THE NEXT STAR MARS VERSION",
                        distance: 4,
                    })
            )
                engine.addEntity(pistol)
            },
                {
                    button: ActionButton.PRIMARY,
                    showFeedback: true,
                    hoverText: "TAKE ME",
                    distance: 4,
                })
        )

        this.swordLight = new Entity()
        this.swordLight.addComponent(new Transform({
            position: new Vector3(-0.001, 0.019, 0),
            scale: new Vector3(1, 0.03, 1)
        }))
        this.swordLight.addComponent(new GLTFShape("swordLight.glb"))

        this.swordBase.setParent(this.entity)
        this.swordLight.setParent(this.entity)

        engine.addEntity(this.entity)
    }
}

let physicsCast = PhysicsCast.instance

export class SaberSystem implements ISystem {
    private dt = 0
    private timer = 0
    private swordBase: Entity
    private sword: Entity
    private swordLight: Entity
    private isStarted = false
    private isPlaying = false
    private isFastPlaying = false
    private isCanStart = false
    private clipStart: AudioClip
    private clipSlow: AudioClip
    private clipsFast
    private qrPopup: UIImage
    private uiPin: UIText

    private sourceStart: AudioSource
    private sourceSlow: AudioSource
    private sourcesFast
    private lastX = 0
    private lastY = 0

    constructor(sword: Sword) {
        log("Saber system init")
        this.swordBase = sword.swordBase
        this.swordLight = sword.swordLight
        this.sword = sword.entity
        this.qrPopup = sword.qrPopup
        this.uiPin = sword.uiPin

        this.sourcesFast = []
        this.clipsFast = []

        let music = new AudioClip("sound.mp3")
        let sourceMusic = new AudioSource(music)
        sourceMusic.playing = true
        sourceMusic.loop = true
        this.sword.addComponentOrReplace(sourceMusic)

        this.clipStart = new AudioClip("sfxStart.mp3")
        this.sourceStart = new AudioSource(this.clipStart)

        this.clipSlow = new AudioClip("sfxSlow.mp3")
        this.sourceSlow = new AudioSource(this.clipSlow)

        this.clipsFast[0] = new AudioClip("sfxFast1.mp3")
        this.sourcesFast[0] = new AudioSource(this.clipsFast[0])

        this.clipsFast[1] = new AudioClip("sfxFast2.mp3")
        this.sourcesFast[1] = new AudioSource(this.clipsFast[1])

        this.clipsFast[2] = new AudioClip("sfxFast3.mp3")
        this.sourcesFast[2] = new AudioSource(this.clipsFast[2])
    }

    update(dt: number) {
        this.dt += dt
        this.timer += dt

        if (this.isCanStart) {
            if (this.swordLight.getComponent(Transform).scale.y <= 1)
                this.swordLight.getComponent(Transform).scale.y += dt * 2
            else this.isCanStart = false
        }
        if (this.dt > 3) {
            if (!this.isStarted && this.isCanStart) {
                this.isCanStart = true
                this.sourceStart.playing = true
                this.sourceStart.loop = false
                this.swordBase.addComponentOrReplace(this.sourceStart)
                this.isStarted = true
            }
        }
        if (this.dt > 4.5) {
            if (!this.isPlaying) {
                this.sourceSlow.playing = true
                this.sourceSlow.loop = true
                this.sourceSlow.volume = 0.2
                this.swordLight.addComponent(this.sourceSlow)
                this.isPlaying = true
            }
        }

        let x = Math.abs(this.sword.getComponent(Transform).rotation.x)
        let y = Math.abs(this.sword.getComponent(Transform).rotation.y)

        if (this.dt > 3.2 &&
            ((x > this.lastX + 0.1 || x < this.lastX - 0.1) || (y > this.lastY + 0.1 || y < this.lastY - 0.1)) &&
            !this.isFastPlaying) {
            let rnd = Tools.getRandomInt(0, 3)
            this.sourcesFast[rnd].playOnce()
            this.sourcesFast[rnd].volume = 0.5
            this.swordBase.addComponentOrReplace(this.sourcesFast[rnd])
            this.isFastPlaying = true
        }

        if (this.timer > 0.5) {
            if (this.lastX != x && this.dt > 3) {
                this.isCanStart = true
                this.qrPopup.visible = false
                this.uiPin.visible = false
            }

            /*
  let ray: Ray = {
      origin: camera.position,
      direction: this.sword.getComponent(Transform).rotation,
      distance: 100,
    }
    //log(ray)
    physicsCast.hitFirst(
      ray,
      (e) => {
        log(e.entity.entityId)
      },
      0
    )
*/
            this.timer = 0
            this.lastX = x
            this.lastY = y
            this.isFastPlaying = false
        }
    }
}