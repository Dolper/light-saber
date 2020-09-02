import { Gun } from "./gun"

export class Tools {
  public static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

}

export class SaberSystem implements ISystem {

  private dt = 0
  private dtLight = 0
  private timer = 0
  private swordBase: Entity
  private sword: Entity
  private swordLight: Entity
  private isStarted = false
  private isPlaying = false
  private isFastPlaying = false
  private isCanStart = false
  private isFirstFast = true
  private clipStart: AudioClip
  private clipSlow: AudioClip
  private clipsFast

  private sourceStart: AudioSource
  private sourceSlow: AudioSource
  private sourcesFast
  private lastX = 0
  private lastY = 0

  constructor(sword: Entity, swordBase: Entity, swordLight: Entity) {
    log("Saber system init")
    this.swordBase = swordBase
    this.swordLight = swordLight
    this.sword = sword

    this.sourcesFast = []
    this.clipsFast = []

    this.clipStart = new AudioClip("sfxStart.mp3")
    this.sourceStart = new AudioSource(this.clipStart)

    this.clipSlow = new AudioClip("sfxSlow.mp3")
    this.sourceSlow = new AudioSource(this.clipSlow)

    this.clipsFast[0] = new AudioClip("sfxFast1.mp3")
    this.sourcesFast[0] = new AudioSource(this.clipsFast[0])

    this.clipsFast[1] = new AudioClip("sfxFast2.mp3")
    this.sourcesFast[1] = new AudioSource(this.clipsFast[1])

    this.clipsFast[2] = new AudioClip("sfxFast3.mp3")
    this.sourcesFast[2] = new AudioSource(this.clipsFast[2])

  }

  update(dt: number) {
    this.dt += dt
this.timer += dt

if(this.isCanStart)
{
  log(this.isCanStart)
  if (this.swordLight.getComponent(Transform).scale.y <= 1)
      this.swordLight.getComponent(Transform).scale.y += dt * 2
      else this.isCanStart = false
}

    if (this.dt > 3) {
      if (!this.isStarted && this.isCanStart) {
        
        let sx = Math.round(this.sword.getComponent(Transform).rotation.x * 100) / 100
          this.isCanStart = true
          this.sourceStart.playing = true
          this.sourceStart.loop = false

          log("play once")
          this.swordBase.addComponentOrReplace(this.sourceStart)
          this.isStarted = true
      }
    }
    if (this.dt > 4.5) {


      if (!this.isPlaying) {
        this.sourceSlow.playing = true
        this.sourceSlow.loop = true
        this.sourceSlow.volume = 1

        log("playing")
        this.swordLight.addComponent(this.sourceSlow)
        this.isPlaying = true
      }
    }


    let x = Math.abs(this.sword.getComponent(Transform).rotation.x)
    let y = Math.abs(this.sword.getComponent(Transform).rotation.y)
    //log(x)
    //log(this.lastX)
    //log("-----")

    //log("X: ", x)
    //log("LastX: ", this.lastX)
    //log(x - (this.lastX))
    if (this.dt > 3.2 &&
      ((x > this.lastX + 0.1 || x < this.lastX - 0.1) || (y > this.lastY + 0.1 || y < this.lastY - 0.1)) &&
      !this.isFastPlaying) {
      let rnd = Tools.getRandomInt(0, 3)
      this.sourcesFast[rnd].playOnce()


      log("playing FAST:", rnd)
      //  if(this.isFirstFast)
      // {
      this.swordBase.addComponentOrReplace(this.sourcesFast[rnd])
      //  this.isFirstFast = false
      //  }
      this.isFastPlaying = true

    }


    if (this.timer > 0.5) {

      if(this.lastX != x && this.dt > 3)
      this.isCanStart = true

      this.timer = 0
      this.lastX = x
      this.lastY = y
      this.isFastPlaying = false
    }
  }
}








let box = new Entity()
box.addComponent(new Transform({
  position: new Vector3(8, 0, 8),
  scale: new Vector3(16, 20, 16)
}))
box.addComponent(new GLTFShape("box.glb"))
engine.addEntity(box)


let sword = new Entity()
sword.addComponent(new Transform({
  position: new Vector3(8, 1.5, 8),
  scale: new Vector3(2, 2, 2)
}))

let swordBase = new Entity()
swordBase.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  scale: new Vector3(1, 1, 1)
}))
swordBase.addComponent(new GLTFShape("swordBase.glb"))
swordBase.addComponent(
  new OnPointerDown(() => {
    engine.addEntity(qr)
    engine.addEntity(pinEntity)
    sword.getComponent(Transform).position = new Vector3(0.5, 0.5, 1)
    sword.getComponent(Transform).scale = new Vector3(1, 1, 1)
    sword.setParent(Attachable.PLAYER)
  },
      {
          button: ActionButton.PRIMARY,
          showFeedback: true,
          hoverText: "TAKE ME",
          distance: 8,
      })
)

let swordLight = new Entity()
swordLight.addComponent(new Transform({
  position: new Vector3(0, 0, 0),
  scale: new Vector3(1, 0.02, 1)
}))
swordLight.addComponent(new GLTFShape("swordLight.glb"))

/*let canvas = new UICanvas()

        let uiImageD = new UIImage(this.canvas, new Texture("textures/access-a.png"))
        uiImageD.name = "clickable-image"
        uiImageD.width = "500"
        uiImageD.height = "70"
        uiImageD.sourceWidth = 978
        uiImageD.sourceHeight = 137
        uiImageD.positionY = 10
        uiImageD.vAlign = "bottom"
        uiImageD.visible = true*/

let pin = Tools.getRandomInt(0,10) + "" + Tools.getRandomInt(0,10) + "" + Tools.getRandomInt(0,10) + "" + Tools.getRandomInt(0,10)

let qr = new Entity()
qr.addComponent(new Transform({
  position: new Vector3(8, 0, 15),
  scale: new Vector3(3, 3, 3)
}))
qr.addComponent(new GLTFShape("qr.glb"))


let pinEntity = new Entity()
pinEntity.addComponent(new Transform({
  position: new Vector3(8, 0.5, 14.9)
}))
const myText = new TextShape("PIN:"+pin)
myText.fontSize = 5
myText.color = Color3.White()
myText.font = new Font(Fonts.SanFrancisco)
pinEntity.addComponent(myText)


engine.addSystem(new SaberSystem(sword, swordBase, swordLight))



const socket = new WebSocket("wss://s.dapp-craft.com/"+pin);

socket.onmessage = function (event) {
  try {
    //log("data: " + event.data)
    var parsed = JSON.parse(event.data)
    if (parsed.x != null && parsed.y != null && parsed.z != null)
      sword.getComponent(Transform).rotation.setEuler(-(parsed.x - 80), -parsed.y, parsed.z)
  } catch (error) {
    log(error);
  }
};
//new Gun()
swordBase.setParent(sword)
swordLight.setParent(sword)

engine.addEntity(sword)

//entity.setParent(Attachable.AVATAR_POSITION)


