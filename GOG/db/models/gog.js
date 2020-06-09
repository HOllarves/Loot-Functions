const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const typeString = { type: String }
const typeIndex = { type: String, index: true, required: true }
const typeNum = { type: Number }
const requiredTypeString = { type: String, required: true }
const lastUpdate = { type: Date, default: Date.now }
const typeBool = { type: Boolean }

const GogGameSchema = new mongoose.Schema({
  developer: typeString,
  publisher: typeString,
  gallery: [typeString],
  video: {
    id: typeString,
    provider: typeString,
  },
  supportedOperatingSystems: [typeString],
  genres: [typeString],
  globalReleaseDate: typeNum,
  isTBA: typeBool,
  price: requiredTypeString,
  isDiscounted: typeBool,
  id: typeNum,
  releaseDate: typeNum,
  name: requiredTypeString,
  image: typeString,
  platform: typeString,
  slug: typeIndex,
  currency: requiredTypeString,
  last_update: lastUpdate,
})

module.exports = mongoose.model('GOGame', GogGameSchema)