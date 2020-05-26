const mongoose = require('mongoose')

const db = mongoose.connection

const startDB = async () => {
  mongoose.connect('mongodb+srv://admin:mIzBkwXxUuOCA2bB@lootengine-mgkmg.azure.mongodb.net/lootdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  return new Promise((resolve) => {
    db.once('open', () => {
      resolve(db)
    })
  })
}

const stopDB = async () => db.close()

module.exports = { startDB, stopDB }
