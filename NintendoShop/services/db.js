const ForerunnerDB = require('forerunnerdb')

const fdb = new ForerunnerDB()

/**
 * Simple document based DB factory
 */
const JSONDB = () => {
  const db = fdb.db('nintendo_games')
  db.persist.dataDir('./')
  /**
   * Search the DB
   * @param {String} region
   * @param {String} q - query
   */
  const search = (region, q) => {
    const collection = db.collection(region)
    let game = collection.find({
      title: q,
    })
    if (!game || game.length === 0) {
      const regex = new RegExp(q, 'i')
      game = collection.find({
        title: regex,
      })
      return game[0]
    }
    return game[0]
  }
  /**
   * Returns all documents
   * @param {String} region 
   */
  const all = async (region) => {
    const collection = db.collection(region)
    return collection.find()
  }
  /**
   * Saves documents to DB
   * @param {String} region
   * @param {Array} data
   */
  const saveData = async (region, data) => {
    const collection = db.collection(region)
    return collection.insert(data)
  }
  return { all, search, saveData }
}

module.exports = JSONDB()
