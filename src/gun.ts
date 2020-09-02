import { Bullet } from "./bullet"

export class Gun {
    private entity: Entity
    constructor() {
        this.entity = new Entity()
        this.entity.addComponent(new Transform({
            position: new Vector3(13,0,13),
            scale: new Vector3 (5,5,5),
            rotation: new Quaternion().setEuler(0,180,0)
        }))
        this.entity.addComponent(new GLTFShape("clone.glb"))

        engine.addEntity(this.entity)
        log("gun added")
        engine.addSystem(new ShootSystem())
    }
}

export class ShootSystem implements ISystem {
    private lastShoot: any


    constructor() {
       this.lastShoot = 0
       log("shoot system init")
    }

    update(dt: number) {
        this.lastShoot += dt
        //log(this.lastShoot)
        if(this.lastShoot > 3)
        {
            this.lastShoot = 0
            log("shoot")
            new Bullet()
        }
    }
}