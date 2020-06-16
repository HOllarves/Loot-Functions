const Mongo = () => {
  const CJ = require('../db/models/product')
  const IG = require('../db/models/instant-gaming')
  const IndieGala = require('../db/models/indie-gala-game')
  const GameBillet = require('../db/models/game-billet')
  // const { search: CJSearch } = require('./cj')
  /**
   * Returns a specific product in
   * each partner
   * @param {String} name
   * @param {String} currency
   */
  const search = async (name, { currency, platform, region }, type = /Full/i) => {
    const client = await require('../../DB/client').startDB()
    // const advertiserIds = process.env.CJ_ADVERTISER_IDS.split(',').filter((a) => a)
    const query = { slug: name, type }
    if (currency) query.currency = currency
    if (platform) query.platform = platform
    if (region) query.$or = [{ region }, { region: 'Worldwide' }, { region: null }]
    const promises = [CJ.find(query), IG.find(query), IndieGala.find(query), GameBillet.find(query)]
    let [cjData, igData, indieGData, gameBilletData] = await Promise.all(promises)
    // eslint-disable-next-line no-underscore-dangle
    if (igData && igData.length) { igData = igData.map((i) => ({ ...i._doc, advertiser_name: 'Instant Gaming' })) }
    const data = [...cjData, ...igData, ...indieGData, ...gameBilletData]
      .sort((a, b) => {
        const priceA = a.sale_price || a.price
        const priceB = b.sale_price || b.price
        return priceA - priceB
      })
      .reduce((prev, curr) => {
        const advertiserIn = prev.find((p) => p.advertiser_name === curr.advertiser_name)
        const advertiserIndex = prev.indexOf(advertiserIn)
        if (!advertiserIn || advertiserIndex === -1) {
          prev.push(curr)
          return prev
        }
        const lowestPrice = advertiserIn.sale_price || advertiserIn.price
        const newPrice = curr.sale_price || curr.price
        if (newPrice < lowestPrice) {
          prev.splice(advertiserIndex, 1)
          prev.push(curr)
          return prev
        }
        return prev
      }, [])
    await client.close()
    if (data && data.length > 0) {
      return data
    }
    return null
  }
  /**
   * Returns 10 products of each partner
   * @param {String} currency
   */
  const searchByPartner = async (currency = 'USD') => {
    const client = await require('../db/client').startDB()
    const advertiserIds = process.env.CJ_ADVERTISER_IDS.split(',').filter((a) => a)
    const promises = advertiserIds.map((id) => (
      CJ.find({ currency, advertiser_id: id }).limit(10)))
    const data = (await Promise.all(promises)).flat()
    client.close()
    if (data) {
      return data
    }
    return null
  }
  return { search, searchByPartner }
}

module.exports = Mongo()
