require('dotenv').config()
// Steam API node lib
const SteamAPI = require('steamapi')
// Instanciating new class
const steam = new SteamAPI(process.env.STEAM_KEY)
// Steam API base URL
const steamUrl = 'https://steamcommunity.com/id/'

module.exports = {
  Query: {
    SteamUser: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const steamUser = await steam.getUserSummary(uid)
      return steamUser
    },
    SteamFeaturedCategories: async (parent, args, context) => {
      const featured = await steam.getFeaturedCategories()
      return featured
    },
    SteamFeaturedGames: async (parent, args, context) => {
      const featured = await steam.getFeaturedGames()
      return featured
    },
    SteamGameDetail: async (parent, args, context) => {
      const { id } = args
      const game = await steam.getGameDetails(id)
      return game
    },
    SteamGameNews: async (parent, args, context) => {
      const { id } = args
      const news = await steam.getGameNews(id)
      return news
    },
    SteamUserGames: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const games = await steam.getUserOwnedGames(uid)
      return games
    },
    SteamUserRecentGames: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const games = await steam.getUserRecentGames(uid)
      return games
    },
    SteamUserLevel: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const lvl = await steam.getUserLevel(uid)
      return lvl
    },
    SteamUserFriends: async (parent, args, context) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      let friends = await steam.getUserFriends(uid)
      const friendIds = friends.map((f) => f.steamID).map((id) => steam.getUserSummary(id))
      const friendNames = await Promise.all(friendIds)
      friends = friends.map((f) => { return { ...f, username: friendNames.find((x) => x.steamID === f.steamID).nickname } })
      return friends
    },
  },
}
