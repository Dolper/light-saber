import {Drone} from "./drone"

export class DroneFactory {
    public drones: Drone[] = []
    private explosions = []
    private levelHandler
    private explosionShape = new GLTFShape("bang.glb")

    constructor(levelHandler) {
        this.levelHandler = levelHandler
    }

    private droneHandler(event: any) {
        log('DroneFactory', event.event, event.pos)
        if (event.event == 'kill' || event.event == 'smashPlayer') {
            const explosion = new Entity()
            explosion.addComponent(this.explosionShape)
            explosion.addComponent(new Transform({
                position: event.pos,
                scale: new Vector3(0.02, 0.02, 0.02)
            }))
            engine.addEntity(explosion)
            this.explosions.push({dt: 0, explosion: explosion, drone: event.drone})
        }
        this.levelHandler(event)
    }

    public Add(path: Path3D, speed: number) {
        let drone = new Drone(path, speed, (event) => this.droneHandler(event))
        this.drones.push(drone)
        this.levelHandler({
            event: 'new',
            drone: drone
        })
        return drone
    }

    public Reset() {
        this.drones.forEach(dron => {
            engine.removeEntity(dron)
        });
    }

    public updateDrones(dt) {
        for (let i = 0; i < this.explosions.length; i++) {
            const ex = this.explosions[i]
            ex.dt += dt
            if (ex.dt > 3 && ex.explosion != null) {
                engine.removeEntity(ex.explosion)
                ex.explosion = null
                this.explosions.splice(i, 1);
                log('remove explosion')
                break;
            }
            if (ex.dt > 1 && ex.drone != null) {
                engine.removeEntity(ex.drone)
                log('remove drone')
                ex.drone = null
            }
        }
    }
}
