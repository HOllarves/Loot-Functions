const Auth = require('./services/auth')

const XboxLiveAPI = require('./services/xboxlive')

const findXboxPrice = (DisplaySkuAvailabilities) => {
  if (DisplaySkuAvailabilities && DisplaySkuAvailabilities.length) {
    let price = null
    DisplaySkuAvailabilities.forEach((sku) => {
      if (sku && sku.Availabilities && sku.Availabilities.length) {
        const priceObj = sku.Availabilities.find((a) => a
          && a.OrderManagementData
          && a.OrderManagementData.Price
          && a.OrderManagementData.Price.ListPrice > 0)
        if (priceObj) {
          price = priceObj.OrderManagementData.Price.ListPrice * 100
        }
      }
    })
    return price
  }
}

module.exports = {
  Query: {
    XboxGame: async (parent, args) => {
      const { id } = args
      const response = await XboxLiveAPI.getGame(id)
      return response.data.Product
    },
    XboxGames: async (parent, args) => {
      const { search } = args
      const response = await XboxLiveAPI.getGames(search)
      return response.Products
    },
  },
  Mutation: {
    authenticate: async (parent, args) => {
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
    XboxPrice: async (xboxGame) => {
      const game = xboxGame
      return findXboxPrice(game.DisplaySkuAvailabilities)
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