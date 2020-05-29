const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

// eslint-disable-next-line no-unused-vars
const textIndex = {
  type: String, index: true, required: true, text: true,
}
const typeIndex = { type: String, index: true, required: true }
const requiredTypeString = { type: String, required: true }
const lastUpdate = { type: Date, default: Date.now }

const InstantGamingSchema = new mongoose.Schema({
  name: requiredTypeString,
  price: requiredTypeString,
  slug: typeIndex,
  currency: requiredTypeString,
  lastUpdate,
})

module.exports = mongoose.model('EpicGame', InstantGamingSchema)
