const puppeteer = require('puppeteer')

const AGE_GATE_COOKIE = JSON.parse('[{"name":"HAS_ACCEPTED_AGE_GATE_ONCE","value":"true","domain":"www.epicgames.com","path":"/","expires":-1,"size":30,"httpOnly":false,"secure":false,"session":true}]')

const opt1 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=ProductDetailHeader-wrapper] > div:nth-child(2) > div > div > div[class*=Description-ctaWrapper] > div > div > div > div[class*=PurchaseButton-priceWrapper] > div > div > span'
const opt2 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=css] > div:nth-child(2) > div[class*=Group-content] > div:nth-child(2) > div[class*=ProductCardBottomRow-wrapper].undefined > div[class*=ProductCardBottomRow-rowChildren] > div > div[class*=PurchaseButton-priceWrapper] > div[class*=PurchasePrice-price][class*=PurchaseButton-price] > div > span'

const getUSPrice = async (url, withProxy) => {
  const pupOptions = { args: withProxy ? ['--proxy-server=8.9.3.70:8080'] : [] }
  const browser = await puppeteer.launch(pupOptions)
  const page = await browser.newPage()
  await page.setCookie(...AGE_GATE_COOKIE)
  await Promise.all([
    page.goto(url),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ])
  await page.waitFor(() => {
    const tryOpt1 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=ProductDetailHeader-wrapper] > div:nth-child(2) > div > div > div[class*=Description-ctaWrapper] > div > div > div > div[class*=PurchaseButton-priceWrapper] > div > div > span'
    const tryOpt2 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=css] > div:nth-child(2) > div[class*=Group-content] > div:nth-child(2) > div[class*=ProductCardBottomRow-wrapper].undefined > div[class*=ProductCardBottomRow-rowChildren] > div > div[class*=PurchaseButton-priceWrapper] > div[class*=PurchasePrice-price][class*=PurchaseButton-price] > div > span'
    return document.querySelectorAll(`${tryOpt1}, ${tryOpt2}`).length
  })
  const priceOp1 = await page.$(opt1)
  if (priceOp1) {
    return priceOp1
      .evaluate((node) => node.innerHTML)
      .then((p) => p.replace(/^\D+/g, ''))
      .then((p) => parseInt((parseFloat(p) * 100).toFixed(0), 10))
  }
  const priceOp2 = await page.$(opt2)
  if (priceOp2) {
    return priceOp2
      .evaluate((node) => node.innerHTML)
      .then((p) => p.replace(/^\D+/g, ''))
      .then((p) => parseInt((parseFloat(p) * 100).toFixed(0), 10))
  }
  return 'Unable to obtain price'
}

const getEUPrice = async (url, withProxy) => {
  const pupOptions = { args: withProxy ? ['--proxy-server=195.4.164.127:8080'] : [] }
  const browser = await puppeteer.launch(pupOptions)
  const page = await browser.newPage()
  await page.setCookie(...AGE_GATE_COOKIE)
  await Promise.all([
    page.goto(url),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ])
  await page.waitFor(() => {
    const tryOpt1 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=ProductDetailHeader-wrapper] > div:nth-child(2) > div > div > div[class*=Description-ctaWrapper] > div > div > div > div[class*=PurchaseButton-priceWrapper] > div > div > span'
    const tryOpt2 = '#dieselReactWrapper > div > div[class*=css] > main > div > div > div[class*=ProductDetails-wrapper] > div > div[class*=css] > div:nth-child(2) > div[class*=Group-content] > div:nth-child(2) > div[class*=ProductCardBottomRow-wrapper].undefined > div[class*=ProductCardBottomRow-rowChildren] > div > div[class*=PurchaseButton-priceWrapper] > div[class*=PurchasePrice-price][class*=PurchaseButton-price] > div > span'
    return document.querySelectorAll(`${tryOpt1}, ${tryOpt2}`).length
  })
  const priceOp1 = await page.$(opt1)
  if (priceOp1) {
    return priceOp1
      .evaluate((node) => node.innerHTML)
      .then((p) => p.replace(/^\D+/g, ''))
      .then((p) => parseInt((parseFloat(p) * 100).toFixed(0), 10))
  }
  const priceOp2 = await page.$(opt2)
  if (priceOp2) {
    return priceOp2
      .evaluate((node) => node.innerHTML)
      .then((p) => p.replace(/^\D+/g, ''))
      .then((p) => parseInt((parseFloat(p) * 100).toFixed(0), 10))
  }
  return 'Unable to obtain price'
}

module.exports = { getUSPrice, getEUPrice }