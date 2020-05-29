const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const typeString = { type: String }
// eslint-disable-next-line no-unused-vars
const textIndex = {
  type: String, index: true, required: true, text: true,
}
const typeIndex = { type: String, index: true, required: true }
const typeNum = { type: Number }
const requiredTypeString = { type: String, required: true }
const lastUpdate = { type: Date, default: Date.now }

const IndieGalaGameSchema = new mongoose.Schema({
  name: typeString,
  buy_url: requiredTypeString,
  advertiser_name: requiredTypeString,
  platform: requiredTypeString,
  price: typeNum,
  sale_price: typeNum,
  currency: requiredTypeString,
  slug: typeIndex,
  lastUpdate,
})

module.exports = mongoose.model('IndieGalaGame', IndieGalaGameSchema)
