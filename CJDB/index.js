module.exports = async function (context, myTimer) {
  const mongoose = require('mongoose')

  const axios = require('axios').default

  const { xml2json } = require('xml-js')

  const CJProduct = require('../CJ/db/models/product')

  const db = mongoose.connection

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  const cjBaseUrl = 'https://product-search.api.cj.com/v2/product-search'

  let params = {
    'website-id': process.env.CJ_WEBSITE_ID,
    'advertiser-ids': 'joined',
    keywords: '',
    currency: '',
    'records-per-page': 1000,
    'page-number': 1
  }

  const regions = ['EU', 'US']
  const platforms = ['PC', 'Xbox One', 'Nintendo Switch', 'PS4']
  const gameType = ['DLC', 'Season Pass', 'Full']
  const methods = ['Steam Gift', 'Steam Altergift', 'CD Key']
  const nameRegex = /Steam\ CD\ Key|Steam\ Gift|Steam\ Altergift|Steam|Altergift|Uplay\ CD\ Key|Uplay|Origin\ CD\ Key|Origin|Epic\ Games\ CD\ Key|Epic\ Games|XBOX\ ONE\ CD\Key|Xbox\ One\ CD\ Key|XBOX\ ONE|Xbox\ One|PS4\ CD\ Key|PS4|ps4|EU|US|Season\ Pass|CD \Key/gi

  let totalGames = 0

  let headers = {
    Authorization: `Bearer ${process.env.CJ_TOKEN}`
  }

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

  let lastBatch = null

  db.once('open', async () => {
    saveCJProducts()
  })

  const saveCJProducts = async (loadMore = false) => {
    try {
      const data = await processCJData(loadMore)
      if (data && data.length > 0) {
        for (let d of data) {
          process.stdout.write(`Upating ${data.indexOf(d)} / ${data.length} \r`)
          await CJProduct.updateOne({ ad_id: d.ad_id }, d, { upsert: true })
        }
        lastBatch = data.length
        if (lastBatch > 0) {
          saveCJProducts(true)
        }
      } else {
        console.log("Process Done without errors :D")
        console.log("Games updated/created: ", totalGames)
        return context.res = {
          body: { success: true, totalGames }
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  const processCJData = async (loadMore) => {
    const xmlData = await loadCJData(loadMore)
    const { data } = xmlData
    const jsonData = xml2json(data, { compact: true, spaces: 4 })
    const jsonResults = JSON.parse(jsonData)['cj-api'].products.product
    if (jsonResults && jsonResults.length > 0) {
      totalGames += jsonResults.length
      const parsedData = jsonResults.map((x) => {

        const advertiserName = x['advertiser-name'] && x['advertiser-name']._text ? x['advertiser-name']._text : null
        let name = x.name && x.name._text ? x.name._text : null
        let type = gameType.find(g => name.includes(g)) || 'Full'

        if (advertiserName === 'Kinguin') {
          const platform = platforms.find(p => {
            if (p === "PC") {
              return name.match(/Steam|Epic\ Games|Origin|Uplay/gi)
            }
            if (p === "Xbox One") {
              return name.match(/Xbox|Xbox One/gi)
            }
            return name.includes(p)
          })
          const region = regions.find(r => name.includes(r))
          const method = methods.find(m => name.includes(m))
          name = name.replace(nameRegex, "").trim()
          console.log({ name, type, region, platform })

          return {
            ad_id: x['ad-id'] && x['ad-id']._text ?
              x['ad-id']._text : null,

            advertiser_category: x['advertiser-category'] && x['advertiser-category']._text ?
              x['advertiser-category']._text : null,

            advertiser_id: x['advertiser-id'] && x['advertiser-id']._text ?
              x['advertiser-id']._text : null,

            advertiser_name: advertiserName,

            buy_url: x['buy-url'] && x['buy-url']._text ?
              x['buy-url']._text : null,

            catalog_id: x['catalog-id'] && x['catalog-id']._text ?
              x['catalog-id']._text : null,

            currency: x.currency && x.currency._text ?
              x.currency._text : null,

            description: x.description && x.description._text ?
              x.description._text : null,

            image_url: x['image-url'] && x['image-url']._text ?
              x['image-url']._text : null,

            in_stock: x['in-stock'] && x['in-stock']._text ?
              x['in-stock']._text : null,

            name,

            platform,

            type,

            region,

            method,

            price: x.price && x.price._text ?
              parseInt((parseFloat(x.price._text) * 100).toFixed(0)) : null,

            sale_price: x['sale-price'] && x['sale-price']._text ?
              parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0)) : null,

            sku: x.sku && x.sku._text ?
              x.sku._text : null,

            slug: slugify(name),

            last_update: new Date()
          }
        }
        if (advertiserName === 'GamersGate.com') {
          return {
            ad_id: x['ad-id'] && x['ad-id']._text ?
              x['ad-id']._text : null,

            advertiser_category: x['advertiser-category'] && x['advertiser-category']._text ?
              x['advertiser-category']._text : null,

            advertiser_id: x['advertiser-id'] && x['advertiser-id']._text ?
              x['advertiser-id']._text : null,

            advertiser_name: advertiserName,
            buy_url: x['buy-url'] && x['buy-url']._text ?
              x['buy-url']._text : null,

            catalog_id: x['catalog-id'] && x['catalog-id']._text ?
              x['catalog-id']._text : null,

            currency: x.currency && x.currency._text ?
              x.currency._text : null,

            description: x.description && x.description._text ?
              x.description._text : null,

            image_url: x['image-url'] && x['image-url']._text ?
              x['image-url']._text : null,

            in_stock: x['in-stock'] && x['in-stock']._text ?
              x['in-stock']._text : null,

            platform: 'PC',

            name,

            type,

            method: 'CD Key',

            price: x.price && x.price._text ?
              parseInt((parseFloat(x.price._text) * 100).toFixed(0)) : null,

            sale_price: x['sale-price'] && x['sale-price']._text ?
              parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0)) : null,

            sku: x.sku && x.sku._text ?
              x.sku._text : null,

            slug: slugify(name),

            last_update: new Date()
          }
        }
        return {
          ad_id: x['ad-id'] && x['ad-id']._text ?
            x['ad-id']._text : null,

          advertiser_category: x['advertiser-category'] && x['advertiser-category']._text ?
            x['advertiser-category']._text : null,

          advertiser_id: x['advertiser-id'] && x['advertiser-id']._text ?
            x['advertiser-id']._text : null,

          advertiser_name: advertiserName,
          buy_url: x['buy-url'] && x['buy-url']._text ?
            x['buy-url']._text : null,

          catalog_id: x['catalog-id'] && x['catalog-id']._text ?
            x['catalog-id']._text : null,

          currency: x.currency && x.currency._text ?
            x.currency._text : null,

          description: x.description && x.description._text ?
            x.description._text : null,

          image_url: x['image-url'] && x['image-url']._text ?
            x['image-url']._text : null,

          in_stock: x['in-stock'] && x['in-stock']._text ?
            x['in-stock']._text : null,

          name,

          platform: null,

          type,

          method: 'CD Key',

          price: x.price && x.price._text ?
            parseInt((parseFloat(x.price._text) * 100).toFixed(0)) : null,

          sale_price: x['sale-price'] && x['sale-price']._text ?
            parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0)) : null,

          sku: x.sku && x.sku._text ?
            x.sku._text : null,

          slug: slugify(x.name._text),
          last_update: new Date()
        }
      })
      return parsedData
    }
    return []
  }
  const loadCJData = async (loadMore) => {
    try {
      if (loadMore) {
        params['page-number'] += 1
      }
      console.log('Page #', params['page-number'])
      console.log('Total Game #', totalGames)
      const response = await axios.get(cjBaseUrl, { headers, params })
      return response
    } catch (e) {
      throw new Error(e)
    }
  }
};