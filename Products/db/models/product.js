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
const typeBool = { type: Boolean }
const lastUpdate = { type: Date, default: Date.now }

const cjProductSchema = new mongoose.Schema({
  ad_id: typeIndex,
  advertiser_category: typeString,
  advertiser_id: requiredTypeString,
  advertiser_name: typeIndex,
  buy_url: requiredTypeString,
  catalog_id: requiredTypeString,
  currency: requiredTypeString,
  image_url: typeString,
  in_stock: typeBool,
  name: requiredTypeString,
  price: typeNum,
  sale_price: typeNum,
  platform: typeString,
  region: typeString,
  type: typeString,
  method: typeString,
  sku: typeIndex,
  slug: typeIndex,
  last_update: lastUpdate,
})

module.exports = mongoose.model('CJProduct', cjProductSchema)
