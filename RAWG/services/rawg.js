/* eslint-disable indent */
/**
 * RAWG API Service
 */
const RAWG = () => {
  const axios = require('axios')
  const headers = {
    'User-Agent': 'LootEngine',
  }
  const rawBaseUrl = 'https://api.rawg.io/api/games'

  /**
   * Return a list of all games
   */
  const getGames = async (search) => {
    const game = await axios.default.get(rawBaseUrl, { headers, params: { search } })
    if (game.status === 200) {
      return game.data
    }
    return []
  }

  /**
   * Return game detail information
   * @param {*} id Game ID
   */
  const getGameDetails = async (id) => {
    const game = await axios.default.get(`${rawBaseUrl}/${id}`, { headers })
    if (game.status === 200) {
      return game.data
    }
    return null
  }

  /**
   * Return game screenshots
   * @param {String} id Game ID
   */
  const getScreenshots = async (id) => {
    const screenshots = await axios.default.get(`${rawBaseUrl}/${id}/screenshots`, { headers })
    if (screenshots.status === 200) {
      return screenshots.data.results
    }
    return []
  }

  /**
   * Returns game available DLC
   * @param {String} id Game ID
   */
  const getDLC = async (id) => {
    const dlc = await axios.default.get(`${rawBaseUrl}/${id}/additions`, { headers })
    if (dlc.status === 200) {
      return dlc.data.results
    }
    return []
  }
  /**
   * Returns game franchise titles
   * @param {String} id Game ID
   */
  const getFranchise = async (id) => {
    const franchise = await axios.default.get(`${rawBaseUrl}/${id}/game-series`, { headers })
    if (franchise.status === 200) {
      return franchise.data.results
    }
    return []
  }

  /**
   * Return a list of game trailers
   * @param {String} id Game ID
   */
  const getTrailers = async (id) => {
    const trailers = await axios.default.get(`${rawBaseUrl}/${id}/movies`, { headers })
    if (trailers.status === 200 && trailers.data && trailers.data.results.length) {
      const { data: { results: data } } = trailers
      return data.map((t) => {
        const obj = t
        const { data: tData } = t
        // eslint-disable-next-line no-underscore-dangle
        obj.data._480 = tData['480']
        return t
      })
    }
    return []
  }

  /**
  * Returns game information
  * @param {String} id - Game ID
  */
  const getGame = async (id) => {
    const gameInfo = getGameDetails(id)
    const gameScreenshots = getScreenshots(id)
    const gameTrailers = getTrailers(id)
    const DLC = getDLC(id)
    const franchise = getFranchise(id)
    const [game, screenshots, trailers] = await Promise
      .all([
        gameInfo,
        gameScreenshots,
        gameTrailers,
        DLC,
        franchise,
      ])
    return {
      ...game, screenshots, trailers, DLC, franchise,
    }
  }

  return {
    getGame, getGames, getScreenshots, getTrailers,
  }
}

module.exports = RAWG()
