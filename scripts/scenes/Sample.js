class SampleScene extends Phaser.Scene {
  constructor () {
    super({ key: 'SampleScene' })
  }

  preload () {
    this.load.image('groundL', '../../assets/images/groundL.png')
    this.load.image('groundR', '../../assets/images/groundR.png')
    this.load.image('ground', '../../assets/images/ground.png')
    this.load.spritesheet('doggowalk', '../../assets/sprites/dog/walk.png', { frameWidth: 547, frameHeight: 481 })
    this.load.spritesheet('doggoidle', '../../assets/sprites/dog/idle.png', { frameWidth: 547, frameHeight: 481 })
    this.load.spritesheet('doggojump', '../../assets/sprites/dog/jump.png', { frameWidth: 547, frameHeight: 481 })
  }

  create () {
    // this.cameras.main.setBackgroundColor(0xbababa)

    this.anims.create({
      key: 'doggowalk',
      frames: this.anims.generateFrameNumbers('doggowalk'),
      frameRate: 24,
      repeat: -1
    })
    this.anims.create({
      key: 'doggoidle',
      frames: this.anims.generateFrameNumbers('doggoidle'),
      frameRate: 24,
      repeat: -1
    })
    this.anims.create({
      key: 'doggojump',
      frames: this.anims.generateFrameNumbers('doggojump'),
      frameRate: 24,
      repeat: 1
    })

    // platforms
    const platforms = this.physics.add.staticGroup()
    // platforms.create(0, 300, 'ground').setOrigin(0,0).setScale(1).refreshBody()
    platforms.add(this.add.tileSprite(0, 500, 128, 93, 'groundL').setOrigin(0,0))
    platforms.add(this.add.tileSprite(128, 500, 768, 93, 'ground').setOrigin(0,0))
    platforms.add(this.add.tileSprite(896, 500, 128, 93, 'groundR').setOrigin(0,0))


    this.player = this.physics.add.sprite(0, 350, 'doggowalk')
    this.player.setCollideWorldBounds(true)
    this.player.setOrigin(0, 0)
    this.player.setScale(.25)
    this.player.anims.play('doggowalk', true)

    this.physics.add.collider(this.player, platforms)


    this.input.keyboard.on('keydown', e => {
      switch (e.key) {
        case '1': this.scene.start('Example1'); break
        case 'r': this.scene.start('SampleScene'); break
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update () {
    let animation = 'doggoidle'
    let isLooping = true

    // poll for arrow keys
    if (this.cursors) {
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160)
        this.player.flipX = true
        animation = 'doggowalk'
      }
      else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160)
        this.player.flipX = false
        animation = 'doggowalk'
      }
      else {
        this.player.setVelocityX(0)
        animation = 'doggoidle'
      }

      if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-530);
        // animation = 'doggojump'
      }
      if (this.cursors.up.isDown) {
        // animation = 'doggojump'
        // isLooping = false
      }
    }

    this.player.anims.play(animation, isLooping)
  }
}