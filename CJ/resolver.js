const { search } = require('./services/cj')

module.exports = {
  Query: {
    product: async (parent, args) => {
      const { name } = args
      const response = await search(name)
      return response.find((r) => r.slug === name)
    },
  },
}
