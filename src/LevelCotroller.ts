import {DroneFactory} from "./droneFactory"
import {Tools} from "./tools"
import {PlayerUI} from "./playerUI"
import * as ui from '../node_modules/@dcl/ui-utils/index'
import {BarStyles} from '../node_modules/@dcl/ui-utils/utils/types'

const camera = Camera.instance

export class LevelContoller {
    private currentLevel = 1
    private gameOver = false
    public factory: DroneFactory
    public playerUI: PlayerUI

    score = new ui.UICounter(0, -100, 100)
    scoreLabel = new ui.CornerLabel('Score:', -170, 100)

    health = new ui.UIBar(1, -30, 60, Color4.Red(), BarStyles.ROUNDSILVER, 1)
    healthLabel = new ui.CornerLabel('Health:', -170, 55)

    constructor() {
        this.playerUI = new PlayerUI(this)
        this.factory = new DroneFactory((e) => this.droneFactoryHandler(e))
    }

    private droneFactoryHandler(event: any) {
        log('LevelContoller', event.event)
        if (event.event == 'kill') {
            this.score.increase(event.drone.price)
        } else if (event.event == 'smashPlayer') {
            this.health.decrease(event.drone.attack)
            this.playerUI.damage()
            if (this.health.read() <= 0) {
                this.playerUI.kill()
                this.gameOver = true
            }
        }
    }

    public CheckFactory() {
        let count = 0
        this.factory.drones.forEach(drone => {
            if (drone.isLive)
                count++
        })
        if (count == 0 && !this.gameOver)
            this.nextLevel()
    }

    public nextLevel() {
        log("nextLevel")
        for (let i = 0; i < this.currentLevel; i++) {
            const points = []
            for (let j = 0; j < Tools.getRandomInt(3, 7 + (this.currentLevel * 2)); j++) {
                points[j] = new Vector3(Tools.getRandomInt(3, 29), Tools.getRandomInt(0, 12), Tools.getRandomInt(3, 29))
            }

            points.push(camera.position)
            const myPath = new Path3D(points)
            this.factory.Add(myPath, this.currentLevel)
        }
        this.currentLevel += 1
    }

    public reset() {
        this.health.set(1)
        this.score.set(0)
        this.currentLevel = 1
        this.factory.Reset()
        this.gameOver = false
        this.nextLevel()
    }
}

export class LevelSystem implements ISystem {
    private dt = 0
    private levelController: LevelContoller

    public constructor() {
        this.levelController = new LevelContoller()
    }

    update(dt: number) {
        this.dt += dt
        if (this.dt > 1) {
            this.levelController.CheckFactory()
            this.dt = 0
        }

        this.levelController.factory.updateDrones(dt)
        this.levelController.playerUI.update(dt)
    }
}
