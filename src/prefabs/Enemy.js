import { gameConstants } from 'constants'

class Enemy extends Phaser.GameObjects.Sprite {
  constructor (config) {
    const { scene, graphic, x, y, objects, players } = config
    super(scene)

    this.body = scene.physics.add.sprite(x, y, graphic)
    this.body.name = 'Kitty!'
    this.body.setScale(.25)
    this.body.flipX = true
    this.body.setData({
      isAlive: true
    })

    // add colliders to enemy character
    scene.physics.add.collider(this.body, objects, this.onCollision)
    scene.physics.add.overlap(this.body, players, this.onOverlap)

    this.isReversed = true // moves from right to left
  }

  onOverlap (obj1, obj2) {
    // console.log("overlapped..", obj1.data.list, obj1.getData('isAlive'), obj2.name)
    // console.log("overlapped..", obj2.body.touching.down)
  }

  onCollision (obj1, obj2) {
    // console.log("collided..", obj1.name, obj2.name)
  }

  update () {
    let isFlipped = false

    // moves between x=100 & x=500
    if (this.isReversed) {
      if (this.body.x < 100) {
        this.isReversed = false
      } else {
        this.body.x -= gameConstants.MOVEMENT_SPEED
        isFlipped = true
      }
    } else {
      if (this.body.x > 500) {
        this.isReversed = true
      } else {
        this.body.x += gameConstants.MOVEMENT_SPEED
      }
    }

    this.body.flipX = isFlipped
  }
}

export default Enemy