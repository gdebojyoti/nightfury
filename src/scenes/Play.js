import logo from 'assets/images/logo'

class Play extends Phaser.Scene {
  constructor () {
    super({ key: 'Play' })
  }

  preload () {
    this.load.image('meow', logo)
  }

  create () {
    this.image = this.add.image(191, 165, 'meow')
    this.image.setScale(.5)

    this.text = this.add.text(0,0, 'I got in!', { font: '100px arial' })

    this.input.keyboard.on('keydown_D', () => {
      this.image.x++;
    })

    this.input.on('pointerdown', e => {
      this.image.x = e.x
      this.image.y = e.y
    })

    this.input.keyboard.on('keydown_P', () => {
      const physicsImage = this.physics.add.image(this.image.x, this.image.y, 'meow')
      physicsImage.setScale(.5)
      physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100, 100), -300)
    })

    const tween = this.tweens.add({
      targets: [this.text],
      x: 200,
      y: 200,
      duration: 1000,
      ease: 'Elastic',
      easeParams: [1.5, .5],
      delay: 1500,
      onComplete: (src, target) => {
        target[0].x = 0
        target[0].y = 0
        target[0].setColor('#ff00ff22')
      }
    })
  }
}

export default Play