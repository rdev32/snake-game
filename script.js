import Game from './Game.mjs'

window.addEventListener('load', () => {
  try {
    const game = new Game()
    game.start()
  } catch (err) {
    console.log('The following error appeared while executing the program:')
    console.error(err)
  }
})
