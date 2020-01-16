const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 980
      },
      debug: true
    }
  },
  scene: [Editor, Play],
  title: 'Project Nightfury',
  backgroundColor: '#06C6F8',
  // transparent: true,
  disableContextMenu: true
}

const game = new Phaser.Game(config)
