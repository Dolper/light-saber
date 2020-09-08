export class Skybox {
    private collider: Entity;
    private light: Entity;

    constructor() {
        this.light = new Entity()
        this.light.addComponent(new GLTFShape("models/light.glb"))
        this.light.addComponent(new Transform({
            position: new Vector3(16, 0.1, 16),
            scale: new Vector3(1, 2, 1)
        }))
        this.light.getComponent(GLTFShape).isPointerBlocker = false
        engine.addEntity(this.light)

        this.collider = new Entity()
        this.collider.addComponent(new GLTFShape("models/collider.glb"))
        this.collider.addComponent(new Transform({
            position: new Vector3(16, 0, 16),
            scale: new Vector3(2, 2, 2)
        }))
        this.collider.getComponent(GLTFShape).isPointerBlocker = false
        engine.addEntity(this.collider)


        let logo = new Entity() // Billoard 
        logo.addComponent(new GLTFShape("models/logo.glb"))
        logo.addComponent(
            new Transform({
                position: new Vector3(16, 16, 16),
                scale: new Vector3(1, 1, 1),
                rotation: new Quaternion(0, 0, 0)
            })
        )
        logo.addComponent(new Billboard())
        engine.addEntity(logo)

        let skyboxEntity = new Entity()
        skyboxEntity.addComponent(new GLTFShape("models/skybox.glb"))
        skyboxEntity.addComponent(new Transform({
            position: new Vector3(16, -3, 16),
            scale: new Vector3(0.5, 1, 0.5)
        }))
        skyboxEntity.getComponent(GLTFShape).isPointerBlocker = false
        let animator = new Animator()
        skyboxEntity.addComponent(animator)
        const skyboxClip = new AnimationState("anim30")
        animator.addClip(skyboxClip)
        skyboxClip.playing = true
        skyboxClip.looping = false
        skyboxClip.speed = 0.1
        engine.addEntity(skyboxEntity)


        let floor = new Entity() // пол
        floor.addComponent(new PlaneShape())
        floor.addComponent(
            new Transform({
                position: new Vector3(16, 0, 16),
                scale: new Vector3(32, 32, 0),
                rotation: new Quaternion(1, 0, 0)
            })
        )
        var mat = new Material()
        mat.roughness = 1
        mat.metallic = 0
        mat.albedoColor = Color3.Black()
        floor.addComponent(mat)
        engine.addEntity(floor)
    }

    public setBounds(value) {
        if (value) {
            engine.addEntity(this.collider)
        } else {
            engine.removeEntity(this.collider)
        }
    }
    public setLight(value) {
        this.light.getComponent(GLTFShape).visible=value
    }

}