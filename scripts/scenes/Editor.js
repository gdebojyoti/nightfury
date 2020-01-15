const constants = {
  MOVEMENT_SPEED: 2,
  SCREEN_OFFSET: 200
}

class Editor extends Phaser.Scene {
  constructor () {
    super({ key: 'Editor' })
  }

  preload () {
    this.load.image('groundL', '../../assets/images/groundL.png')
    this.load.image('groundR', '../../assets/images/groundR.png')
    this.load.image('ground', '../../assets/images/ground.png')
    this.load.image('cat', '../../assets/images/cat.png')
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
      frameRate: 8,
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
    platforms.add(this.add.tileSprite(0, 512, 128, 128, 'groundL').setOrigin(0,0))
    platforms.add(this.add.tileSprite(128, 512, 768, 128, 'ground').setOrigin(0,0))
    platforms.add(this.add.tileSprite(896, 512, 128, 128, 'groundR').setOrigin(0,0))


    this.player = this.physics.add.sprite(0, 350, 'doggowalk')
    this.player.name = 'Doggo!'
    // this.player.setCollideWorldBounds(true) // make player stay inside canvas boundary
    this.player.setOrigin(0, 0)
    this.player.setScale(.25)
    // this.player.setTint(0x00ff00)
    this.player.anims.play('doggowalk', true)

    this.physics.add.collider(this.player, platforms)


    this.input.keyboard.on('keydown', e => {
      switch (e.key) {
        case '2': this.scene.start('Play'); break
        case 'r': this.scene.start('Editor'); break
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()

    // create and add enemy character to scene
    this.enemy = new Enemy({
      scene: this,
      graphic: 'cat',
      x: 420,
      y: 350,
      objects: [platforms],
      players: [this.player]
    })
  }

  update () {
    let animation = 'doggoidle' // idle animation by default
    let isLooping = true // whether to loop animation infinitely, or just run it once

    // poll for arrow keys
    if (this.cursors) {
      if (this.cursors.left.isDown) {
        this.player.flipX = true

        // walk left if inside game world
        if (this.player.x > 0) {
          animation = 'doggowalk'
          this.player.x -= constants.MOVEMENT_SPEED
        }
      }
      else if (this.cursors.right.isDown) {
        this.player.flipX = false
        if (!this.player.body.onWall()) {
          animation = 'doggowalk'
        }
        this.player.x += constants.MOVEMENT_SPEED
      }

      // jump animation on pressing UP (and when player is on the "ground")
      if (this.cursors.up.isDown && this.player.body.onFloor()) {
        this.player.setVelocityY(-530);
        // animation = 'doggojump'
      }
    }

    this.player.anims.play(animation, isLooping)

    // camera follows player when it has moved by at least "SCREEN_OFFSET" px
    this.cameras.main.scrollX = Math.max(this.player.x - constants.SCREEN_OFFSET, 0)

    this.enemy.update()
  }
}