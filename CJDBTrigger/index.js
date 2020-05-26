/* eslint-disable no-prototype-builtins */
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

  const kinguin = require('../CJDB/stores/kinguin')

  const gamersGate = require('../CJDB/stores/gamers-gate')

  const GMG = require('../CJDB/stores/green-man-gaming')

  const fanatical = require('../CJDB/stores/fanatical')

  class MainConfig {
    constructor() {
      this.min = 0
      this.max = 100
      this.advertisers = process.env.CJ_ADVERTISER_IDS.split(',')
      this.cjCurrencies = ['USD', 'EUR']
      this.currentAdvertiser = this.advertisers[0]
      this.currentCurrency = this.cjCurrencies[0]
      this.storesConfig = {
        8: 40, 5: 1, 3: 20, 2: 40,
      }
      this.lastChar = this.currentAdvertiser ? this.currentAdvertiser.substr(-1) : false
      this.step = this.lastChar && this.storesConfig.hasOwnProperty(this.lastChar) ? this.storesConfig[this.lastChar] : 1
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
          this.lastChar = this.currentAdvertiser.substr(-1)
          this.step = this.storesConfig[this.lastChar]
        } else {
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

  mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })

  let lastBatch = null
  let retries = 0
  // eslint-disable-next-line consistent-return
  const loadCJData = async (loadMore) => {
    try {
      if (!loadMore && mainConfig.currentHigh > mainConfig.max) {
        mainConfig.reset()
      } else {
        mainConfig.nextPage()
      }
      const params = mainConfig.getParams()
      console.log({ params })
      const response = await axios.get(cjBaseUrl, { headers, params })
      retries = 0
      return response
    } catch (e) {
      if (retries < 10) {
        retries++
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
      const parsedData = jsonResults.product.map((game) => {
        const advertiserName = game['advertiser-name'] && game['advertiser-name']._text ? game['advertiser-name']._text : null
        switch (advertiserName) {
          case 'Kinguin':
            return kinguin(game)
          case 'GamersGate.com':
            return gamersGate(game)
          case 'Green Man Gaming US':
            return GMG(game)
          case 'Fanatical':
            return fanatical(game)
          default:
            return {}
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
          const doc = await CJProduct.findOneAndUpdate(
            { sku: d.sku, currency: d.currency }, d, { upsert: true },
          )
          if (doc) { mainConfig.updatedGames++ } else { mainConfig.newGames++ }
        }
        mainConfig.totalGames += lastBatch
        saveCJProducts(true)
      } else {
        saveCJProducts(false)
      }
    } catch (e) {
      console.error(e)
      throw new Error(e)
    }
  }

  db.once('open', async () => {
    saveCJProducts()
  })
}
