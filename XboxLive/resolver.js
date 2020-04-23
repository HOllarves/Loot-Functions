const Auth = require('./services/auth')

const XboxLiveAPI = require('./services/xboxlive')

module.exports = {
  Query: {
    XboxGame: async (parent, args, context) => {
      const { id } = args
      const response = await XboxLiveAPI.getGame(id)
      consol
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
      return Auth.authenticate()
    },
  },
}