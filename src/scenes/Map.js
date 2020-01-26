import Player from 'prefabs/Player'
import Block from 'prefabs/Block'

import ground from 'assets/new/images/ground'
import crate from 'assets/new/images/crate'
import sign from 'assets/new/images/sign1'
import tree from 'assets/new/images/tree'
import doggowalk from 'assets/sprites/dog/walk'
import doggoidle from 'assets/sprites/dog/idle'

class Map extends Phaser.Scene {
  constructor () {
    super({ key: 'Map' })
  }

  preload () {
    this.loadImages()
  }

  create () {
    // initialize animations
    this.initAnimations()

    // keyboard listeners
    this.cursors = this.input.keyboard.createCursorKeys()

    // ground
    const ground = this.physics.add.staticGroup()
    ground.add(this.add.tileSprite(128, 128, 768, 384, 'ground').setOrigin(0,0))

    const staticProps = this.generateStaticProps()
    const passiveProps = this.generatePassiveProps()

    // test player
    this.initPlayer({
      staticProps,
      passiveProps
    })
  }

  update () {
    this.doggo.update({ cursors: this.cursors })
  }

  // images to be loaded during preload phase
  loadImages () {
    this.load.image('ground', ground)
    this.load.image('crate', crate)
    this.load.image('sign', sign)
    this.load.spritesheet('doggowalk', doggowalk, { frameWidth: 547, frameHeight: 481 })
    this.load.spritesheet('doggoidle', doggoidle, { frameWidth: 547, frameHeight: 481 })
  }

  // initialize animations to be used in game
  initAnimations () {
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
  }

  // immovable objects spread throughout the map
  // players CANNOT move / walk over them; they have to go around them
  generateStaticProps () {
    const staticProps = this.physics.add.staticGroup()
    new Block({
      scene: this,
      config: {
        name: 'World\'s Best Crate!',
        position: { x: 200, y: 300 },
        size: { x: 77, y: 77 },
        tile: 'crate',
      },
      parent: staticProps
    })
    return staticProps
  }

  // immovable objects spread throughout the map
  // players CAN walk over them
  generatePassiveProps () {
    const passiveProps = this.physics.add.staticGroup()
    new Block({
      scene: this,
      config: {
        name: 'World\'s Best Sign!',
        position: { x: 400, y: 300 },
        size: { x: 63, y: 64 },
        tile: 'sign',
      },
      parent: passiveProps
    })
    return passiveProps
  }

  initPlayer ({ staticProps, passiveProps }) {
    this.doggo = new Player({
      scene: this,
      config: {
        name: 'Doggo!',
        position: { x: 80, y: 300 },
        scale: .25
      },
      animations: {
        IDLE: 'doggoidle',
        WALK: 'doggowalk'
      },
      staticProps,
      passiveProps
    })
  }
}

export default Map