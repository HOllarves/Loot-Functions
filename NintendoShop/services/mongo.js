const Mongo = () => {
  const models = require('../db/models/nintendo')
  const slugDict = require('../slug-dict/slug-dict')
  const DBQuery = require('../../DB/client')
  const search = async (region = 'US', q) => {
    const model = region === 'US' ? models.USNintendo : models.EUNintendo
    const { slug } = slugDict({ slug: q })
    const data = await DBQuery(model.findOne({ slug }))
    if (data) {
      return data
    }
    return null
  }
  const all = async (region = 'US') => {
    const model = region === 'US' ? models.USNintendo : models.EUNintendo
    const data = await DBQuery(model.find())
    if (data) {
      return data
    }
    return null
  }
  return { search, all }
}

module.exports = Mongo()
