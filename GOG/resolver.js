/* eslint-disable no-underscore-dangle */
const { search } = require('./services/mongo')

module.exports = {
  Game: {
    /**
     * @param {Object} game
     * @param {String} game.slug
     * @returns {Object}
     */
    __resolveReference(game) {
      const { slug } = game
      if (slug) { return search(slug) }
      return null
    },
    GOGPrice: async (game) => game.price,
    GOGMarket: async (game) => game,
  },
}
