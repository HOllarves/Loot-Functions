const { getEUPrice, getUSPrice } = require('./mongo')

module.exports = {
  Query: {
    USPrice: (parent, args) => getUSPrice(args.slug),
    EUPrice: (parent, args) => getEUPrice(args.slug),
  },
  Game: {
    USEpicPrice: async (game) => getUSPrice(game.slug),
    EUEpicPrice: async (game) => getEUPrice(game.slug),
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      if (game.slug) {
        return { slug: game.slug }
      }
      return null
    },
  },
}
