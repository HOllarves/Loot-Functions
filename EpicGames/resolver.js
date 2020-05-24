const { getUSPrice, getEUPrice } = require('./priceScraper')

module.exports = {
  Query: {
    USPrice: (parent, args) => getUSPrice(args.url, true),
    EUPrice: (parent, args) => getEUPrice(args.url),
  },
}
