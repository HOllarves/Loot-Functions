const eshop = require('nintendo-switch-eshop')
const { getGame } = require('./services/algolia')

const getNintendoGame = async (title) => {
  const game = await getGame(title)
  const { msrp: price = 0 } = game
  return {
    price: parseInt((price * 100).toFixed(0), 10),
    rawData: game,
  }
}

module.exports = {
  Query: {
    USNintendoGames: () => eshop.getGamesAmerica(),
    EUNintendoGames: () => eshop.getGamesEurope(),
    NintendoGame: async (parent, args) => {
      const { title } = args
      return getNintendoGame(title)
    },
  },
  Game: {
    NintendoUSPrice: (game) => game.price,
    NintendoMarket: (game) => game.rawData,
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const { NINTENDO_ID } = game
      if (NINTENDO_ID) { return getNintendoGame(NINTENDO_ID) }
      return null
    },
  },
}
