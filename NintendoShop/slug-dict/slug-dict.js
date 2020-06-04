const dict = require('./dict.json')

module.exports = (game) => {
  const data = game
  const exception = dict.find((i) => i.slug === game.slug)
  if (exception) {
    data.slug = exception.real_slug
  }
  return data
}