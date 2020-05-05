
const axios = require('axios').default

const { getEUID } = require('./services/pstore')

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
      const gameMarketData = psnGame[0]
      gameMarketData.PSN_ID = psnGame.id
      return gameMarketData
    },
    USPSNPrice: async (psnGame) => {
      if (psnGame[0] && psnGame[0].default_sku && psnGame[0].default_sku.display_price) {
        return (parseFloat(psnGame[0].default_sku.display_price.replace('$', '')) * 100).toFixed(0)
      }
      return null
    },
    EUPSNPrice: async (psnGame) => {
      if (psnGame[1] && psnGame[1].default_sku && psnGame[1].default_sku.display_price) {
        return (parseFloat(psnGame[1].default_sku.display_price.replace('€', '')) * 100).toFixed(0)
      }
      return null
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      if (game.PSN_ID) {
        try {
          const PSN_EU_ID = await getEUID(game.PSN_ID)
          const games = await Promise.all([getGame(game.PSN_ID), getGame(PSN_EU_ID, 'ES')])
          if (games) { return games }
          return null
        } catch (e) {
          return null
        }
      }
      return null
    },
  },
}
