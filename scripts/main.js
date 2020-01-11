const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 980
      }
    }
  },
  scene: [Editor, Play],
  backgroundColor: '#06C6F8'
}

const game = new Phaser.Game(config)
