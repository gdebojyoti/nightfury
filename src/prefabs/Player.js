import Bullet from 'prefabs/Bullet'
import { gameConstants } from 'constants'

class Player extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene)

    this.initialize(config)
  }

  initialize ({ scene, staticProps, passiveProps, config, animations }) {
    const {
      name,
      position: {
        x: posX = 0,
        y: posY = 0
      } = {},
      scale = 1,
      isFlipped = false
    } = config

    // private methods
    this._scene = scene

    this.animations = animations

    this.body = scene.physics.add.sprite(posX, posY)
    this.body.name = name

    this.body.setOrigin(0, 0)
    this.body.setScale(scale) // size of gameobject
    this.body.setSize(270, 460) // size of hitbox
    // this.body.setSize(128, 128) // size of hitbox
    this.body.setOffset(67, 0) // location of hitbox

    this.body.flipX = isFlipped
    this.body.setData({
      isAlive: true
    })

    // add colliders to player character
    scene.physics.add.collider(this.body, staticProps, this.onCollision)
    scene.physics.add.overlap(this.body, passiveProps, this.onOverlap)

    // this.isReversed = isFlipped // if true, flip horizontally (i.e., faces towards left in most cases)

    this.isAttacking = false // toggles to true in the midst of performing an attack
  }

  onCollision (obj1, obj2) {
    console.log("collided..", obj1.name, obj2.name)
  }

  onOverlap (obj1, obj2) {
    console.log("overlapped..", obj1.name, obj2.name)
  }

  onKeyDown (e) {
    switch (e.key) {
      case 'a': {
        if (this.isAttacking) {
          return
        }
        this.isAttacking = true
        this.body.anims.play(this.animations.ATTACK)
        this.fireWeapon()
        this.body.once('animationcomplete', () => {
          this.isAttacking = false
        })
        break
      }
    }
  }

  fireWeapon () {
    new Bullet({
      scene: this._scene,
      position: {
        x: this.body.x,
        y: this.body.y
      },
      isFlipped: this.body.flipX,
      animation: this.animations.FIRE
    })
  }

  // handle movement & jumping
  checkInputAndMove (cursors) {
    let animation = this.animations.IDLE // idle animation by default
    let isLooping = true // whether to loop animation infinitely, or just run it once
    let velocityX = 0
    let velocityY = 0

    // poll for arrow keys
    if (cursors) {
      if (cursors.left.isDown) {
        this.body.flipX = true
        // // this.body.setOffset(160, 10)
        // this.body.setOffset(67, 0)

        // allow player to walk left only if inside game world
        if (this.body.x > 0) {
          animation = this.animations.WALK
          velocityX = -gameConstants.MOVEMENT_SPEED
        }
      } else if (cursors.right.isDown) {
        this.body.flipX = false
        // // this.body.setOffset(120, 10)
        // this.body.setOffset(30, 0)
        if (!this.body.body.onWall()) {
          animation = this.animations.WALK
        }
        velocityX = gameConstants.MOVEMENT_SPEED
      } else if (cursors.up.isDown) {
        this.body.flipX = true
        if (!this.body.body.onWall()) {
          animation = this.animations.WALK
        }
        velocityY = -gameConstants.MOVEMENT_SPEED
      } else if (cursors.down.isDown) {
        this.body.flipX = false
        if (!this.body.body.onWall()) {
          animation = this.animations.WALK
        }
        velocityY = gameConstants.MOVEMENT_SPEED
      }
    }

    // update player's velocity
    this.body.setVelocityX(velocityX)
    this.body.setVelocityY(velocityY)

    // no movement animation during attack
    if (this.isAttacking) {
      return
    }
    this.body.anims.play(animation, isLooping)
  }

  update ({ cursors }) {
    this.checkInputAndMove(cursors)
  }
}

export default Player