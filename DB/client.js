const mongoose = require('mongoose')

const db = mongoose.connection

const startDB = async () => {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  return new Promise((resolve) => {
    db.once('open', () => {
      resolve(db)
    })
  })
}

const stopDB = async () => db.close()

module.exports = { startDB, stopDB }
