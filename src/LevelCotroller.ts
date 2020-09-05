
import { DroneFactory } from "./droneFactory"
import { Tools } from "./tools"
import { Sword } from "./sword"
import { Player } from "./player"
const camera = Camera.instance

export class LevelContoller {
    private currentLevel = 1
    private factory: DroneFactory
    private player: Player
    constructor(sword: any) {
        this.player = new Player()
        this.factory = new DroneFactory(sword, this.player)
    }

    public CheckFactory() {
        let count = 0
        this.factory.drones.forEach(drone => {
            if (drone.isLive)
                count++
        })
        if (count == 0)
            this.nextLevel()
    }

    public nextLevel() {
        log("nextLevel")
        for (let i = 0; i < this.currentLevel; i++) {
            const points = []
            for (let j = 0; j < Tools.getRandomInt(3, 7+(this.currentLevel*2)); j++) {
                points[j] = new Vector3(Tools.getRandomInt(3, 29), Tools.getRandomInt(0, 12), Tools.getRandomInt(3, 29))
            }

            points.push(camera.position)
            const myPath = new Path3D(points)
            this.factory.Add(myPath, this.currentLevel)
        }
        this.currentLevel += 1
    }
}


export class LevelSystem implements ISystem {
    private dt = 0
    private levelController: LevelContoller
    public constructor(sword: Sword) {
        this.levelController = new LevelContoller(sword)
    }
    update(dt: number) {
        this.dt += dt
        if(this.dt > 1)
        {
            this.levelController.CheckFactory()
        }
    }
}
