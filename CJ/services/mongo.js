const Mongo = () => {
  const model = require('../db/models/product')
  // const { search: CJSearch } = require('./cj')
  /**
   * Returns a specific product in
   * each partner
   * @param {String} name
   * @param {String} currency
   */
  const search = async (name, { currency = 'USD', platform }) => {
    const client = await require('../db/client').startDB()
    const advertiserIds = process.env.CJ_ADVERTISER_IDS.split(',').filter((a) => a)
    const query = { slug: name, currency }
    if (platform) query.$or = [{ platform }, { platform: null }]
    const promises = advertiserIds.map((id) => {
      query.advertiser_id = id
      return model.findOne(query)
    })
    const data = (await Promise.all(promises)).filter((d) => d)
    client.close()
    if (data && data.length > 0) {
      return data
    }
    // const cjLive = await CJSearch(name)
    // if (cjLive) {
    //   return cjLive
    // }
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
      model.find({ currency, advertiser_id: id }).limit(10)))
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
