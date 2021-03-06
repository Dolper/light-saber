import {DroneFactory} from "./droneFactory"
import {Tools} from "./tools"
import {PlayerUI} from "./playerUI"
import * as ui from '../node_modules/@dcl/ui-utils/index'
import {BarStyles} from '../node_modules/@dcl/ui-utils/utils/types'
import {Skybox} from "./skybox";

const camera = Camera.instance

export class LevelContoller {
    private gameOver = false
    public factory: DroneFactory
    public playerUI: PlayerUI
    public skyBox:Skybox=null

    level = new ui.UICounter(0, -100, 150)
    levelLabel = new ui.CornerLabel('Level:', -170, 150)

    score = new ui.UICounter(0, -100, 100)
    scoreLabel = new ui.CornerLabel('Score:', -170, 100)

    health = new ui.UIBar(1, -30, 60, Color4.Red(), BarStyles.ROUNDSILVER, 1)
    healthLabel = new ui.CornerLabel('Health:', -170, 55)
    changeHandsHandeler: () => void;
    pistolKillHandeler: () => void;

    private gameStarted = false
    serverSendHandler: (data) => void;

    droneKills = 0

    constructor() {
        this.playerUI = new PlayerUI(this)
        this.factory = new DroneFactory((e) => this.droneFactoryHandler(e))
    }

    private droneFactoryHandler(event: any) {
        if (!this.gameOver) {
            log('LevelContoller', event.event)
            if (event.event == 'kill') {
                this.droneKills += 1
                let addScore = 10
                if (event.weapon == 'sword') {
                    addScore = 25
                }
                if (event.weapon == 'pistol') {
                    this.pistolKillHandeler()
                }
                this.score.increase(addScore)
            } else if (event.event == 'smashPlayer') {
                this.health.decrease(event.drone.attack)
                this.playerUI.damage()
                if (this.health.read() <= 0) {
                    this.playerUI.kill()
                    this.gameOver = true
                    if (this.skyBox != null) {
                        this.skyBox.setBounds(false)
                    }
                    this.serverSendHandler({
                        type: 'score',
                        level: this.level.read(),
                        score: this.score.read(),
                        kills: this.droneKills
                    })
                }

            }
        }
    }

    public CheckFactory() {
        if (this.gameStarted) {
            let count = 0
            this.factory.drones.forEach(drone => {
                if (drone.isLive)
                    count++
            })
            if (count == 0 && !this.gameOver)
                this.nextLevel()
        }
    }

    public nextLevel() {
        log("nextLevel")
        this.level.increase(1)
        let currentLevel = this.level.read()
        
        let height = 0
        if(currentLevel>10) height = 10
        else height = currentLevel

        for (let i = 0; i < currentLevel; i++) {
            const points = []
            points[0] = new Vector3(16, 30, 16)
            for (let j = 1; j < Tools.getRandomInt(3, 7 + (currentLevel * 2)); j++) {
                points[j] = new Vector3(Tools.getRandomInt(5, 27), Tools.getRandomInt(0, 6+height), Tools.getRandomInt(5, 27))
            }
            points.push(new Vector3(Tools.getRandomInt(7, 25), Tools.getRandomInt(0, 7), Tools.getRandomInt(7, 25)))
            points.push(camera.position)
            const myPath = new Path3D(points)
            this.factory.Add(myPath, currentLevel)
        }
    }

    public startGame() {
        this.gameStarted = true
        if (this.skyBox != null) {
            this.skyBox.setLight(false)
        }
    }

    public reset() {
        this.health.set(1)
        this.score.set(0)
        this.level.set(0)
        this.factory.Reset()
        this.gameOver = false
        this.droneKills = 0
        this.nextLevel()
        if (this.skyBox != null) {
            this.skyBox.setBounds(true)
        }

    }

    public changeHands() {
        this.changeHandsHandeler()
    }

    public addShootComponent() {
        this.factory.needAddShootComponent = true
        this.factory.drones.forEach(value => {
            value.addShootComponent()
        })
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

    public hideQR(visible:boolean) {
        this.levelController.playerUI.hideQR(visible)
    }
    public showQR(pin:string) {
        this.levelController.playerUI.showQR(pin)
    }

    setChangeHandsHandeler(param: () => void) {
        this.levelController.changeHandsHandeler = param
    }

    public addShootComponent() {
        this.levelController.addShootComponent()
    }

    public startGame() {
        this.levelController.startGame()
    }

    public setSkyBox(skyBox:Skybox) {
        this.levelController.skyBox = skyBox
    }

    setPistolKillHandeler(param: () => void) {
        this.levelController.pistolKillHandeler = param
    }

    setServerSendHandler(param: (data) => void) {
        this.levelController.serverSendHandler = param

    }

    showHighscore(scoreTable: any) {
        this.levelController.playerUI.showHighscore(scoreTable)
    }
}
