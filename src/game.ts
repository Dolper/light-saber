import { Skybox } from "./skybox"
import { Tools } from "./tools"
import { LevelSystem } from "./LevelCotroller"
import { Sword } from "./sword"
import utils from "../node_modules/decentraland-ecs-utils/index"
const camera = Camera.instance
let sb = new Skybox()


let d = Tools.getRandomInt(0, 10)
let pin = Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10) + "" + d + "" + d
// pin='0003'

let sword = new Sword(pin)

const socket = new WebSocket("wss://s.dapp-craft.com/scene/" + pin);

socket.onmessage = function (event) {
  try {
    var parsed = JSON.parse(event.data)
    log(parsed)
    const swordRotation = sword.entity.getComponent(Transform).rotation
    if (parsed.length == 4) {
    let Q = new Quaternion(parsed[0],parsed[1],-parsed[2],-parsed[3])
    let E = Q.eulerAngles
    let Q2 = Quaternion.Euler(E.x+90, E.y, E.z)
  
    sword.entity.getComponent(Transform).rotation = Q2
    }

  } catch (error) {
    log(error);
  }
};

engine.addSystem(new LevelSystem())


