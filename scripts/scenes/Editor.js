const gameConstants = {
  MOVEMENT_SPEED: 2,
  SCREEN_OFFSET: 200
}

class Editor extends Phaser.Scene {
  constructor () {
    super({ key: 'Editor' })
  }

  preload () {
    // load images
    this.load.image('groundL', '../../assets/images/groundL.png')
    this.load.image('groundR', '../../assets/images/groundR.png')
    this.load.image('ground', '../../assets/images/ground.png')
    this.load.image('cat', '../../assets/images/cat.png')

    // load spritesheets
    this.load.spritesheet('doggowalk', '../../assets/sprites/dog/walk.png', { frameWidth: 547, frameHeight: 481 })
    this.load.spritesheet('doggoidle', '../../assets/sprites/dog/idle.png', { frameWidth: 547, frameHeight: 481 })
    this.load.spritesheet('doggojump', '../../assets/sprites/dog/jump.png', { frameWidth: 547, frameHeight: 481 })

    // load atlas
    this.load.atlas('sea', '../../assets/atlas/seacreatures.png', '../../assets/atlas/seacreatures.json');
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

    // dummy jellyfish; test subject for atlas; will be deleted later
    this.anims.create({
      key: 'jellyfish',
      frames: this.anims.generateFrameNames('sea', {
        prefix: 'greenJellyfish',
        end: 39,
        zeroPad: 4
      }),
      frameRate: 60,
      repeat: -1
    })
    this.jellyfish = this.physics.add.sprite(100, 100, '').play('jellyfish')
    this.jellyfish.body.setAllowGravity(false)
    this.jellyfish.setSize(100, 100).setOrigin(0, 0)
    this.jellyfish.setCircle(50)

    // platforms
    const platforms = this.physics.add.staticGroup()
    platforms.add(this.add.tileSprite(0, 512, 128, 128, 'groundL').setOrigin(0,0))
    platforms.add(this.add.tileSprite(128, 512, 768, 128, 'ground').setOrigin(0,0))
    platforms.add(this.add.tileSprite(896, 512, 128, 128, 'groundR').setOrigin(0,0))

    this.player = new Player({
      scene: this,
      config: {
        name: 'Poopy',
        position: { x: 300, y: 300 }
      },
      animations: {
        IDLE: 'doggoidle',
        WALK: 'doggowalk',
        JUMP: 'doggojump'
      },
      objects: [platforms]
    })

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
    // run 'update' method of 'player'
    this.player.update({ cursors: this.cursors })

    // camera follows player when it has moved by at least "SCREEN_OFFSET" px
    this.cameras.main.scrollX = Math.max(this.player.body.x - gameConstants.SCREEN_OFFSET, 0)

    // run 'update' method of 'enemy'
    this.enemy.update()
  }
}