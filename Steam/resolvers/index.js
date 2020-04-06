require('dotenv').config()

const SteamAPI = require('steamapi'),
  steam = new SteamAPI(process.env.STEAM_KEY)

module.exports = {
  Query: {
    user: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`https://steamcommunity.com/id/${username}`)
      }
      const steamUser = await steam.getUserSummary(uid)
      return steamUser
    },
    featuredCategories: async (parent, args, context) => {
      const featured = await steam.getFeaturedCategories()
      return featured
    },
    featuredGames: async (parent, args, context) => {
      const featured = await steam.getFeaturedGames()
      return featured
    },
    gameDetail: async (parent, args, context) => {
      const { id } = args
      console.log({ id })
      const game = await steam.getGameDetails(id)
      return game
    },
    gameNews: async (parent, args, context) => {
      const { id } = args
      const news = await steam.getGameNews(id)
      return news
    },
    userGames: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`https://steamcommunity.com/id/${username}`)
      }
      const games = await steam.getUserOwnedGames(uid)
      return games
    },
  },
}
