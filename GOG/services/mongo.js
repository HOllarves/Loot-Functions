const Mongo = () => {
  const GOG = require('../db/models/gog')
  const search = async (slug) => {
    const client = await require('../../DB/client').startDB()
    const data = await GOG.findOne({ slug })
    client.close()
    if (data) {
      return data
    }
    return null
  }
  return { search }
}

module.exports = Mongo()
