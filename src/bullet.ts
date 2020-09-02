
export class Bullet {
    private entity: Entity
    constructor() {
        this.entity = new Entity()
        this.entity.addComponent(new Transform({
            position: new Vector3(13,2,13),
            scale: new Vector3 (1,1,1),
            rotation: new Quaternion().setEuler(0,-45,0)
        }))
        this.entity.addComponent(new GLTFShape("bullet.glb"))

        engine.addEntity(this.entity)
        log("bullet added")
        engine.addSystem(new BulletSystem(this.entity))
    } 
}

export class BulletSystem implements ISystem {
    private dt: any
    private entity: Entity
    private isBulletStarted = false

    constructor(entity: Entity) {
       this.dt = 0
       this.entity = entity
       log("bullet system init")
    }

    update(dt: number) {
        this.dt += dt
        let pos = this.entity.getComponent(Transform).position
        if(pos.x > 2 && pos.z > 2)
        this.entity.getComponent(Transform).position = new Vector3(pos.x-dt, pos.y, pos.z-dt)
        else engine.removeEntity(this.entity)
       
    }
}