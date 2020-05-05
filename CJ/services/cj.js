const axios = require('axios')
const { parseStringPromise } = require('xml2js')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

const CJProducts = () => {
  const baseUrl = 'https://product-search.api.cj.com/v2/product-search'
  const search = async (name, currency = 'USD') => {
    const response = await axios.default.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${process.env.CJ_TOKEN}`,
      },
      params: {
        'website-id': process.env.CJ_WEBSITE_ID,
        'advertiser-ids': 'joined',
        keywords: name,
        currency,
        'records-per-page': 5,
      },
    })
    const { data } = response
    if (data) {
      const jsonData = await parseStringPromise(data)
      const results = jsonData['cj-api'].products[0].product
      return results.map((r) => (
        {
          ad_id: r['ad-id'][0],
          advertiser_category: r['advertiser-category'][0],
          advertiser_id: r['advertiser-id'][0],
          advertiser_name: r['advertiser-name'][0],
          buy_url: r['buy-url'][0],
          catalog_id: r['catalog-id'][0],
          currency: r.currency[0],
          description: r.description[0],
          image_url: r['image-url'][0],
          in_stock: r['in-stock'][0],
          name: r.name[0],
          price: r.price[0],
          sale_price: r['sale-price'][0],
          sku: r.sku[0],
          slug: slugify(r.name[0]),
        }
      ))
    }
    return false
  }
  return { search }
}
module.exports = CJProducts()
