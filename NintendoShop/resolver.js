const eshop = require('nintendo-switch-eshop')
const { getGame } = require('./services/algolia')
const { all, saveData, search } = require('./services/db')

const getNintendoGame = async (title) => {
  const game = await getGame(title)
  if (!game) return {}
  const { msrp: price = 0 } = game
  return {
    price: parseInt((price * 100).toFixed(0), 10),
    rawData: game,
  }
}

module.exports = {
  Query: {
    USNintendoGames: async () => {
      const data = await all('US')
      if (data.length === 0) {
        const newData = await eshop.getGamesAmerica()
        await saveData('US', newData)
        return newData
      }
      return data
    },
    EUNintendoGames: async () => {
      const data = await all('EU')
      if (data.length === 0) {
        const newData = await eshop.getGamesEurope()
        await saveData('EU', newData)
        return newData
      }
      return data
    },
    NintendoGame: async (parent, args) => {
      const { title } = args
      return getNintendoGame(title)
    },
  },
  Game: {
    USNintendoPrice: async (game) => {
      const { NINTENDO_ID } = game
      const usGame = search('US', NINTENDO_ID)
      if (usGame) {
        return parseInt((usGame.msrp * 100).toFixed(0), 10)
      }
      return null
    },
    EUNintendoPrice: async (game) => {
      const { NINTENDO_ID } = game
      const euGame = search('EU', NINTENDO_ID)
      if (euGame) {
        return parseInt((euGame.price_regular_f * 100).toFixed(0), 10)
      }
    },
    USNintendoMarket: async (game) => {
      const { NINTENDO_ID } = game
      const allUSGames = search('US', NINTENDO_ID)
      return allUSGames
    },
    EUNintendoMarket: async (game) => {
      const { NINTENDO_ID } = game
      const allUSGames = search('EU', NINTENDO_ID)
      return allUSGames
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { NINTENDO_ID } = game
      if (NINTENDO_ID) { return { NINTENDO_ID } }
      return null
    },
  },
}
