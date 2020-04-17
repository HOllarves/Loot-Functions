require('dotenv').config()
// Steam API node lib
const SteamAPI = require('steamapi')
// Instanciating new class
const steam = new SteamAPI(process.env.STEAM_KEY)

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
    userRecentGames: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`https://steamcommunity.com/id/${username}`)
      }
      const games = await steam.getUserRecentGames(uid)
      return games
    },
    userLevel: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`https://steamcommunity.com/id/${username}`)
      }
      const lvl = await steam.getUserLevel(uid)
      return lvl
    },
    userFriends: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`https://steamcommunity.com/id/${username}`)
      }
      let friends = await steam.getUserFriends(uid)
      const friendIds = friends.map((f) => f.steamID).map((id) => steam.getUserSummary(id))
      const friendNames = await Promise.all(friendIds)
      friends = friends.map((f) => { return { ...f, username: friendNames.find((x) => x.steamID === f.steamID).nickname } })
      return friends
    },
  },
}
