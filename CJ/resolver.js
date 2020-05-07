const { search } = require('./services/mongo')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name } = args
      const response = await search(name)
      return response
    },
    products: async (parent, args) => {
      const { name } = args
      const response = await search(name)
      return response
    },
  },
  Game: {
    products: (games) => games,
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { slug } = game
      if (slug) {
        const response = await search(slug)
        return response || null
      }
      return null
    },
  },
}
