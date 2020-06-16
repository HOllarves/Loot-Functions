const Mongo = () => {
  const EpicGame = require('./models/epic-game')
  /**
   * Returns Epic Game price in USD
   * @param {String} slug
   */
  const getUSPrice = async (slug) => {
    const client = await require('../DB/client').startDB()
    const game = await EpicGame.findOne({ slug, currency: 'USD' })
    if (game && game.price) {
      if (game.price === 'Free') {
        return 0
      }
      return parseInt(game.price, 10)
    }
    await client.close()
    return null
  }
  /**
   * Return Epic Game price in EUR
   * @param {String} slug
   */
  const getEUPrice = async (slug) => {
    const client = await require('../DB/client').startDB()
    const game = await EpicGame.findOne({ slug, currency: 'EUR' })
    if (game && game.price) {
      if (game.price === 'Free') {
        return 0
      }
      return parseInt(game.price, 10)
    }
    await client.close()
    return null
  }
  return { getEUPrice, getUSPrice }
}

module.exports = Mongo()
