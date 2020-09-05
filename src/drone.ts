
import { PathData } from "./pathData"
import { PatrolPath } from "./pathData"

import utils from "../node_modules/decentraland-ecs-utils/index"
import { Sword } from "./sword"
import { Player } from "./player"

export class Drone {
    path: Path3D
    public entity: Entity
    public isLive: boolean
    private sword: Sword
    private explosion: Entity
    private PatrolPath: PatrolPath
    constructor(path: Path3D, speed: number, sword: Sword, player: Player) {
        this.isLive = true
        this.sword = sword
        this.path = path
        this.entity = new Entity()
        this.entity.addComponent(new Transform({
            scale: new Vector3(2, 2, 2)
        }))

        this.PatrolPath = new PatrolPath(this.entity, this.path, speed)

        engine.addSystem(this.PatrolPath)
        this.entity.addComponent(new GLTFShape("drone.glb"))
        this.entity.addComponent(
            new OnPointerDown(() => {
                this.died()
            },
                {
                    button: ActionButton.PRIMARY,
                    showFeedback: true,
                    hoverText: "SHOOT",
                    distance: 14,
                })
        )
        this.entity.getComponent(GLTFShape).withCollisions = false

        // create trigger area object, setting size and relative position
        let triggerBox = new utils.TriggerBoxShape(new Vector3(2, 2, 2), Vector3.Zero())

        //create trigger for entity
        this.entity.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                2, //layer
                1, //triggeredByLayer
                null,
                null,
                () => {
                    //engine.removeEntity(this.entity)
                    log("BANG")
                    this.died()
                    player.damage()
                }, //onTriggerEnter
                null, false //onCameraExit
            )
        )
        this.entity.addComponent(new PathData(this.path))
        this.entity.addComponent(new Billboard())
        log("Dron added")
    }

    private died() {

        this.entity.getComponent(Transform).scale = new Vector3(0.2, 0.2, 0.2)
        this.isLive = false
        let clip = new AudioClip("sfxFight.mp3")
        let source = new AudioSource(clip)
        source.playing = true
        source.loop = false
        this.sword.swordLight.addComponentOrReplace(source)

        let dronPosition = this.entity.getComponent(Transform).position
        this.explosion = new Entity()
        this.explosion.addComponent(new Transform({
            position: new Vector3(dronPosition.x, dronPosition.y + 0.5, dronPosition.z),
            scale: new Vector3(0.02, 0.02, 0.02)
        }))
        this.explosion.addComponent(new GLTFShape("bang.glb"))
        engine.addEntity(this.explosion)

        engine.addSystem(new DroneSystem(this.entity, this.explosion))

    }
}


export class DroneSystem implements ISystem {
    private entity: Entity
    private explosion: Entity
    private isDied = false
    private isExployed = false
    private dt = 0

    public constructor(entity: Entity, explosion: Entity) {
        this.entity = entity
        this.explosion = explosion
        this.entity.getComponent(Transform).position = new Vector3(16, 15, 16)
    }
    update(dt: number) {
        this.dt += dt
        if (!this.isExployed) {
            if (this.dt > 1) {
                if (!this.isDied) {
                    engine.removeEntity(this.entity)
                    this.isDied = true
                }
            }
            if (this.dt > 3) {
                engine.removeEntity(this.explosion)
                this.isExployed = true
                log("BANG!!!! ! ! ! ! ")
            }
        }
    }
}