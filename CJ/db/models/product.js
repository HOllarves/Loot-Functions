const mongoose = require('mongoose')

const typeString = { type: String }
const textIndex = {
  type: String, index: true, required: true, text: true,
}
const typeIndex = { type: String, index: true, required: true }
const typeNum = { type: Number }
const requiredTypeString = { type: String, required: true }
const typeBool = { type: Boolean }

const cjProductSchema = new mongoose.Schema({
  ad_id: requiredTypeString,
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
  sku: typeString,
  slug: textIndex,
})

module.exports = mongoose.model('CJProduct', cjProductSchema)
