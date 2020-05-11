module.exports = function (context, req) {
  const mongoose = require('mongoose')

  const eshop = require('nintendo-switch-eshop')

  const axios = require('axios').default

  const { xml2json } = require('xml-js')

  const CJProduct = require('../CJ/db/models/product')
  const { EUNintendo, USNintendo } = require('../NintendoShop/db/models/nintendo')

  const db = mongoose.connection

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  const cjBaseUrl = 'https://product-search.api.cj.com/v2/product-search'

  let params = {
    'website-id': process.env.CJ_WEBSITE_ID,
    'advertiser-ids': 'joined',
    keywords: '',
    currency: 'USD',
    'records-per-page': 1000,
    'page-number': 1
  }

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
    saveNintendoData()
    console.log("Here!")
  })

  const saveNintendoData = async () => {
    let usGames = await eshop.getGamesAmerica()
    usGames = usGames.map(us => {
      const price = parseInt((us.msrp * 100).toFixed(0))
      return { ...us, slug: slugify(us.title), price: !isNaN(price) ? price : 0 }
    })
    let euGames = await eshop.getGamesEurope()
    euGames = euGames.map(eu => {
      const price = parseInt((eu.price_regular_f * 100).toFixed(0))
      return { ...eu, slug: slugify(eu.title), price: !isNaN(price) ? price : 0 }
    })
    for (const us of usGames) {
      process.stdout.write(`Upating US Games ${usGames.indexOf(us)} / ${usGames.length} \r`)
      await USNintendo.updateOne({ slug: us.slug }, us, { upsert: true })
    }
    for (const eu of euGames) {
      process.stdout.write(`Upating EU Games ${euGames.indexOf(eu)} / ${euGames.length} \r`)
      await EUNintendo.updateOne({ slug: eu.slug }, eu, { upsert: true })
    }
  }

  const saveCJProducts = async (loadMore = false) => {
    try {
      const data = await processCJData(loadMore)
      if (data && data.length > 0) {
        for (let d of data) {
          process.stdout.write(`Upating ${data.indexOf(d)} / ${data.length} \r`)
          await CJProduct.updateOne({ slug: d.slug, advertiser_id: d.advertiser_id }, d, { upsert: true })
        }
        lastBatch = data.length
        if (lastBatch > 0) {
          saveCJProducts(true)
        }
      } else {
        console.log("Process Done without errors :D")
        return context.res = {
          body: { success: true }
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
      console.log("JSON Results", jsonResults.length)
      const parsedData = jsonResults.map((x) => ({
        ad_id: x['ad-id'] ? x['ad-id']._text : null,
        advertiser_category: x['advertiser-category'] ? x['advertiser-category']._text : null,
        advertiser_id: x['advertiser-id'] ? x['advertiser-id']._text : null,
        advertiser_name: x['advertiser-name'] ? x['advertiser-name']._text : null,
        buy_url: x['buy-url'] ? x['buy-url']._text : null,
        catalog_id: x['catalog-id'] ? x['catalog-id']._text : null,
        currency: x.currency ? x.currency._text : null,
        description: x.description ? x.description._text : null,
        image_url: x['image-url'] ? x['image-url']._text : null,
        in_stock: x['in-stock'] ? x['in-stock']._text : null,
        name: x.name ? x.name._text : null,
        price: x.price ? parseInt((parseFloat(x.price._text) * 100).toFixed(0)) : null,
        sale_price: x['sale-price'] ? parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0)) : null,
        sku: x.sku ? x.sku._text : null,
        slug: slugify(x.name._text),
      }))
      console.log("JSON Parsed", parsedData.length)
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
      const response = await axios.get(cjBaseUrl, { headers, params })
      return response
    } catch (e) {
      throw new Error(e)
    }
  }

}