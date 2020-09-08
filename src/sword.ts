import utils from "../node_modules/decentraland-ecs-utils/index"
import { Tools } from "./tools"
import "./entityExtension"
import { Drone } from "./drone";

const camera = Camera.instance
const physicsCast = PhysicsCast.instance
const rayCastDistance = 2

export class Sword extends Entity {
    public swordLight: Entity
    public swordBase: Entity
    public swordRotation: Quaternion
    public isRightHand = false
    private takeHandler
    private pistol: Entity
    private pistolBase: Entity = null;
    private pistolFire: Entity
    public taken: boolean = false;
    takenPistol: boolean = false;
    public isLaserOn = false
    isStartingMoveLaser: boolean = false;
    isStartingMoveLaserSound: boolean = false;
    private pistolSystem: PistolSystem

    constructor(takeHandler) {
        super("Sword")

        this.takeHandler = takeHandler

        this.pistol = new Entity()
        this.pistol.addComponent(new Transform({
            position: new Vector3(16, 1.5, 16),
            scale: new Vector3(0.0001, 0.0001, 0.0001)
        }))
        this.pistolFire = new Entity()
        this.pistolFire.addComponent(new GLTFShape("models/pistolFire.glb"))
        this.pistolFire.addComponent(new Transform())
        this.pistolBase = new Entity()
        this.pistolBase.addComponent(new GLTFShape("models/pistol.glb"))
        this.pistolFire.setParent(this.pistol)
        this.pistolBase.setParent(this.pistol)
        this.pistolSystem = new PistolSystem(this.pistolFire)
        engine.addSystem(this.pistolSystem)
        engine.addEntity(this.pistol)

        this.swordRotation = new Quaternion()
        this.addComponent(new Transform({
            position: new Vector3(16, 1.5, 16),
            rotation: this.swordRotation,
            scale: new Vector3(2, 2, 2)
        }))
        this.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(15, 90, 0)))

        this.swordBase = new Entity()
        this.swordBase.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1)
        }))
        this.swordBase.addComponent(new GLTFShape("models/swordBase.glb"))
        this.swordBase.addComponent(
            new OnPointerDown(() => {
                this.take()
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
        this.changeColor(0)

        engine.addEntity(this)
        this.swordBase.setParent(this)
        this.swordLight.setParent(this)

        // for debug
        // this.take()
    }

    addPistol() {
        this.pistol.getComponent(Transform).position = new Vector3(16, 1.5, 16)
        this.pistol.getComponent(Transform).scale = new Vector3(1.5, 1.5, 1.5)
        this.pistol.addComponent(new utils.KeepRotatingComponent(Quaternion.Euler(15, 90, 0)))
        this.pistolBase.addComponent(
            new OnPointerDown(() => {
                this.takePistol()
            },
                {
                    button: ActionButton.PRIMARY,
                    showFeedback: true,
                    hoverText: "TAKE",
                    distance: 4,
                })
        )
    }

    takePistol() {
        this.takenPistol = true
        this.changeHands(false)
        this.pistol.getComponent(Transform).position.y = 0.55
        this.pistol.getComponent(Transform).position.z = 0.95
        this.pistol.getComponent(Transform).rotation = Quaternion.Euler(0, 270, 0)
        this.pistol.getComponent(Transform).scale = new Vector3(0.8, 0.8, 0.8)
        this.pistol.setParent(Attachable.PLAYER)
        this.pistol.getComponent(utils.KeepRotatingComponent).stop()
        this.pistol.removeComponent(utils.KeepRotatingComponent)
        this.takeHandler('pistol')
    }

    public pistolKill() {
        this.pistolSystem.shoot()
        log("FIRE !!!!!")
    }

    take() {
        this.taken = true
        this.changeHands(false)
        this.getComponent(Transform).position.y = 0.5
        this.getComponent(Transform).position.z = 0.9
        this.getComponent(Transform).scale = new Vector3(1, 1, 1)
        this.setParent(Attachable.PLAYER)
        this.getComponent(utils.KeepRotatingComponent).stop()
        this.removeComponent(utils.KeepRotatingComponent)
        this.swordBase.removeComponent(OnPointerDown)
        this.getComponent(Transform).rotation = this.swordRotation
        engine.addSystem(new SaberSystem(this))
        this.takeHandler('sword')

        this.addPistol()
    }

    switch() {
        // this.isLaserOn = !this.isLaserOn
        this.isStartingMoveLaser = true
        this.isStartingMoveLaserSound = true
    }

    public changeHands(change = true) {
        if (change) this.isRightHand = !this.isRightHand
        let x
        if (this.isRightHand) x = 0.5
        else x = -0.5
        if (this.taken)
            this.getComponent(Transform).position.x = x
        if (this.pistol != null && this.takenPistol) {
            this.pistol.getComponent(Transform).position.x = -x
        }
    }

    colors = [
        new GLTFShape("models/swordLight.glb"),
        new GLTFShape("models/swordLightG.glb"),
        new GLTFShape("models/swordLightR.glb"),
        new GLTFShape("models/swordLightM.glb")
    ]
    currentColor = 0

    changeColor(color = -1) {
        if (color < 0) {
            this.currentColor += 1
        } else {
            this.currentColor = color
        }
        if (this.currentColor >= this.colors.length) {
            this.currentColor = 0
        }
        log('change color', this.currentColor)
        this.swordLight.addComponentOrReplace(this.colors[this.currentColor])
    }
}

export class SaberSystem implements ISystem {
    private timer = 0
    private swordBase: Entity
    private sword: Sword
    private swordLight: Entity
    private isSlowPlaying = false
    private isFastPlaying = false
    private clipStart: AudioClip
    private clipSlow: AudioClip
    private clipsFast

    private globalSword: Entity
    private globalSword2: Entity

    private sourceStart: AudioSource
    private sourceSlow: AudioSource
    private sourcesFast
    private lastRotation: Quaternion = null
    private timerSlowPlaying = 0;
    private timerFastPlaying = 0;
    private timerRayCasting: number = 0;

    constructor(sword: Sword) {
        log("Saber system init")
        this.sword = sword
        this.swordBase = sword.swordBase
        this.swordLight = sword.swordLight

        // for debug
        // this.globalSword = new Entity()
        // this.globalSword.addComponent(new BoxShape())
        // this.globalSword.addComponent(new Transform({
        //     scale: new Vector3(0.01, .01, 0.01)
        // }))
        // this.globalSword.getComponent(BoxShape).withCollisions = false
        // this.globalSword2 = new Entity()
        // this.globalSword2.addComponent(new BoxShape())
        // this.globalSword2.getComponent(BoxShape).withCollisions = false
        // this.globalSword2.addComponent(new Transform({
        //     scale: new Vector3(0.01, 0.01, 0.01)
        // }))
        // engine.addEntity(this.globalSword)
        // engine.addEntity(this.globalSword2)

        this.sourcesFast = []
        this.clipsFast = []

        let music = new AudioClip("sfx/sound.mp3")
        let sourceMusic = new AudioSource(music)
        sourceMusic.playing = true
        sourceMusic.loop = true
        this.sword.addComponentOrReplace(sourceMusic)

        this.clipStart = new AudioClip("sfx/sfxStart.mp3")
        this.sourceStart = new AudioSource(this.clipStart)

        this.clipSlow = new AudioClip("sfx/sfxSlow.mp3")
        this.sourceSlow = new AudioSource(this.clipSlow)

        this.clipsFast[0] = new AudioClip("sfx/sfxFast1.mp3")
        this.sourcesFast[0] = new AudioSource(this.clipsFast[0])

        this.clipsFast[1] = new AudioClip("sfx/sfxFast2.mp3")
        this.sourcesFast[1] = new AudioSource(this.clipsFast[1])

        this.clipsFast[2] = new AudioClip("sfx/sfxFast3.mp3")
        this.sourcesFast[2] = new AudioSource(this.clipsFast[2])
    }

    rayCasting() {
        let camRotation = camera.rotation.clone()
        camRotation.x = 0
        camRotation.z = 0
        let ligthPos = this.swordLight.getGlobalPosition()
        ligthPos = camera.position.add(ligthPos.rotate(camRotation))
        let ligthRot = this.swordLight.getGlobalRotation()
        ligthRot = camRotation.multiply(ligthRot)

        ligthPos = ligthPos.add(new Vector3(0.0, -1.0, 0.0))

        let QSaber = this.sword.getComponent(Transform).rotation
        let QResult = camera.rotation.multiply(QSaber)

        const basePosition = new Vector3(ligthPos.x, ligthPos.y, ligthPos.z)
        // this.globalSword.getComponent(Transform).position = basePosition
        // this.globalSword.getComponent(Transform).rotation = QResult

        let Dir = new Vector3(0, rayCastDistance, 0).rotate(QResult)
        const DirRes = Dir.add(basePosition)
        // this.globalSword2.getComponent(Transform).position = DirRes

        let rayFromPoints = physicsCast.getRayFromPositions(basePosition, DirRes)
        rayFromPoints.distance = rayCastDistance

        physicsCast.hitFirst(
            rayFromPoints,
            (e) => {
                if (e.entity.entityId != null && e.entity.entityId in engine.entities) {
                    const entity = engine.entities[e.entity.entityId]
                    if (entity.hasComponent(SphereShape)) {
                        const drone = entity.getParent()
                        if (drone != null && drone instanceof Drone) {
                            log('kill drone', drone)
                            drone.kill('sword')
                        }
                    }
                }
            })
    }

    update(dt: number) {
        this.timerRayCasting += dt
        this.timer += dt
        this.timerSlowPlaying += dt
        this.timerFastPlaying += dt

        if (this.sword.isLaserOn && this.timerRayCasting > 0.1) {
            this.rayCasting()
            this.timerRayCasting = 0
        }

        if (this.sword.isStartingMoveLaser) {
            if (this.sword.isLaserOn) {
                if (this.swordLight.getComponent(Transform).scale.y > 0.21)
                    this.swordLight.getComponent(Transform).scale.y -= dt
                else {
                    this.swordLight.getComponent(Transform).scale.y = 0.185
                    this.sword.isStartingMoveLaser = false
                    this.sword.isLaserOn = false
                }
            } else {
                if (this.swordLight.getComponent(Transform).scale.y <= 1)
                    this.swordLight.getComponent(Transform).scale.y += dt
                else {
                    this.sword.isStartingMoveLaser = false
                    this.swordLight.getComponent(Transform).scale.y = 1
                    this.sword.isLaserOn = true
                }
            }
        }
        if (this.sword.isStartingMoveLaserSound) {
            this.swordBase.addComponentOrReplace(this.sourceStart)
            this.sourceStart.playOnce()
            this.sword.isStartingMoveLaserSound = false
        }
        // if (this.timerSlowPlaying > 4.5) {
        //     if (!this.isSlowPlaying) {
        //         this.sourceSlow.playing = true
        //         this.sourceSlow.loop = true
        //         this.sourceSlow.volume = 0.2
        //         this.swordLight.addComponent(this.sourceSlow)
        //         this.isSlowPlaying = true
        //         this.timerSlowPlaying = 0
        //     }
        // }

        if (this.timer > 0.5) {
            if (this.lastRotation != null) {
                const diff = Quaternion.Angle(this.sword.swordRotation, this.lastRotation)
                // log('sword move',diff)
                if (diff > 0.15 && !this.sword.isLaserOn) {
                    this.sword.isStartingMoveLaser = true
                    this.sword.isStartingMoveLaserSound = true
                    // this.isSlowPlaying = false
                }
                if (this.timerFastPlaying > 2 && !this.isFastPlaying && diff > 3) {
                    // log('fast', this.timerFastPlaying, diff)
                    let rnd = Tools.getRandomInt(0, 3)
                    this.sourcesFast[rnd].volume = 0.5
                    this.swordBase.addComponentOrReplace(this.sourcesFast[rnd])
                    this.sourcesFast[rnd].playOnce()
                    this.isFastPlaying = true
                    this.timerFastPlaying = 0
                }
            }
            this.timer = 0
            this.isFastPlaying = false
        }
        this.lastRotation = this.sword.swordRotation.clone()
    }
}

export class PistolSystem implements ISystem {
    private fire: Entity
    private dt: number = 0
    private isLive: boolean = false
    public constructor(fire: Entity) { 
        this.fire = fire
    }

    public shoot()
    {
        this.fire.getComponent(Transform).position = new Vector3(0,0,0)
        this.isLive = true
    }

    update(dt: number) {
        if(this.isLive)
        {
            this.fire.getComponent(Transform).scale.x = 7
            this.fire.getComponent(Transform).translate(Vector3.Right().scale(1.5))
            this.dt += dt
        }

        if(this.dt>0.4)
        {
            this.isLive = false
            this.fire.getComponent(Transform).position = new Vector3(0,0,0)
            this.fire.getComponent(Transform).scale.x = 1
            this.dt = 0
        }
    }
}