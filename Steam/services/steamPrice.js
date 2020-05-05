const axios = require('axios')

const SteamPricing = () => {
  // Steam Market API base url
  const steamMarketUrl = 'http://store.steampowered.com/api/appdetails'

  const getUsPrice = async (appId) => {
    try {
      const response = await axios.default.get(steamMarketUrl, { params: { appids: appId, cc: 'us' } })
      if (!response.data) { throw new Error('No app was found') }
      const game = response.data[appId]
      return game.data.price_overview.final
    } catch (e) {
      return { error: e }
    }
  }

  return { getUsPrice }
}
module.exports = SteamPricing()