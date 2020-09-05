import { Tools } from "./tools"
import "./entityExtension"
const camera = Camera.instance

import utils from "../node_modules/decentraland-ecs-utils/index"

export class Sword extends Entity {
    private pinEntity: Entity
    private qrEntity: Entity
    public entity: Entity
    public swordLight: Entity
    public swordRotation: Quaternion;
    constructor(qrEntity: Entity, pinEntity: Entity) {
        super()

        this.qrEntity = qrEntity
        this.pinEntity = pinEntity

        this.swordRotation = new Quaternion()
        var baseSwordRotation = Quaternion.Euler(0,0,0)

        this.addComponent(new Transform({
            position: new Vector3(0.3, 0.5, 0.9),
            // position: new Vector3(16, 1.5, 16),
            rotation: this.swordRotation,
            scale: new Vector3(2, 2, 2)
        }))

        let swordBase = new Entity()
        swordBase.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            rotation:baseSwordRotation,
            scale: new Vector3(1, 1, 1)
        }))
        swordBase.addComponent(new GLTFShape("swordBase.glb"))

        this.swordLight = new Entity()
        this.swordLight.addComponent(new Transform({
            position: new Vector3(0, 0, 0),
            rotation:baseSwordRotation,
            scale: new Vector3(1, 0.02, 1)
        }))
        this.swordLight.addComponent(new GLTFShape("swordLight.glb"))

        const swordLightTest = new Entity()
        swordLightTest.addComponent(new BoxShape())
        const mat = new Material()
        mat.albedoColor = Color3.Green()
        mat.metallic = 0.6
        // mat.roughness = 0.1
        swordLightTest.addComponent(mat)
        swordLightTest.addComponent(new Transform({
            // position: this.globalSwordPos,
            // rotation: this.globalSwordRot,
            scale: new Vector3(0.05, 1, 0.05)
        }))

        engine.addEntity(this)
        swordBase.setParent(this)
        this.swordLight.setParent(this)
        swordLightTest.setParent(this.swordLight)
        this.setParent(Attachable.AVATAR_POSITION)


        /*this.swordLight.getComponent(GLTFShape).withCollisions = false

        // create trigger area object, setting size and relative position
        let triggerBox = new utils.TriggerBoxShape(new Vector3(1, 1, 1), Vector3.Zero())

        //create trigger for entity
        this.swordLight.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                1, //layer
                0, //triggeredByLayer
                () => {
                    log("KILLED!")
                    //this.killed()
                }, //onTriggerEnter
                null,
                null,
                null, true //onCameraExit
            )
        )
*/

        engine.addSystem(new SaberSystem(this, swordBase, this.swordLight))
    }

    private killed() {
        let clip = new AudioClip("sfxFight.mp3")
        let source = new AudioSource(clip)
        source.playing = true
        source.loop = false
        this.swordLight.addComponentOrReplace(source)
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

    private sourceStart: AudioSource
    private sourceSlow: AudioSource
    private sourcesFast
    private lastX = 0
    private lastY = 0

    private globalSword: Entity
    private globalSword2: Entity

    constructor(sword: Entity, swordBase: Entity, swordLight: Entity) {
        log("Saber system init")
        this.swordBase = swordBase
        this.swordLight = swordLight
        this.sword = sword

        this.sourcesFast = []
        this.clipsFast = []

        this.globalSword = new Entity()
        this.globalSword.addComponent(new BoxShape())
        this.globalSword.addComponent(new Transform({
            scale: new Vector3(0.1, 0.1, 0.1)
        }))
        this.globalSword2 = new Entity()
        this.globalSword2.addComponent(new SphereShape())
        this.globalSword2.addComponent(new Transform({
            scale: new Vector3(0.1, 0.1, 0.1)
        }))

        engine.addEntity(this.globalSword)
        engine.addEntity(this.globalSword2)

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
            //log(this.isCanStart)
            if (this.swordLight.getComponent(Transform).scale.y <= 1)
                this.swordLight.getComponent(Transform).scale.y += dt * 2
            else this.isCanStart = false
        }
        if (this.dt > 3) {
            let camRotation = camera.rotation.clone()
            camRotation.x = 0
            camRotation.z = 0
            let ligthPos = this.swordLight.getGlobalPosition()
            ligthPos = camera.position.add(ligthPos.rotate(camRotation))
            let ligthRot = this.swordLight.getGlobalRotation()
            ligthRot = camRotation.multiply(ligthRot)
            // log('swordLight', ligthPos.x, ligthPos.y, ligthPos.z, ligthRot.asArray())

            let originPos = ligthPos.clone()
            ligthPos = ligthPos.add(new Vector3(0.0, -1.0, 0.0))
            let direction = originPos.rotate(ligthRot).normalize()

            // this.globalSword.getComponent(Transform).position = originPos
            this.globalSword2.getComponent(Transform).position = ligthPos.clone().add(direction)

            // let ray: Ray = {
            //     origin: originPos,
            //     direction: direction,
            //     distance: 10,
            // }
            //
            // physicsCast.hitAll(
            //     ray,
            //     (e) => {
            //         for (let entityHit of e.entities) {
            //             log(entityHit.entity.entityId)
            //         }
            //     },
            //     0
            // )
            //
            this.globalSword.getComponent(Transform).position = ligthPos
            // this.globalSword.getComponent(Transform).rotation = ligthRot

            if (!this.isStarted && this.isCanStart) {

                let sx = Math.round(this.sword.getComponent(Transform).rotation.x * 100) / 100
                this.isCanStart = true
                this.sourceStart.playing = true
                this.sourceStart.loop = false

                log("play once")
                this.swordBase.addComponentOrReplace(this.sourceStart)
                this.isStarted = true
            }
        }
        if (this.dt > 4.5) {
            if (!this.isPlaying) {
                this.sourceSlow.playing = true
                this.sourceSlow.loop = true
                this.sourceSlow.volume = 1

                log("playing")
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

            //log("playing FAST:", rnd)
            this.swordBase.addComponentOrReplace(this.sourcesFast[rnd])
            this.isFastPlaying = true
        }

        if (this.timer > 0.5) {
            if (this.lastX != x && this.dt > 3)
                this.isCanStart = true

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