const Mongo = () => {
  const EpicGame = require('./models/epic-game')
  const DBQuery = require('../DB/client')
  /**
   * Returns Epic Game price in USD
   * @param {String} slug
   */
  const getUSPrice = async (slug) => {
    const game = await DBQuery(EpicGame.findOne({ slug, currency: 'USD' }))
    if (game && game.price) {
      if (game.price === 'Free') {
        return 0
      }
      return parseInt(game.price, 10)
    }
    return null
  }
  /**
   * Return Epic Game price in EUR
   * @param {String} slug
   */
  const getEUPrice = async (slug) => {
    const game = await DBQuery(EpicGame.findOne({ slug, currency: 'EUR' }))
    if (game && game.price) {
      if (game.price === 'Free') {
        return 0
      }
      return parseInt(game.price, 10)
    }
    return null
  }
  return { getEUPrice, getUSPrice }
}

module.exports = Mongo()
