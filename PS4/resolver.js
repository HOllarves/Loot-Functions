

module.exports = {
  Query: {
    game: async (parent, args, context) => {
      const axios = require('axios').default
      const { id, region = 'ES' } = args
      const lang = region === 'US' ? 'en' : 'es'
      const uri = `https://store.playstation.com/store/api/chihiro/00_09_000/container/${region}/${lang}/99/${id}`
      const response = await axios.get(uri)
      return response
    },
  },
}
