const Auth = require('./services/auth')

const XboxLiveAPI = require('./services/xboxlive')


module.exports = {
  Query: {
    XboxGame: async (parent, args, context) => {
      const authToken = await Auth.authenticate()
      const { id } = args
      const response = await XboxLiveAPI.getGame(id, authToken)
      return response
    },
    XboxGames: async (parent, args, context) => {
      const authToken = await Auth.authenticate()
      const response = await XboxLiveAPI.getGames(authToken)
      return response
    },
  },
  Mutation: {
    authenticate: async (parent, args, context) => {
      return Auth.authenticate()
    },
  },
}