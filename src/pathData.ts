@Component("pathData")
export class PathData {
  public path: Path3D
  constructor(path: Path3D) {
    this.path = path
    this.origin = this.path.path[0]
    this.target = this.path.path[1]
  }
  origin: Vector3 
  target: Vector3 
  fraction: number = 0
  nextPathIndex: number = 1
}


export class PatrolPath implements ISystem {
    private entity: Entity
    private path: Path3D
    private speed: number
    public constructor(entity: Entity, path: Path3D, speed: number)
    {
        this.entity = entity
        this.path = path
        this.speed = speed
    }
    update(dt: number) {
      let transform = this.entity.getComponent(Transform)
      let path = this.entity.getComponent(PathData)
      if (path.fraction < 1) {
        transform.position = Vector3.Lerp(path.origin, path.target, path.fraction)
        if(this.speed > 12) this.speed = 12
        path.fraction += (dt / 3) * (this.speed / 6)
      } else {
        path.nextPathIndex += 1
        if (path.nextPathIndex >= this.path.path.length) {
          path.nextPathIndex = 0
        }
        path.origin = path.target
        path.target = this.path.path[path.nextPathIndex]
        path.fraction = 0
      }
    }
  }