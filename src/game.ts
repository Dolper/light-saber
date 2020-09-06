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

let sword = new Sword()
const levelSystem = new LevelSystem()
const socket = new WebSocket("wss://s.dapp-craft.com/scene/" + pin);

levelSystem.showQR(pin)

socket.onmessage = function (event) {
    try {
        var parsed = JSON.parse(event.data)
        if (parsed.length == 4) {
            levelSystem.hideQR(false)
            let Q = new Quaternion(parsed[0], parsed[1], -parsed[2], -parsed[3])
            let E = Q.eulerAngles
            const QQ = Quaternion.Euler(E.x + 90, E.y, E.z)
            sword.swordRotation.x = QQ.x
            sword.swordRotation.y = QQ.y
            sword.swordRotation.z = QQ.z
            sword.swordRotation.w = QQ.w
        }
    } catch (error) {
        log(error);
    }
};



engine.addSystem(levelSystem)


