const mongoose = require('mongoose')

mongoose.set('useCreateIndex', true)

const typeString = { type: String }
const typeIndex = { type: String, index: true, required: true, text: true }
const typeNum = { type: Number }
const typeBool = { type: Boolean }
const typeDate = { type: Date, default: Date.now }

const UsNintendoSchema = new mongoose.Schema({
  availability: [typeString],
  boxArt: typeString,
  categories: [typeString],
  characters: [typeString],
  description: typeString,
  esrb: typeString,
  esrbDescriptors: [typeString],
  featured: typeBool,
  filterPlayers: [typeString],
  filterShops: [typeString],
  freeToStart: typeBool,
  gallery: typeString,
  generalFilters: [typeString],
  lastModified: typeNum,
  locale: typeString,
  msrp: typeNum,
  price: typeNum,
  nsuid: typeString,
  objectId: typeString,
  platform: typeString,
  players: typeString,
  priceRange: typeString,
  publishers: [typeString],
  releaseDateMask: typeString,
  salePrice: typeString,
  slug: typeIndex,
  title: typeIndex,
  type: typeString,
  url: typeString,
  virtualConsole: typeString,
  last_update: typeDate
})

const EuNintendoSchema = new mongoose.Schema({
  age_rating_sorting_i: typeNum,
  age_rating_type: typeString,
  age_rating_vaue: typeString,
  change_date: typeString,
  cloud_saves_b: typeBool,
  club_nintendo: typeString,
  compatible_controller: [typeString],
  copyright_s: typeString,
  date_from: typeString,
  dates_released_dts: [typeString],
  deprioritise_b: typeBool,
  digital_version_b: typeBool,
  eshop_removed_b: typeBool,
  excerpt: typeString,
  fs_id: typeString,
  game_categories_txt: [typeString],
  game_category: [typeString],
  hits_i: typeNum,
  image_url: typeString,
  image_url_h2x1_s: typeString,
  image_url_sq_s: typeString,
  language_availability: [typeString],
  nsuid_txt: [typeString],
  originally_for_t: typeString,
  paid_subscription_required_b: typeBool,
  pg_s: typeString,
  physical_version_b: typeBool,
  play_mode_handheld_mode_b: typeBool,
  play_mode_tabletop_mode_b: typeBool,
  play_mode_tv_mode_b: typeBool,
  playable_on_txt: [typeString],
  players_from: typeNum,
  players_to: typeNum,
  popularity: typeNum,
  pretty_agerating_s: typeString,
  pretty_date_s: typeString,
  pretty_game_categories_txt: [typeString],
  price: typeNum,
  price_discount_percentage_f: typeNum,
  price_has_discount_b: typeBool,
  price_lowest_f: typeNum,
  price_regular_f: typeNum,
  price_sorting_f: typeNum,
  product_code_ss: [typeString],
  product_code_txt: [typeString],
  publisher: typeString,
  sorting_title: typeString,
  switch_game_voucher_b: typeBool,
  system_names_txt: [typeString],
  system_type: [typeString],
  slug: typeIndex,
  title: typeIndex,
  title_extras_txt: [typeString],
  type: typeString,
  url: typeString,
  voice_chat_b: typeBool,
  wishlist_email_banner460w_image_url_s: typeString,
  wishlist_email_banner640w_image_url_s: typeString,
  wishlist_email_square_image_url_s: typeString,
  last_update: typeDate
})

const USNintendo = mongoose.model('USNintendoGame', UsNintendoSchema)
const EUNintendo = mongoose.model('EuNintendoGame', EuNintendoSchema)

module.exports = {
  USNintendo, EUNintendo,
}
