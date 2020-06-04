require('dotenv').config()
// Steam API node lib
const SteamAPI = require('steamapi')
// Steam Pricing service
const { getUsPrice } = require('./services/steamPrice')
// Instanciating new class
const steam = new SteamAPI(process.env.STEAM_KEY)
// Steam API base URL
const steamUrl = 'https://steamcommunity.com/id/'

module.exports = {
  Query: {
    SteamUser: async (parent, args) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const steamUser = await steam.getUserSummary(uid)
      return steamUser
    },
    SteamFeaturedCategories: async () => {
      const featured = await steam.getFeaturedCategories()
      return featured
    },
    SteamFeaturedGames: async () => {
      const featured = await steam.getFeaturedGames()
      return featured
    },
    SteamGame: async (parent, args) => {
      const { id } = args
      const game = await steam.getGameDetails(id)
      return game
    },
    SteamGameNews: async (parent, args) => {
      const { id } = args
      const news = await steam.getGameNews(id)
      return news
    },
    SteamUserGames: async (parent, args) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const games = await steam.getUserOwnedGames(uid)
      return games
    },
    SteamUserRecentGames: async (parent, args) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const games = await steam.getUserRecentGames(uid)
      return games
    },
    SteamUserLevel: async (parent, args) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      const lvl = await steam.getUserLevel(uid)
      return lvl
    },
    SteamUserFriends: async (parent, args) => {
      let { uid } = args
      const { username } = args
      if (!uid) {
        uid = await steam.resolve(`${steamUrl}${username}`)
      }
      let friends = await steam.getUserFriends(uid)
      const friendIds = friends.map((f) => f.steamID).map((id) => steam.getUserSummary(id))
      const friendNames = await Promise.all(friendIds)
      friends = friends.map((f) => (
        { ...f, username: friendNames.find((x) => x.steamID === f.steamID).nickname }
      ))
      return friends
    },
  },
  Game: {
    SteamMarket: (steamGame) => steamGame,
    USSteamPrice: async (steamGame) => {
      if (steamGame) {
        const usGame = await steam.getGameDetails(steamGame.steam_appid, false, 'us')
        if (usGame.is_free) {
          return 0
        }
        if (usGame.price_overview) {
          return usGame.price_overview.final
        }
        return null
      }
      return null
    },
    EUSteamPrice: async (steamGame) => {
      if (steamGame && steamGame.is_free) {
        return 0
      }
      if (steamGame && steamGame.price_overview) {
        return steamGame.price_overview.final
      }
      return null
    },
    // eslint-disable-next-line no-underscore-dangle
    async __resolveReference(game, context) {
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
