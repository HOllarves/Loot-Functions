/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
const axios = require('axios')
const { xml2json } = require('xml-js')

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

    const advertiserIds = process.env.CJ_ADVERTISER_IDS.split(',').filter((x) => x)
    const promises = []
    const results = []

    advertiserIds.forEach((a) => {
      promises.push(
        axios.default.get(baseUrl, {
          headers: {
            Authorization: `Bearer ${process.env.CJ_TOKEN}`,
          },
          params: {
            'website-id': process.env.CJ_WEBSITE_ID,
            'advertiser-ids': a,
            keywords: name,
            currency,
            'records-per-page': 5,
          },
        }),
      )
    })

    const responses = await Promise.all(promises)

    responses.forEach((r) => {
      const { data } = r
      const jsonData = xml2json(data, { compact: true, spaces: 4 })
      const result = JSON.parse(jsonData)['cj-api'].products.product
      results.push(
        result.map((x) => ({
          ad_id: x['ad-id'] ? x['ad-id']._text : null,
          advertiser_category: x['advertiser-category'] ? x['advertiser-category']._text : null,
          advertiser_id: x['advertiser-id'] ? x['advertiser-id']._text : null,
          advertiser_name: x['advertiser-name'] ? x['advertiser-name']._text : null,
          buy_url: x['buy-url'] ? x['buy-url']._text : null,
          catalog_id: x['catalog-id'] ? x['catalog-id']._text : null,
          currency: x.currency ? x.currency._text : null,
          description: r.description ? r.description._text : null,
          image_url: x['image-url'] ? x['image-url']._text : null,
          in_stock: x['in-stock'] ? x['in-stock']._text : null,
          name: x.name ? x.name._text : null,
          price: x.price ? x.price._text : null,
          sale_price: x['sale-price'] ? x['sale-price']._text : null,
          sku: x.sku ? x.sku._text : null,
          slug: slugify(x.name._text),
        })).find((f) => f.slug === name),
      )
    })
    return results
  }
  return { search }
}
module.exports = CJProducts()
