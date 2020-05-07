const Mongo = () => {
  const model = require('../db/models/product')
  const search = async (name, currency = 'USD') => {
    const client = await require('../db/client').startDB()
    const data = await model.findOne({ slug: name, currency })
    client.close()
    if (data) {
      return data
    }
    return null
  }
  return { search }
}

module.exports = Mongo()
