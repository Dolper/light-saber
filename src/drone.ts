import utils from "../node_modules/decentraland-ecs-utils/index"

import {PathData} from "./pathData"
import {PatrolPath} from "./pathData"

const invisibleSphere = new SphereShape()
invisibleSphere.visible = false
invisibleSphere.isPointerBlocker = false

export class Drone extends Entity {
    path: Path3D
    public isLive: boolean
    public attack = 0.05
    public price = 10
    public isExployed = false
    private PatrolPath: PatrolPath
    private handler
    private rayTrigger: Entity;

    constructor(path: Path3D, speed: number, handler, needAddShootComponent) {
        super()
        this.handler = handler
        this.isLive = true
        this.path = path
        this.addComponent(new Transform({
            // position: path.path[0],
            scale: new Vector3(2, 2, 2)
        }))

        this.PatrolPath = new PatrolPath(this, this.path, speed)

        engine.addSystem(this.PatrolPath)
        this.addComponent(new GLTFShape("drone.glb"))

        if (needAddShootComponent) this.addShootComponent()
        this.getComponent(GLTFShape).withCollisions = false

        this.rayTrigger = new Entity("droneRayTrigger")
        this.rayTrigger.addComponent(invisibleSphere)
        this.rayTrigger.addComponent(new Transform({
            scale: new Vector3(0.6, 0.6, 0.6)
        }))

        // create trigger area object, setting size and relative position
        let triggerBox = new utils.TriggerSphereShape(1.5, Vector3.Zero())
        this.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                2, //layer
                1, //triggeredByLayer
                null,
                null,
                () => {
                    if (this.isLive) this.smashPlayer()
                }, //onTriggerEnter
                null, false //onCameraExit
            )
        )
        this.addComponent(new PathData(this.path))
        this.addComponent(new Billboard())
        engine.addEntity(this)
        this.rayTrigger.setParent(this)
        log("Dron added")
    }

    public addShootComponent() {
        this.addComponent(
            new OnPointerDown(() => {
                    log('kill', this)
                    if (this.isLive) this.kill()
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: false,
                    hoverText: "SHOOT",
                    distance: 50,
                })
        )
    }

    private smashPlayer() {
        const explosionPosition = this.die()

        this.handler({
            event: 'smashPlayer',
            drone: this,
            pos: explosionPosition
        })
    }

    public kill() {
        const explosionPosition = this.die()
        log(explosionPosition)
        this.handler({
            event: 'kill',
            drone: this,
            pos: explosionPosition
        })
    }

    private die() {
        this.rayTrigger.setParent(null)
        let clip = new AudioClip("sfxFight.mp3")
        let source = new AudioSource(clip)
        source.playing = true
        source.loop = false
        source.volume = 1
        this.addComponentOrReplace(source)

        const explosionPosition = this.getComponent(Transform).position.clone()
        explosionPosition.y += 0.5

        this.isLive = false
        this.getComponent(GLTFShape).visible = false
        this.getComponent(Transform).position = new Vector3(8, 15, 8)
        engine.removeSystem(this.PatrolPath)
        return explosionPosition
    }
}
