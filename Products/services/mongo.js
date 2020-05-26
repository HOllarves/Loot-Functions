const Mongo = () => {
  const CJ = require('../db/models/product')
  const IG = require('../db/models/instant-gaming')
  // const { search: CJSearch } = require('./cj')
  /**
   * Returns a specific product in
   * each partner
   * @param {String} name
   * @param {String} currency
   */
  const search = async (name, { currency, platform, region }) => {
    const client = await require('../db/client').startDB()
    // const advertiserIds = process.env.CJ_ADVERTISER_IDS.split(',').filter((a) => a)
    const query = { slug: name }
    if (currency) query.currency = currency
    if (platform) query.platform = platform
    if (region) query.region = region
    const promises = [CJ.find(query), IG.find(query)]
    let [cjData, igData] = await Promise.all(promises)
    if (igData && igData.length) {
      igData = igData.map((i) => ({ ...i, advertiser_name: 'Instant Gaming' }))
    }
    const data = cjData.concat(igData)
    client.close()
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
