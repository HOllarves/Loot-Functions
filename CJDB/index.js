/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable func-names */
/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */

module.exports = async function () {
  const mongoose = require('mongoose')

  const axios = require('axios').default

  const { xml2json } = require('xml-js')

  const cjBaseUrl = 'https://product-search.api.cj.com/v2/product-search'

  const headers = {
    Authorization: `Bearer ${process.env.CJ_TOKEN}`,
  }

  class MainConfig {
    constructor() {
      this.min = 0
      this.max = 100
      this.step = 1
      this.advertisers = process.env.CJ_ADVERTISER_IDS.split(',')
      this.cjCurrencies = ['USD', 'EUR']
      this.currentAdvertiser = this.advertisers[0]
      this.currentCurrency = this.cjCurrencies[0]
      this.currentLow = -1
      this.currentHigh = 0
      this.currentPage = 1
      this.websiteId = process.env.CJ_WEBSITE_ID
      this.totalResults = 0
      this.totalGames = 0
      this.newGames = 0
      this.updatedGames = 0
    }

    nextPage() {
      if (this.totalResults < 1000) {
        this.currentPage = 1
        this.currentLow = this.currentHigh
        this.currentHigh += this.step
      } else {
        this.currentPage += 1
      }
    }

    reset() {
      this.currentLow = 0
      this.currentHigh = 1
      const nextCurrency = this.cjCurrencies.indexOf(this.currentCurrency) + 1
      if (this.cjCurrencies[nextCurrency]) {
        this.currentCurrency = this.cjCurrencies[nextCurrency]
      } else {
        const nextAdvertiser = this.advertisers.indexOf(this.currentAdvertiser) + 1
        if (this.advertisers[nextAdvertiser]) {
          this.currentAdvertiser = this.advertisers[nextAdvertiser]
          this.currentCurrency = this.cjCurrencies[0]
        } else {
          console.log('Done!')
          console.log({
            totalGames: this.totalGames, newGames: this.newGames, updatedGames: this.updatedGames,
          })
          process.exit(0)
        }
      }
    }

    getParams() {
      return {
        'website-id': this.websiteId,
        'advertiser-ids': this.currentAdvertiser,
        keywords: '',
        'low-price': this.currentLow,
        'high-price': this.currentHigh,
        currency: this.currentCurrency,
        'records-per-page': 1000,
        'page-number': this.currentPage,
      }
    }
  }

  const mainConfig = new MainConfig()

  const CJProduct = require('../CJ/db/models/product')

  const db = mongoose.connection

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  const regions = ['EU', 'US', 'EMEA']
  const platforms = ['PC', 'Xbox One', 'Nintendo Switch', 'PS4']
  const gameType = ['DLC', 'Season Pass', 'Full', 'Pre-Order']
  const methods = ['Steam Gift', 'Steam Altergift', 'CD Key']
  const nameRegex = /Steam CD Key|Steam Gift|Steam Altergift|Steam|GOG CD Key|GOG|Altergift|Uplay CD Key|Uplay|Origin CD Key|Origin|Epic Games CD Key|Epic Games|XBOX ONE CDKey|Xbox One CD Key|XBOX ONE|Xbox One|PS4 CD Key|PS4|ps4|EU|US|EMEA|Season Pass|CD Key|Digital Download|Digital|Download|Rockstar|Bethesda|Pre-Order|Pre Order|Windows 10|Windows|10|DLC|CD/gi


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
  let retries = 0
  // eslint-disable-next-line consistent-return
  const loadCJData = async (loadMore) => {
    try {
      console.log({ loadMore })
      if (!loadMore && mainConfig.currentHigh > mainConfig.max) {
        mainConfig.reset()
      } else {
        mainConfig.nextPage()
      }
      const params = mainConfig.getParams()
      console.log('Page #', params['page-number'])
      console.log({ params, mainConfig, totalGames: mainConfig.totalGames })
      const response = await axios.get(cjBaseUrl, { headers, params })
      retries = 0
      return response
    } catch (e) {
      console.log(e)
      if (retries < 10) {
        retries++
        console.log({ retries })
        return loadCJData(loadMore)
      }
    }
  }

  const processCJData = async (loadMore) => {
    const xmlData = await loadCJData(loadMore)
    const { data = [] } = xmlData
    const jsonData = xml2json(data, { compact: true, spaces: 4 })

    const jsonResults = JSON.parse(jsonData)['cj-api'].products
    mainConfig.totalResults = jsonResults._attributes['records-returned']

    if (jsonResults.product && jsonResults.product.length > 0) {
      const parsedData = jsonResults.product.map((x) => {
        const advertiserName = x['advertiser-name'] && x['advertiser-name']._text ? x['advertiser-name']._text : null
        let name = x.name && x.name._text ? x.name._text : null
        const type = gameType.find((g) => name.toLowerCase().includes(g.toLowerCase())) || 'full'
        if (advertiserName === 'Kinguin') {
          const platform = platforms.find((p) => {
            if (p === 'PC') {
              return name.match(/Steam|Epic Games|Origin|Uplay|Windows 10/gi)
            }
            if (p === 'Xbox One') {
              return name.match(/Xbox|Xbox One/gi)
            }
            return name.includes(p)
          })
          const region = regions.find((r) => name.toLowerCase().includes(r.toLowerCase()))
          const method = methods.find((m) => name.toLowerCase().includes(m.toLowerCase()))
          name = name.replace(nameRegex, '').trim()
          return {
            ad_id: x['ad-id'] && x['ad-id']._text
              ? x['ad-id']._text : null,

            advertiser_category: x['advertiser-category'] && x['advertiser-category']._text
              ? x['advertiser-category']._text : null,

            advertiser_id: x['advertiser-id'] && x['advertiser-id']._text
              ? x['advertiser-id']._text : null,

            advertiser_name: advertiserName,

            buy_url: x['buy-url'] && x['buy-url']._text
              ? x['buy-url']._text : null,

            catalog_id: x['catalog-id'] && x['catalog-id']._text
              ? x['catalog-id']._text : null,

            currency: x.currency && x.currency._text
              ? x.currency._text : null,

            description: x.description && x.description._text
              ? x.description._text : null,

            image_url: x['image-url'] && x['image-url']._text
              ? x['image-url']._text : null,

            in_stock: x['in-stock'] && x['in-stock']._text
              ? x['in-stock']._text : null,

            name,

            platform,

            type,

            region,

            method,

            price: x.price && x.price._text
              ? parseInt((parseFloat(x.price._text) * 100).toFixed(0), 10) : null,

            sale_price: x['sale-price'] && x['sale-price']._text
              ? parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0), 10) : null,

            sku: x.sku && x.sku._text
              ? x.sku._text : null,

            slug: slugify(name),

            last_update: new Date(),
          }
        }
        if (advertiserName === 'GamersGate.com') {
          return {
            ad_id: x['ad-id'] && x['ad-id']._text
              ? x['ad-id']._text : null,

            advertiser_category: x['advertiser-category'] && x['advertiser-category']._text
              ? x['advertiser-category']._text : null,

            advertiser_id: x['advertiser-id'] && x['advertiser-id']._text
              ? x['advertiser-id']._text : null,

            advertiser_name: advertiserName,
            buy_url: x['buy-url'] && x['buy-url']._text
              ? x['buy-url']._text : null,

            catalog_id: x['catalog-id'] && x['catalog-id']._text
              ? x['catalog-id']._text : null,

            currency: x.currency && x.currency._text
              ? x.currency._text : null,

            description: x.description && x.description._text
              ? x.description._text : null,

            image_url: x['image-url'] && x['image-url']._text
              ? x['image-url']._text : null,

            in_stock: x['in-stock'] && x['in-stock']._text
              ? x['in-stock']._text : null,

            platform: 'PC',

            name,

            type,

            method: 'CD Key',

            price: x.price && x.price._text
              ? parseInt((parseFloat(x.price._text) * 100).toFixed(0), 10) : null,

            sale_price: x['sale-price'] && x['sale-price']._text
              ? parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0), 10) : null,

            sku: x.sku && x.sku._text
              ? x.sku._text : null,

            slug: slugify(name),

            last_update: new Date(),
          }
        }
        return {
          ad_id: x['ad-id'] && x['ad-id']._text
            ? x['ad-id']._text : null,

          advertiser_category: x['advertiser-category'] && x['advertiser-category']._text
            ? x['advertiser-category']._text : null,

          advertiser_id: x['advertiser-id'] && x['advertiser-id']._text
            ? x['advertiser-id']._text : null,

          advertiser_name: advertiserName,
          buy_url: x['buy-url'] && x['buy-url']._text
            ? x['buy-url']._text : null,

          catalog_id: x['catalog-id'] && x['catalog-id']._text
            ? x['catalog-id']._text : null,

          currency: x.currency && x.currency._text
            ? x.currency._text : null,

          description: x.description && x.description._text
            ? x.description._text : null,

          image_url: x['image-url'] && x['image-url']._text
            ? x['image-url']._text : null,

          in_stock: x['in-stock'] && x['in-stock']._text
            ? x['in-stock']._text : null,

          name,

          platform: null,

          type,

          method: 'CD Key',

          price: x.price && x.price._text
            ? parseInt((parseFloat(x.price._text) * 100).toFixed(0), 10) : null,

          sale_price: x['sale-price'] && x['sale-price']._text
            ? parseInt((parseFloat(x['sale-price']._text) * 100).toFixed(0), 10) : null,

          sku: x.sku && x.sku._text
            ? x.sku._text : null,

          slug: slugify(x.name._text),
          last_update: new Date(),
        }
      })
      return parsedData
    }
    return []
  }

  const saveCJProducts = async (loadMore = true) => {
    try {
      const data = await processCJData(loadMore)
      lastBatch = data.length
      if (data && lastBatch > 0) {
        for (const d of data) {
          process.stdout.write(`Upating ${data.indexOf(d)} / ${data.length} \r`)
          const doc = await CJProduct.findOneAndUpdate({ sku: d.sku, currency: d.currency }, d, { upsert: true })
          if (doc) { mainConfig.updatedGames++ } else { mainConfig.newGames++ }
        }
        mainConfig.totalGames += lastBatch
        saveCJProducts(true)
      } else {
        saveCJProducts(false)
      }
    } catch (e) {
      throw new Error(e)
    }
  }

  db.once('open', async () => {
    saveCJProducts()
  })
}
