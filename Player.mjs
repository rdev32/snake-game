export default class Player {
  constructor(x, y, name = 'P') {
    this.positions = [{ x, y }] // The snake's head is the first element
    this.name = name
    this.lives = 3
    this.alive = true

    this.directionQueue = [] // Queue to store direction changes
    this.currentDirection = { x: 1, y: 0 } // Start moving right by default
  }

  enqueueDirection(newDirection) {
    if (
      this.directionQueue.length < 2 &&
      (newDirection.x !== -this.currentDirection.x ||
        newDirection.y !== -this.currentDirection.y) &&
      (newDirection.x !== this.currentDirection.x ||
        newDirection.y !== this.currentDirection.y)
    ) {
      this.directionQueue.push(newDirection)
    }
  }

  updatePosition(stageWidth, stageHeight) {
    // If there are any queued directions, process the next one
    while (this.directionQueue.length > 0) {
      this.currentDirection = this.directionQueue.shift()
    }

    // Move all positions of the snake
    for (let i = this.positions.length - 1; i > 0; i--) {
      // Shift the position to the previous segment's position
      this.positions[i] = { ...this.positions[i - 1] }
    }

    // Update the head's position based on the current direction
    this.positions[0].x += this.currentDirection.x
    this.positions[0].y += this.currentDirection.y

    // Handle boundaries (optional wrap-around or game-over)
    if (this.positions[0].x < 0) this.positions[0].x = stageWidth - 1
    else if (this.positions[0].x >= stageWidth) this.positions[0].x = 0

    if (this.positions[0].y < 0) this.positions[0].y = stageHeight - 1
    else if (this.positions[0].y >= stageHeight) this.positions[0].y = 0
  }

  // Checks if the head's position matches any other part of the body
  detectSelfCollision() {
    const head = this.positions[0]
    for (let i = 1; i < this.positions.length; i++) {
      if (head.x === this.positions[i].x && head.y === this.positions[i].y) {
        return true
      }
    }
    return false
  }

  grow() {
    const lastSegment = this.positions[this.positions.length - 1]
    this.positions.push({ ...lastSegment })
  }

  kill() {
    this.alive = false
  }

  isAlive() {
    return this.alive
  }

  getPosition() {
    return this.positions[0]
  }
}
