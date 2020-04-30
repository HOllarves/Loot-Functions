const XboxLiveAPI = () => {

  const axios = require('axios')

  const xboxApiUrl = 'https://xapi.us/v2'

  const xboxApiKey = process.env.XBOX_API_KEY

  const headers = { 'X-AUTH': xboxApiKey }

  /**
   * Returns a specific game
   * from xboxapi.com
   * @param {String} id - Game ID 
   */
  const getGame = async (id) => {
    try {
      const response = await axios.default.get(`${xboxApiUrl}/marketplace/show/${id}`, { headers })
      if (response && response.data) {
        return response.data
      }
      throw new Error(`Unable to obtain game with ID ${id}`)
    } catch (e) {
      return { error: 'Internal Server Error', message: 'Unable to reach xboxapi.com services' }
    }
  }

  /**
   * Returns the latests games
   * in the xbox live marketplace
   */
  const getLatestGames = async () => {
    try {
      const response = await axios.default.get(`${xboxApiUrl}/marketplace/latest-games`, { headers })
      if (response && response.data) {
        return response.data
      }
      throw new Error('Unable to obtain latest games')
    } catch (e) {
      return { error: 'Internal Server Error', message: 'Unable to reach xboxapi.com services' }
    }
  }

  /**
   * Returns games based on a search query
   * @param {String} search 
   */
  const getGames = async (search) => {
    try {
      const response = await axios.default.get(`${xboxApiUrl}/marketplace/search/${search}`, { headers })
      if (response && response.data) {
        return response.data
      }
      throw new Error('Unable to obtain games')
    } catch (e) {
      return { error: 'Internal Server Error', message: 'Unable to reach xboxapi.com services' }
    }
  }

  return { getGame, getGames, getLatestGames }
}

module.exports = XboxLiveAPI()