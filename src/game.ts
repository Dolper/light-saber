import {Skybox} from "./skybox"
import {Tools} from "./tools"
import {LevelSystem} from "./LevelCotroller"
import {Sword} from "./sword"
import utils from "../node_modules/decentraland-ecs-utils/index"

const camera = Camera.instance
let sb = new Skybox()

let d = Tools.getRandomInt(0, 10)
let pin = Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10) + "" + d + "" + d
// pin='0002'

const levelSystem = new LevelSystem()
levelSystem.setSkyBox(sb)
let sword = new Sword((type)=>{
    if(type == 'sword') {
        levelSystem.showQR(pin)
    } else if (type == 'pistol') {
        levelSystem.addShootComponent()
        levelSystem.startGame()
    }
})
levelSystem.setChangeHandsHandeler(()=>{
    sword.changeHands()
})
const socket = new WebSocket("wss://s.dapp-craft.com/scene/" + pin);



socket.onmessage = function (event) {
    try {
        const msg = JSON.parse(event.data)
        if (msg.type == 'rotate') {
            levelSystem.hideQR(false)
            levelSystem.startGame()
            const Q = new Quaternion(msg.quat[0], msg.quat[1], -msg.quat[2], -msg.quat[3])
            const QQ = Quaternion.Euler(Q.eulerAngles.x + 90, Q.eulerAngles.y, Q.eulerAngles.z)
            sword.swordRotation.x = QQ.x
            sword.swordRotation.y = QQ.y
            sword.swordRotation.z = QQ.z
            sword.swordRotation.w = QQ.w    
        } else if (msg.type == 'cmd') {
            if (msg.cmd == 'on') {
                sword.switch()
            }
        }
    } catch (error) {
        log(error);
    }
};

engine.addSystem(levelSystem)


