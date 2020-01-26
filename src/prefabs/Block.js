// prefab class for crate, sign, tree, fence, etc

class Block extends Phaser.GameObjects.Sprite {
  constructor (config) {
    super(config.scene)

    this.initialize(config)
  }

  initialize ({scene, config, parent}) {
    const {
      name,
      position: {
        x: posX = 0,
        y: posY = 0
      } = {},
      size: {
        x: sizeX = 0,
        y: sizeY = 0
      } = {},
      tile
    } = config

    this.body = scene.add.tileSprite(posX, posY, sizeX, sizeY, tile).setOrigin(0,0)
    this.body.name = name

    parent.add(this.body)
  }
}

export default Block