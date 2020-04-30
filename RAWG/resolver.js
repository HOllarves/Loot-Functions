const RawG = require('./services/rawg')

const getGame = async (id) => {
  const response = await RawG.getGame(id)
  return response.data
}

module.exports = {
  Query: {
    Game: async (parent, args) => {
      const { id } = args
      const game = await getGame(id)
      if (game.stores && game.stores.length) {
        game.stores.forEach((r) => {
          if (r.store && r.store.slug === 'playstation-store') {
            const url = r.url ? r.url.split('/') : ''
            game.PSN_ID = url[url.length - 1]
          }

          if (r.store && r.store.slug === 'xbox-store') {
            const url = r.url ? r.url.split('/') : ''
            game.XBOX_ID = url[url.length - 1]
          }

          if (r.store && r.store.slug === 'steam') {
            if (r.url) {
              const appUrl = r.url.split('/app/')
              if (appUrl && appUrl.length > 1) {
                game.STEAM_ID = appUrl[1].split('/')[0]
              }
              const subUrl = r.url.split('/sub/')
              if (subUrl && subUrl.length > 1) {
                game.STEAM_ID = subUrl[1].slice(0, -1)
              }
            }
          }
        })
      }
      return game
    },
    Games: async (parent, args) => {
      const { search } = args
      const response = await RawG.getGames(search)
      return response.data.results
    },
  },
}
