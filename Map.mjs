export default class Map {
  constructor(w, h) {
    this.width = w
    this.height = h
    this.availablePositions = []
    this.map = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => {
        this.availablePositions.push({ x, y })
        return 0
      })
    )
    this.insert = this.insert.bind(this)
  }

  insert(x, y, id) {
    let collisionOccurred = false

    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      if (this.map[y][x] !== id && this.map[y][x] !== 0 && this.map[y][x] === 'F') {
        collisionOccurred = true
      }
      this.map[y][x] = id
      this.availablePositions = this.availablePositions.filter(
        (pos) => !(pos.x === x && pos.y === y)
      )
    }

    return collisionOccurred
  }

  remove(x, y, id) {
    if (this.map[y][x] === id) {
      this.map[y][x] = 0
      this.availablePositions.push({ x, y })
    }
  }

  randomPosition(headPosition, currentDirection, difficulty = 'easy') {
    const availablePositions = []

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.map[y][x] === 0) {
          // Position is free
          const isForward = this.#isForwardDirection(
            { x, y },
            headPosition,
            currentDirection
          )
          if (!(difficulty === 'hard' && isForward)) {
            availablePositions.push({ x, y })
          }
        }
      }
    }

    if (availablePositions.length === 0) {
      return null // No available positions
    }

    let randomIndex = 0
    if (difficulty === 'easy') {
      // Choose a position farthest from the head
      availablePositions.sort(
        (a, b) =>
          this.#calculateDistance(b, headPosition) -
          this.#calculateDistance(a, headPosition)
      )
      randomIndex = Math.floor(Math.random() * Math.ceil(availablePositions.length / 2))
    } else if (difficulty === 'hard') {
      // Choose a position closest to the head
      availablePositions.sort(
        (a, b) =>
          this.#calculateDistance(a, headPosition) -
          this.#calculateDistance(b, headPosition)
      )
      randomIndex = Math.floor(Math.random() * Math.ceil(availablePositions.length / 2))
    } else {
      // Default random position
      randomIndex = Math.floor(Math.random() * availablePositions.length)
    }

    return availablePositions[randomIndex]
  }

  #isForwardDirection(position, headPosition, direction) {
    const dx = position.x - headPosition.x
    const dy = position.y - headPosition.y
    return dx === direction.x && dy === direction.y
  }

  #calculateDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }
}
