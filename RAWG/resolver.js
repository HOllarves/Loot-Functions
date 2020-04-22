const RawG = require('./services/rawg')

module.exports = {
  Query: {
    Game: async (parent, args, context) => {
      const { id } = args
      const response = await RawG.getGame(id)
      return response.data.results
    },
    Games: async (parent, args, context) => {
      const { search } = args
      const response = await RawG.getGames(search)
      console.log(response)
      return response.data.results
    },
  },
}
