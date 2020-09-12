const Mongo = () => {
  const GOG = require('../db/models/gog')
  const DBQuery = require('../../DB/client')
  const search = async (slug) => {
    const data = await DBQuery(GOG.findOne({ slug }))
    if (data) {
      return data
    }
    return null
  }
  return { search }
}

module.exports = Mongo()
