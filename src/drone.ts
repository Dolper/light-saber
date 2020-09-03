
import { PathData } from "./pathData"
import { PatrolPath } from "./pathData"

import utils from "../node_modules/decentraland-ecs-utils/index"

export class Drone {
    path: Path3D
    public entity: Entity
    constructor(path: Path3D) {
        this.path = path
        this.entity = new Entity()
        this.entity.addComponent(new Transform({
            scale: new Vector3(2, 2, 2)
        }))

        engine.addSystem(new PatrolPath(this.entity, this.path))
        this.entity.addComponent(new GLTFShape("drone.glb"))
      /*  this.entity.getComponent(GLTFShape).withCollisions = false

        // create trigger area object, setting size and relative position
        let triggerBox = new utils.TriggerBoxShape(new Vector3(1, 1, 1), Vector3.Zero())

        //create trigger for entity
        this.entity.addComponent(
            new utils.TriggerComponent(
                triggerBox, //shape
                2, //layer
                1, //triggeredByLayer
                () => {
                    //engine.removeEntity(this.entity)
                    log("died")
                    log(this.entity.getComponent(utils.TriggerComponent))
                }, //onTriggerEnter
                null,
                null,
                null, true //onCameraExit
            )
        )*/
        this.entity.addComponent(new PathData(this.path))
        this.entity.addComponent(new Billboard())
        engine.addSystem(new DroneSystem(this.entity))
    }
}


export class DroneSystem implements ISystem {
    private entity: Entity

    public constructor(entity: Entity) {
        this.entity = entity
    }
    update(dt: number) {


    }
}