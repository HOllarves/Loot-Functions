module.exports = async function (context, myTimer) {
  const mongoose = require('mongoose')

  const eshop = require('nintendo-switch-eshop')

  const { EUNintendo, USNintendo } = require('../NintendoShop/db/models/nintendo')

  const db = mongoose.connection

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  if (myTimer.IsPastDue) {
    context.log('JavaScript is running late!');
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

  db.once('open', async () => {
    saveNintendoData()
  })

  const saveNintendoData = async () => {
    let usGames = await eshop.getGamesAmerica()
    usGames = usGames.map(us => {
      const price = parseInt((us.msrp * 100).toFixed(0))
      return { ...us, slug: slugify(us.title), price: !isNaN(price) ? price : 0, lastUpdate: new Date() }
    })
    let euGames = await eshop.getGamesEurope()
    euGames = euGames.map(eu => {
      const price = parseInt((eu.price_regular_f * 100).toFixed(0))
      return { ...eu, slug: slugify(eu.title), price: !isNaN(price) ? price : 0, lastUpdate: new Date() }
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
};