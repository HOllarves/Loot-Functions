require('dotenv').config()
// Steam API node lib
const SteamAPI = require('steamapi')
// Steam Pricing service
const { getUsPrice } = require('./services/steamPrice')
// Instanciating new class
const steam = new SteamAPI(process.env.STEAM_KEY)

module.exports = {
  Query: {
    SteamGame: async (parent, args, context) => {
      const { id } = args
      const game = await steam.getGameDetails(id)
      return game
    },
  },
  Game: {
    SteamMarket: (steamGame) => steamGame,
    USSteamPrice: async (steamGame) => {
      if (steamGame) {
        const usPrice = await getUsPrice(steamGame.steam_appid)
        return usPrice
      }
      return null
    },
    EUSteamPrice: async (steamGame) => {
      if (steamGame) {
        return steamGame.price_overview.final
      }
      return null
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      if (game.STEAM_ID) {
        try {
          const steamGame = await steam.getGameDetails(game.STEAM_ID)
          if (steamGame) { return steamGame }
          return null
        } catch (e) {
          return null
        }
      }
      return null
    },
  },
}
