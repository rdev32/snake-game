import Player from './Player.mjs'
import Map from './Map.mjs'

export default class Game {
  constructor() {
    this.canvas = document.querySelector('#canvas')
    this.ctx = this.canvas.getContext('2d')
    this.stage = new Map(16, 16)
    this.player = new Player(3, 3)
    this.blockSize = 50

    this.stage.insert(this.player.position.x, this.player.position.y, 'P')
    this.canvas.width = this.stage.width * this.blockSize
    this.canvas.height = this.stage.height * this.blockSize

    this.eventHandler = this.eventHandler.bind(this)
    this.update = this.update.bind(this)
    this.render = this.render.bind(this)
  }

  eventHandler(e) {
    if (e.key === 'ArrowUp') this.player.moveUp()
    if (e.key === 'ArrowDown') this.player.moveDown(this.stage.height)
    if (e.key === 'ArrowLeft') this.player.moveLeft()
    if (e.key === 'ArrowRight') this.player.moveRight(this.stage.width)

    if (e.key === 'w') this.player.moveUp()
    if (e.key === 's') this.player.moveDown(this.stage.height)
    if (e.key === 'a') this.player.moveLeft()
    if (e.key === 'd') this.player.moveRight(this.stage.width)

    this.stage.insert(this.player.position.x, this.player.position.y, 'P')
  }

  update() {
    window.requestAnimationFrame(this.render)
  }

  render() {
    this.clear()

    for (let i = 0; i < this.stage.width; i++) {
      for (let j = 0; j < this.stage.height; j++) {
        this.ctx.fillStyle = this.stage.map[j][i] === 0 ? '#111' : '#fff'
        this.ctx.fillRect(
          i * this.blockSize,
          j * this.blockSize,
          this.blockSize,
          this.blockSize
        )
      }
    }

    window.requestAnimationFrame(this.update)
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  start() {
    window.addEventListener('keydown', this.eventHandler)
    this.update()
  }

  stop() {
    window.removeEventListener('keydown', this.eventHandler)
  }
}
