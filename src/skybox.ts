export class Skybox {
    constructor() {


        let light = new Entity()

        light.addComponent(new GLTFShape("light.glb"))
        light.addComponent(new Transform({
            position: new Vector3(16, 0.1, 16),
            scale: new Vector3(1, 2, 1)
        }))

        engine.addEntity(light)


        let skyboxEntity = new Entity()

        skyboxEntity.addComponent(new GLTFShape("skybox.glb"))
        skyboxEntity.addComponent(new Transform({
            position: new Vector3(16, -3, 16),
            scale: new Vector3(0.5, 1, 0.5)
        }))
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

}