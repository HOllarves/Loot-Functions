/* eslint-disable no-underscore-dangle */
const { search, all } = require('./services/mongo')

const getNintendoGame = async (region = 'US', title) => {
  const game = await search(region, title)
  if (game) {
    return {
      price: game.price,
      rawData: game,
    }
  }
  return {}
}
module.exports = {
  Query: {
    USNintendoGames: async () => all('US'),
    EUNintendoGames: async () => all('EU'),
    NintendoGame: async (parent, args) => getNintendoGame(args.region, args.title),
  },
  Game: {
    /**
     * @param {Object} game
     * @param {String} game.slug
     * @returns {Object}
     */
    __resolveReference(game) {
      const { slug, NINTENDO_ID } = game
      if (slug) { return { slug, NINTENDO_ID } }
      return null
    },
    USNintendoPrice: async (game) => {
      const { slug } = game
      const usGame = await search('US', slug)
      if (usGame) {
        return usGame.price
      }
      return null
    },
    EUNintendoPrice: async (game) => {
      const { slug } = game
      const euGame = await search('EU', slug)
      if (euGame) {
        return euGame.price
      }
      return null
    },
    USNintendoMarket: async (game) => search('US', game.slug),
    EUNintendoMarket: async (game) => search('EU', game.slug),
  },
}
