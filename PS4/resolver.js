
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
    PSNPrice: async (psnGame) => {
      if (psnGame && psnGame.default_sku && psnGame.default_sku.display_price) {
        return (parseFloat(psnGame.default_sku.display_price.substring(1)) * 100).toFixed(0)
      }
      return null
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      if (game.PSN_ID) {
        try {
          const psnGame = await getGame(game.PSN_ID)
          if (psnGame) {
            return psnGame
          }
          return null
        } catch (e) {
          return null
        }
      }
      return null
    },
  },
}
