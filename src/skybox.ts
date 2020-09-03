export class Skybox {
    constructor() {

        let skyboxEntity = new Entity()

        skyboxEntity.addComponent(new GLTFShape("skybox.glb"))
        skyboxEntity.addComponent(new Transform({
            position: new Vector3(8, -3, 8),
            scale: new Vector3(1.8, 1.8, 1.8)
        }))
        let animator = new Animator()
        skyboxEntity.addComponent(animator)
        const skyboxClip = new AnimationState("anim30")
        animator.addClip(skyboxClip)
        skyboxClip.playing = true
        skyboxClip.looping = false
        skyboxClip.speed = 0.1
        engine.addEntity(skyboxEntity)
    }

}