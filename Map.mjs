export default class Map {
  constructor(w, h) {
    this.width = w
    this.height = h
    this.prev = null
    this.map = Array.from({ length: h }, () => Array(w).fill(0))
  }

  insert(x, y, id) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      if (this.prev) {
        this.map[this.prev.y][this.prev.x] = 0
      }

      this.map[y][x] = id
      this.prev = { x, y }
    }
  }

  restore(x, y, id) {
    this.prev = null
    if (this.map[y][x] !== id) throw new Error('Element not found')
    this.map[y][x] = 0
  }
}
