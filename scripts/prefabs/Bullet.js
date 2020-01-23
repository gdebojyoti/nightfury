// prefab class for bullet, arrow, etc
// TODO: find a better name

const SPEED = 400

class Bullet extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene)

    this.initialize(config)
  }

  initialize (config) {
    const {
      scene,
      position: {
        x: posX = 0,
        y: posY = 0
      } = {},
      isFlipped,
      animation
    } = config

    this.body = scene.physics.add.sprite(posX, posY)
    this.body.setOrigin(0, 0)
    this.body.setSize(35, 40) // size of hitbox
    this.body.setOffset(45, 52) // location of hitbox
    this.body.body.setAllowGravity(false)

    this.body.flipX = isFlipped

    this.body.anims.play(animation)
    this.body.once('animationcomplete', () => {
      this.body.destroy()
    })

    this.body.setVelocityX(isFlipped ? -SPEED : SPEED)
  }
}