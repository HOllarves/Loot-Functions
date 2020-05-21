const dict = require('./dict.json')

module.exports = (game) => {
  const data = game
  const exception = dict.find((i) => i.id === game.id)
  if (exception) {
    data.slug = exception.slug
  }
  return data
}