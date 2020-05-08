const { search, searchByPartner } = require('./services/mongo')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name } = args
      const response = await search(name)
      return response
    },
    products: async () => searchByPartner(),
  },
  Game: {
    products: (games) => games,
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { slug } = game
      if (slug) {
        const response = await search(slug)
        return response
      }
      return null
    },
  },
}
