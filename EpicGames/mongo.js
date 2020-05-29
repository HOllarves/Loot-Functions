const Mongo = () => {
  const EpicGame = require('./models/epic-game')
  /**
   * Returns Epic Game price in USD
   * @param {String} slug
   */
  const getUSPrice = async (slug) => {
    await require('../DB/client').startDB()
    const game = await EpicGame.findOne({ slug, currency: 'USD' })
    if (game && game.price) {
      return game.price
    }
    return null
  }
  /**
   * Return Epic Game price in EUR
   * @param {String} slug
   */
  const getEUPrice = async (slug) => {
    await require('../DB/client').startDB()
    const game = await EpicGame.findOne({ slug, currency: 'EUR' })
    if (game && game.price) {
      return game.price
    }
    return null
  }
  return { getEUPrice, getUSPrice }
}

module.exports = Mongo()
