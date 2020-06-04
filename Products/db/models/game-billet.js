const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const typeString = { type: String }
const typeIndex = { type: String, index: true, required: true }
const typeNum = { type: Number }
const requiredTypeString = { type: String, required: true }
const lastUpdate = { type: Date, default: Date.now }

const GameBilletSchema = new mongoose.Schema({
  name: typeString,
  method: typeString,
  type: typeString,
  buy_url: requiredTypeString,
  advertiser_name: requiredTypeString,
  currency: requiredTypeString,
  platform: requiredTypeString,
  price: typeNum,
  slug: typeIndex,
  last_update: lastUpdate,
})

module.exports = mongoose.model('GameBilletGame', GameBilletSchema)
