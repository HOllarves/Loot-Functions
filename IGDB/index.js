/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
module.exports = async function (context, myTimer) {
  const puppeteer = require('puppeteer')

  const decodeHtml = require('decode-html')

  const qs = require('qs')

  const mongoose = require('mongoose')

  const IGGame = require('../Products/db/models/instant-gaming')

  const { slugify, bulkSert } = require('../CJDB/constants')

  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!')
  }

  mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })

  const db = mongoose.connection

  db.once('open', async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // page.on('console', consoleObj => console.log(consoleObj.text()));
    const url = 'https://www.instant-gaming.com/en/search/'
    const pcPlatform = ['steam', 'origin', 'uplay', 'battle.net', 'rockstar', 'gog.com', 'epic games', 'bethesda', 'ncsoft', 'microsoft store']
    const xboxPlatform = ['xbox']
    const switchPlatform = ['nintendo']
    const psPlatform = ['playstation']
    const nameRegex = /Switch|PS4|\(([^)]+)\)|/gi
    const igParams = {
      all_types: 1,
      all_cats: 1,
      min_price: 0,
      max_price: 100,
      min_discount: 0,
      max_discount: 100,
      min_reviewsavg: 10,
      max_reviewsavg: 100,
      noreviews: 1,
      gametype: 'all',
      currency: 'EUR',
      instock: 1,
    }
    const selectors = {
      item: '#ig-panel-center > div.search-wrapper > div.search > .item',
      totalPages: '#ig-panel-center > div.search-wrapper > ul > li:nth-child(4)',
      totalPagesConsole: '#ig-panel-center > div.search-wrapper > ul > li:nth-child(3)',
      pagination: '#ig-panel-center > div.search-wrapper > ul.pagination',
    }

    async function loadPage(currency, platform) {
      let totalPages
      if (platform === 'PC') {
        totalPages = parseInt(await page.$eval(selectors.totalPages, (el) => el.innerText), 10)
      }
      if (platform === 'Xbox One' || platform === 'Nintendo Switch') {
        totalPages = parseInt(await page.$eval(selectors.totalPagesConsole,
          (el) => el.innerText), 10)
      }
      if (platform === 'PS4') {
        totalPages = 1
      }
      for (let i = 0; i < totalPages; i++) {
        const nextButton = await page.$x('//a[contains(text(), ">")]')
        const isLastPage = !nextButton[0]
        let data = await page.$$eval(selectors.item, (data) => data.map((d) => {
          const nameRegex = /Switch|PS4|\(([^)]+)\)|/gi
          let name = d.querySelector('.name').innerHTML
          name = name.replace(nameRegex, '')
          const link = d.querySelector('a.cover').getAttribute('href') + '?igr=gamer-3af99f'
          const data = ['data-price', 'data-region', 'data-dlc'].map((a) => ({ [a.replace('-', '_')]: d.getAttribute(a) }))
          // This feels weird...
          return {
            name, ...data[0], ...data[1], ...data[2], link,
          }
        }))
        data = data.map((d) => ({
          ...d, name: decodeHtml(d.name.replace(nameRegex, '')), currency, platform, buy_url: d.link, region: d.data_region === 'EUR' || d.data_region === 'Europe' ? 'EU' : d.data_region, price: parseInt((parseFloat(d.data_price) * 100).toFixed(0), 10),
        })).map((d) => ({ ...d, slug: slugify(d.name) }))
        await bulkSert(data, IGGame, ['slug', 'currency', 'platform'])
        if (isLastPage) return true
        await Promise.all([
          !isLastPage ? nextButton[0].click() : true,
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ])
      }
    }
    // EUR
    // Loading PC
    igParams.type = pcPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await page.waitForSelector(selectors.item)
    await loadPage('EUR', 'PC')
    // Loading Xbox
    igParams.type = xboxPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('EUR', 'Xbox One')
    // Loading Nintendo
    igParams.type = switchPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('EUR', 'Nintendo Switch')
    // Loading PSN
    igParams.type = psPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('EUR', 'PS4')
    // USD
    igParams.currency = 'USD'
    // Loading PC
    igParams.type = pcPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await page.waitForSelector(selectors.item)
    await loadPage('USD', 'PC')
    // Loading Xbox
    igParams.type = xboxPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('USD', 'Xbox One')
    // Loading Nintendo
    igParams.type = switchPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('USD', 'Nintendo Switch')
    // Loading PSN
    igParams.type = psPlatform
    await Promise.all([
      page.goto(`${url}?${qs.stringify(igParams)}`),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ])
    await loadPage('USD', 'PS4')
    console.log('Operation complete')
  })
}
