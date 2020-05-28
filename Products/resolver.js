const { search, searchByPartner } = require('./services/mongo')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name, currency } = args
      return search(name, currency)
    },
    products: async (parent, args) => {
      const { currency } = args
      return searchByPartner(currency)
    },
  },
  Game: {
    products: ({ slug }, { currency, platform, region }) => search(slug, { currency, platform, region }),
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { slug } = game
      if (slug) {
        return { slug }
      }
      return null
    },
  },
  RawDLC: {
    products: ({ slug }, { currency, platform, region }) => search(slug, { currency, platform, region }),
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { slug } = game
      if (slug) {
        return { slug }
      }
      return null
    },
  },
  RawFranchise: {
    products: ({ slug }, { currency, platform, region }) => search(slug, { currency, platform, region }),
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
