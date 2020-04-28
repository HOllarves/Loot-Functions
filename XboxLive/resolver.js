const Auth = require('./services/auth')

const XboxLiveAPI = require('./services/xboxlive')

module.exports = {
  Query: {
    XboxGame: async (parent, args, context) => {
      const { id } = args
      const response = await XboxLiveAPI.getGame(id)
      return response.data.Product
    },
    XboxGames: async (parent, args, context) => {
      const { search } = args
      const response = await XboxLiveAPI.getGames(search)
      return response.Products
    },
  },
  Mutation: {
    authenticate: async (parent, args, context) => {
      const { email, password } = args
      return Auth.authenticate(email, password)
    },
  },
  Game: {
    XboxMarket: async (xboxGame) => {
      const game = xboxGame
      if (game.DisplaySkuAvailabilities) {
        game.DisplaySkuAvailabilities.map((sku) => {
          const data = sku
          data.Availabilities = data.Availabilities.filter((a) => a.OrderManagementData
            && a.OrderManagementData.Price && a.OrderManagementData.Price.ListPrice > 0)
          return data
        })
      }
      return game
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const id = game.XBOX_ID && game.XBOX_ID.includes('?') ? game.XBOX_ID.split('?')[0] : game.XBOX_ID
      if (id) {
        const xboxGame = await XboxLiveAPI.getGame(id)
        return xboxGame.Products[0]
      }
      return {}
    },
  },
}