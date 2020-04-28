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
            const url = r.url ? r.url.split('/app/')[1].split('/')[0] : ''
            game.STEAM_ID = url
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
