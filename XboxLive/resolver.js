const Auth = require('./services/auth')

const { getEuGame, getUsGame, getGames } = require('./services/xboxlive')

const findXboxPrice = (DisplaySkuAvailabilities, currency) => {
  if (DisplaySkuAvailabilities && DisplaySkuAvailabilities.length) {
    let price = null
    DisplaySkuAvailabilities.forEach((sku) => {
      if (sku && sku.Availabilities && sku.Availabilities.length) {
        const priceObj = sku.Availabilities.find((a) => a
          && a.OrderManagementData
          && a.OrderManagementData.Price
          && a.OrderManagementData.Price.ListPrice > 0
          && a.OrderManagementData.Price.CurrencyCode === currency)
        if (priceObj) {
          price = parseInt((priceObj.OrderManagementData.Price.ListPrice * 100).toFixed(0), 10)
        }
      }
    })
    return price
  }
  return null
}

module.exports = {
  Query: {
    XboxGame: async (parent, args) => {
      const { id } = args
      const response = await getUsGame(id)
      return response.data.Product
    },
    XboxGames: async (parent, args) => {
      const { search } = args
      const response = await getGames(search)
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
    USXboxPrice: async (xboxGame) => {
      const { id } = xboxGame
      const game = await getUsGame(id)
      if (game && game.Products && game.Products.length > 0) {
        return findXboxPrice(game.Products[0].DisplaySkuAvailabilities, 'USD')
      }
      return null
    },
    EUXboxPrice: async (xboxGame) => {
      const { id } = xboxGame
      const game = await getEuGame(id)
      if (game && game.Products && game.Products.length > 0) {
        return findXboxPrice(game.Products[0].DisplaySkuAvailabilities, 'EUR')
      }
      return null
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game) {
      const id = game.XBOX_ID && game.XBOX_ID.includes('?') ? game.XBOX_ID.split('?')[0] : game.XBOX_ID
      if (id) {
        return { id }
      }
      return {}
    },
  },
}
