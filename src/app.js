import Phaser from 'phaser' // global

import Map from 'scenes/Map'
// import Editor from 'scenes/Editor'
// import Play from 'scenes/Play'

import 'stylesheets'

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: [Map],
  title: 'Project Nightfury',
  backgroundColor: '#06C6F8',
  transparent: true,
  disableContextMenu: true
}

const game = new Phaser.Game(config)
