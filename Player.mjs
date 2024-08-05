export default class Player {
  constructor(x, y, name = 'player') {
    this.position = { x, y }
    this.name = name
    this.lives = 3
    this.alive = true
  }

  moveLeft() {
    if (this.position.x > 0) this.position.x--
  }

  moveRight(limit) {
    if (this.position.x + 1 < limit) this.position.x++
  }

  moveDown(limit) {
    if (this.position.y + 1 < limit) this.position.y++
  }

  moveUp() {
    if (this.position.y > 0) this.position.y--
  }

  kill() {
    this.alive = false
  }
}
