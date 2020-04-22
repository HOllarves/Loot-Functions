/**
 * RAWG API Service
 */
const RAWG = () => {
  const axios = require('axios')
  const headers = {
    'User-Agent': 'LootBank',
  }
  const rawBaseUrl = 'https://api.rawg.io/api/games'
  /**
   * Returns game information
   * @param {String} id - Game ID
   */
  const getGame = (id) => {
    return axios.default.get(`${rawBaseUrl}/${id}`, { headers })
  }
  /**
   * Return a list of all games
   */
  const getGames = (search) => {
    return axios.default.get(rawBaseUrl, { headers, params: { search } })
  }

  return {
    getGame, getGames,
  }
}

module.exports = RAWG()
