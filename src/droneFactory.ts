
const camera = Camera.instance
import { Drone } from "./drone"
import { Sword } from "./sword"
import { Player } from "./player"


export class DroneFactory {
    private sword: Sword
    public drones = []
    private player: Player
    constructor(sword: Sword, player: Player) {
        this.sword = sword
        this.player = player
        log(this.sword)

        let explosion = new Entity()
        explosion.addComponent(new Transform({
            position: new Vector3(16,16,16),
            scale: new Vector3(0.001, 0.001, 0.001)
        }))
        explosion.addComponent(new GLTFShape("bang.glb"))
        engine.addEntity(explosion)

    }

    public Add(path: Path3D, speed: number) {
        let drone = new Drone(path, speed, this.sword, this.player)
        this.drones.push(drone)
        engine.addEntity(drone.entity)
    }

    public Remove() {

    }
}