class Player extends Phaser.GameObjects.Sprite {
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

    // private methods
    this._scene = scene

    this.animations = animations

    this.body = scene.physics.add.sprite(posX, posY)
    this.body.name = name

    this.body.setOrigin(0, 0)
    // this.body.setScale(.25) // size of gameobject
    // this.body.setSize(270, 460) // size of hitbox
    this.body.setSize(30, 112) // size of hitbox
    this.body.setOffset(30, 0) // location of hitbox

    this.body.flipX = isFlipped
    this.body.setData({
      isAlive: true
    })

    // add colliders to player character
    scene.physics.add.collider(this.body, objects, this.onCollision)

    // this.isReversed = isFlipped // if true, flip horizontally (i.e., faces towards left in most cases)

    this.isAttacking = false // toggles to true in the midst of performing an attack
    this.isJumping = false // toggles to true when in air during jump
  }

  onCollision (obj1, obj2) {
    // console.log("collided..", obj1.name, obj2.name)
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
    let isJumping = this.isJumping

    if (this.body.body.onFloor()) {
      isJumping = false
    }

    // poll for arrow keys
    if (cursors) {
      if (cursors.left.isDown) {
        this.body.flipX = true
        // this.body.setOffset(160, 10)
        this.body.setOffset(67, 0)

        // walk left if inside game world
        if (this.body.x > 0) {
          animation = this.animations.WALK
          this.body.x -= gameConstants.MOVEMENT_SPEED
        }
      } else if (cursors.right.isDown) {
        this.body.flipX = false
        // this.body.setOffset(120, 10)
        this.body.setOffset(30, 0)
        if (!this.body.body.onWall()) {
          animation = this.animations.WALK
        }
        this.body.x += gameConstants.MOVEMENT_SPEED
      }


      // jump animation on pressing UP (and when player is on the "ground")
      if (cursors.up.isDown && this.body.body.onFloor()) {
        this.body.setVelocityY(-500)
        isJumping = true
      }
    }

    this.isJumping = isJumping
    if (this.isJumping) {
      animation = this.animations.JUMP
      isLooping = false
    }


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