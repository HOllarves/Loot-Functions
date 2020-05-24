/* eslint-disable no-underscore-dangle */
module.exports = (game) => {
  const { types, platforms, slugify, nameRegex } = require('../constants')

  const advertiserName = game['advertiser-name'] && game['advertiser-name']._text ? game['advertiser-name']._text : null

  let name = game.name && game.name._text ? game.name._text : null

  const buyUrl = game['buy-url'] && game['buy-url']._text ? game['buy-url']._text : null

  const type = types.find((g) => name.toLowerCase().includes(g.toLowerCase())) || 'full'

  const platform = platforms.find((p) => buyUrl.toLowerCase().includes(p.toLowerCase())) || 'PC'

  name = name.replace(nameRegex, '').trim()

  return {
    ad_id: game['ad-id'] && game['ad-id']._text
      ? game['ad-id']._text : null,

    advertiser_category: game['advertiser-category'] && game['advertiser-category']._text
      ? game['advertiser-category']._text : null,

    advertiser_id: game['advertiser-id'] && game['advertiser-id']._text
      ? game['advertiser-id']._text : null,

    advertiser_name: advertiserName,

    buy_url: buyUrl,

    catalog_id: game['catalog-id'] && game['catalog-id']._text
      ? game['catalog-id']._text : null,

    currency: game.currency && game.currency._text
      ? game.currency._text : null,

    description: game.description && game.description._text
      ? game.description._text : null,

    image_url: game['image-url'] && game['image-url']._text
      ? game['image-url']._text : null,

    in_stock: game['in-stock'] && game['in-stock']._text
      ? game['in-stock']._text : null,

    name,

    platform,

    type,

    method: 'CD Key',

    price: game.price && game.price._text
      ? parseInt((parseFloat(game.price._text) * 100).toFixed(0), 10) : null,

    sale_price: game['sale-price'] && game['sale-price']._text
      ? parseInt((parseFloat(game['sale-price']._text) * 100).toFixed(0), 10) : null,

    sku: game.sku && game.sku._text
      ? game.sku._text : null,

    slug: slugify(name),

    last_update: new Date(),
  }
}
