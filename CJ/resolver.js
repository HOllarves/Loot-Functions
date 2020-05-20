const { search, searchByPartner } = require('./services/mongo')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name, currency = 'USD' } = args
      return search(name, currency)
    },
    products: async (parent, args) => {
      const { currency } = args
      return searchByPartner(currency)
    },
  },
  Game: {
    products: ({ slug }, { currency, platform }) => search(slug, { currency, platform }),
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { slug } = game
      if (slug) {
        return { slug }
      }
      return null
    },
  },
}
