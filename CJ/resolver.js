const { search } = require('./services/cj')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name } = args
      const response = await search(name)
      return response.find((r) => r.slug === name)
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
