
const axios = require('axios').default

const getGame = async (id, region = 'US') => {
  const lang = region === 'US' ? 'en' : 'es'
  const uri = `https://store.playstation.com/store/api/chihiro/00_09_000/container/${region}/${lang}/99/${id}`
  const response = await axios.get(uri)
  return response.data
}

module.exports = {
  Query: {
    PSNGame: async (parent, args) => {
      const { id, region = 'ES' } = args
      const lang = region === 'US' ? 'en' : 'es'
      const uri = `https://store.playstation.com/store/api/chihiro/00_09_000/container/${region}/${lang}/99/${id}`
      const response = await axios.get(uri)
      response.data.PSN_ID = id
      return response.data
    },
  },
  Game: {
    PSNMarket: async (psnGame) => {
      const gameMarketData = psnGame
      gameMarketData.PSN_ID = psnGame.id
      return gameMarketData
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      if (game.PSN_ID) {
        return getGame(game.PSN_ID)
      }
      return {}
    },
  },
}
