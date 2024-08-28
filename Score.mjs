export default class Score {
  #session
  #player
  #points
  #date

  constructor(player, score = 0) {
    this.#session = crypto.randomUUID()
    this.#player = player
    this.#points = score
    this.#date = +new Date()
  }

  set session(uuid) {
    this.#session = uuid
  }
  get session() {
    return this.#session
  }

  set player(name) {
    this.#player = name
  }
  get player() {
    return this.#player
  }

  set points(pts) {
    this.#points = pts
  }
  get points() {
    return this.#points
  }

  set date(lastDate) {
    this.#date = lastDate
  }
  get date() {
    return this.#date
  }

  updateScoreTag(div) {
    div.textContent = this.#points.toString()
  }

  saveScore() {
    const scoreData = {
      session: this.#session,
      player: this.#player,
      score: this.#points,
      date: this.#date
    }
    localStorage.setItem('snake_score', JSON.stringify(scoreData))
  }

  static loadScore() {
    const scoreData = localStorage.getItem('snake_score')
    if (!scoreData) {
      return null
    }

    const { session, player, score, date } = JSON.parse(scoreData)
    const scoreInstance = new Score(player, score)
    scoreInstance.session = session
    scoreInstance.date = date
    return scoreInstance
  }
}
