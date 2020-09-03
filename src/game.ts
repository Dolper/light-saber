import { Skybox } from "./skybox"
import { Tools } from "./tools"
import { LevelSystem } from "./LevelCotroller"
import { Sword } from "./sword"
import { DroneFactory } from "./droneFactory"
import utils from "../node_modules/decentraland-ecs-utils/index"
const camera = Camera.instance
let sb = new Skybox()



let pin = Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10) + "" + Tools.getRandomInt(0, 10)

let qrEntity = new Entity()
qrEntity.addComponent(new Transform({
  position: new Vector3(16, 0, 20),
  scale: new Vector3(3, 3, 3)
}))
qrEntity.addComponent(new GLTFShape("qr.glb"))

let pinEntity = new Entity()
pinEntity.addComponent(new Transform({
  position: new Vector3(16, 0.5, 19.9)
}))
const myText = new TextShape("PIN:" + pin)
myText.fontSize = 5
myText.color = Color3.White()
myText.font = new Font(Fonts.SanFrancisco)
pinEntity.addComponent(myText)

let sword = new Sword(qrEntity, pinEntity)

const socket = new WebSocket("wss://s.dapp-craft.com/scene/" + pin);

socket.onmessage = function (event) {
  try {
    var parsed = JSON.parse(event.data)
    log(parsed)
    const swordRotation = sword.entity.getComponent(Transform).rotation
    if (parsed.length == 4) {
      swordRotation.x = -parsed[0]
      swordRotation.y = parsed[1]
      swordRotation.z = parsed[2]
      swordRotation.w = parsed[3]
    }
  } catch (error) {
    log(error);
  }
};

engine.addSystem(new LevelSystem(sword))



/*

export class CollidingSystem implements ISystem {
  private entity: Entity
  private swordLight: Entity
  private triggerBox

  public constructor(entity: Entity, swordLight: Entity) {
    this.entity = entity
    this.swordLight = swordLight
    log("inited CollidingSystem")
  }
  update(dt: number) {

    // create trigger area object, setting size and relative position
    this.triggerBox = new utils.TriggerBoxShape(new Vector3(2,2,2), this.entity.getComponent(Transform).position)

    //create trigger for entity
    this.swordLight.addComponentOrReplace(
      new utils.TriggerComponent(
        this.triggerBox, //shape
        0, //layer
        0, //triggeredByLayer
        () => {
          //onCameraEnter
          log("triggered!")

        }, //onTriggerEnter
        null, //onTriggerExit
        null,
        null //onCameraExit
      )
    )

  }
}

engine.addSystem(new CollidingSystem(factory.drones[0].entity, sword.swordLight))
*/