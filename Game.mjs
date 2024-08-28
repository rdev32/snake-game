import Player from './Player.mjs'
import Score from './Score.mjs'
import Map from './Map.mjs'

export default class Game {
  constructor() {
    this.canvas = document.querySelector('#canvas')
    if (!this.canvas) {
      throw new Error('Canvas not found')
    }

    this.scoreTag = document.querySelector('#points')
    if (!this.scoreTag) {
      throw new Error('Element not found')
    }

    this.ctx = this.canvas.getContext('2d')
    if (!this.ctx) {
      throw new Error('Context not initialized')
    }

    this.gameMap = new Map(16, 16)

    this.player = new Player(3, 3)

    this.score = new Score(this.player.name)

    this.blockSize = 50

    this.lastUpdateTime = 0
    this.speed = 200

    const foodRandomPosition = this.gameMap.randomPosition(
      this.player.getPosition(),
      this.player.currentDirection
    )

    this.canvas.width = this.gameMap.width * this.blockSize
    this.canvas.height = this.gameMap.height * this.blockSize

    this.gameMap.insert(this.player.getPosition().x, this.player.getPosition().y, 'P')
    this.gameMap.insert(foodRandomPosition.x, foodRandomPosition.y, 'F')
    this.score.updateScoreTag(this.scoreTag)

    this.eventHandler = this.eventHandler.bind(this)
    this.update = this.update.bind(this)
    this.render = this.render.bind(this)
  }

  eventHandler(e) {
    let newDirection
    if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
      newDirection = { x: 0, y: -1 }
    } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
      newDirection = { x: 0, y: 1 }
    } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
      newDirection = { x: -1, y: 0 }
    } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
      newDirection = { x: 1, y: 0 }
    }

    if (newDirection) {
      this.player.enqueueDirection(newDirection)
    }
  }

  update(timestamp) {
    // Stop the game if the player is not alive
    if (!this.player.isAlive()) {
      this.stop()
      alert(`Perdiste! Tu puntuacion fue de ${this.score.points.toString()}`)
      return
    }

    if (timestamp - this.lastUpdateTime >= this.speed) {
      // Clear previous positions
      for (let pos of this.player.positions) {
        this.gameMap.remove(pos.x, pos.y, 'P')
      }

      // Update the player's position
      this.player.updatePosition(this.gameMap.width, this.gameMap.height)

      // Check for collisions with the snake's body
      if (this.player.detectSelfCollision()) {
        this.player.kill() // Set the player as dead
      }

      // Check for food collisions and update the map
      const headPos = this.player.getPosition()
      const collision = this.gameMap.insert(headPos.x, headPos.y, 'P')

      if (collision) {
        this.score.points += 1
        this.score.updateScoreTag(this.scoreTag)
        this.player.grow() // Grow the snake when it eats food

        const foodRandomPosition = this.gameMap.randomPosition(
          headPos,
          this.player.currentDirection
        )
        if (!foodRandomPosition) {
          // End game
        }
        this.gameMap.insert(foodRandomPosition.x, foodRandomPosition.y, 'F')
      }

      // Insert all positions of the snake into the map
      for (let pos of this.player.positions) {
        this.gameMap.insert(pos.x, pos.y, 'P')
      }

      this.clear()
      this.render(timestamp)

      this.lastUpdateTime = timestamp
    }

    window.requestAnimationFrame(this.update)
  }

  render(timestamp) {
    for (let i = 0; i < this.gameMap.width; i++) {
      for (let j = 0; j < this.gameMap.height; j++) {
        this.ctx.fillStyle =
          this.gameMap.map[j][i] === 0
            ? '#111'
            : this.gameMap.map[j][i] === 'F'
            ? '#129f12'
            : '#fff'
        this.ctx.fillRect(
          i * this.blockSize,
          j * this.blockSize,
          this.blockSize,
          this.blockSize
        )
      }
    }
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
