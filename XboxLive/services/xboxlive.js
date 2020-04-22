const XboxLiveAPI = () => {

  const axios = require('axios')
  // const xboxInventoryUrl = 'https://inventory.xboxlive.com'
  const xboxMarkeplaceUrl = 'https://eds.xboxlive.com'


  const USER_AGENT = [
    'Mozilla/5.0 (XboxReplay; XboxLiveAPI/3.0)',
    'AppleWebKit/537.36 (KHTML, like Gecko)',
    'Chrome/71.0.3578.98 Safari/537.36',
  ].join(' ')

  const setHeaders = (userHash, XSTSToken) => {
    return {
      'x-xbl-contract-version': 3.2,
      'x-xbl-client-version': '1.0',
      'x-xbl-parent-ig': 'randomText',
      'x-xbl-device-type': 'NodeJS',
      Authorization: `XBL3.0 x=${userHash};${XSTSToken}`,
      Accept: 'application/json',
      'Accept-encoding': 'gzip',
      'Accept-Language': 'en-US',
      'User-Agent': USER_AGENT,

    }
  }

  const getGame = async (id, { userHash, XSTSToken }) => {
    console.log("####### GETTING GAME #######")
    try {
      const headers = setHeaders(userHash, XSTSToken)
      const response = await axios.default.get(`${xboxMarkeplaceUrl}/inventory/${id}`, { headers })
      console.log({ response })
      return response
    } catch (e) {
      console.log("ERROR", { e })
    }
  }

  const getGames = async ({ userHash, XSTSToken }) => {
    console.log("####### GETTING GAMES #######")
    try {
      const headers = setHeaders(userHash, XSTSToken)
      const response = await axios.default.get(`${xboxMarkeplaceUrl}/media/all/browse`, { headers })
      console.log({ response })
      return response
    } catch (e) {
      console.log("ERROR", { e })
      return false
    }
  }

  return { getGame, getGames }
}

module.exports = XboxLiveAPI()