
const camera = Camera.instance
import { Drone } from "./drone"


export class DroneFactory {
    public drones = []
    constructor() {

    }

    public Add(path: Path3D) {
        let drone = new Drone(path)
        this.drones.push(drone)
        engine.addEntity(drone.entity)
    }

    public Remove() {

    }
}