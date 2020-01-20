// class Player extends Phaser.GameObjects.Sprite {
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor (config) {
    super(config.scene)

    this.initialize(config)
  }

  initialize ({ scene, graphic, objects, config, animations }) {
    const {
      name,
      position: {
        x: posX = 0,
        y: posY = 0
      } = {},
      isFlipped = false
    } = config

    this.animations = animations

    this.body = scene.physics.add.sprite(posX, posY)
    this.body.name = name

    this.body.setOrigin(0, 0)
    this.body.setScale(.25) // size of gameobject
    this.body.setSize(270, 460) // size of hitbox
    this.body.setOffset(120, 10) // location of hitbox

    this.body.flipX = isFlipped
    this.body.setData({
      isAlive: true
    })

    // add colliders to player character
    scene.physics.add.collider(this.body, objects, this.onCollision)

    // this.isReversed = isFlipped // if true, flip horizontally (i.e., faces towards left in most cases)
  }

  onCollision (obj1, obj2) {
    // console.log("collided..", obj1.name, obj2.name)
  }

  checkInputAndMove (cursors) {
    let animation = this.animations.IDLE // idle animation by default
    let isLooping = true // whether to loop animation infinitely, or just run it once

    // poll for arrow keys
    if (cursors) {
      if (cursors.left.isDown) {
        this.body.flipX = true
        this.body.setOffset(160, 10)

        // walk left if inside game world
        if (this.body.x > 0) {
          animation = this.animations.WALK
          this.body.x -= gameConstants.MOVEMENT_SPEED
        }
      }
      else if (cursors.right.isDown) {
        this.body.flipX = false
        this.body.setOffset(120, 10)
        if (!this.body.body.onWall()) {
          animation = this.animations.WALK
        }
        this.body.x += gameConstants.MOVEMENT_SPEED
      }

      // jump animation on pressing UP (and when player is on the "ground")
      if (cursors.up.isDown && this.body.body.onFloor()) {
        this.body.setVelocityY(-750);
        // animation = 'doggojump'
      }
    }

    this.body.anims.play(animation, isLooping)
  }

  update ({ cursors }) {
    this.checkInputAndMove(cursors)
  }
}