const Mongo = () => {
  const models = require('../db/models/nintendo')
  const slugDict = require('../slug-dict/slug-dict')
  const search = async (region = 'US', q) => {
    const client = await require('../../DB/client').startDB()
    const model = region === 'US' ? models.USNintendo : models.EUNintendo
    const { slug } = slugDict({ slug: q })
    const data = await model.findOne({ slug })
    client.close()
    if (data) {
      return data
    }
    return null
  }
  const all = async (region = 'US') => {
    const client = await require('../db/client').startDB()
    const model = region === 'US' ? models.USNintendo : models.EUNintendo
    const data = await model.find()
    client.close()
    if (data) {
      return data
    }
    return null
  }
  return { search, all }
}

module.exports = Mongo()
