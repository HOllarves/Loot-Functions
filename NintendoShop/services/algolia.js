const axios = require('axios')
const eshop = require('nintendo-switch-eshop')
const { stringify } = require('qs')

const AlgoliaSearch = () => {
  /**
   * Returns data about a specific game
   * @param {*} gameName
   */
  const getGame = async (gameName) => {
    if (!gameName) return
    try {
      const response = await axios.default.post(eshop.US_GET_GAMES_URL, {
        requests: [{
          indexName: 'noa_aem_game_en_us',
          params: stringify({
            facetFilters: ['type:game'],
            hitsPerPage: 10,
            maxValuesPerFacet: 30,
            page: 0,
            query: gameName,
          }),
        }],
      }, {
        headers: {
          'x-algolia-application-id': eshop.US_ALGOLIA_ID,
          'x-algolia-api-key': eshop.US_ALGOLIA_KEY,
        },
        json: true,
      })
      const { data: { results } } = response
      // eslint-disable-next-line consistent-return
      return results[0].hits.find((g) => g.nsuid)
    } catch (e) {
      throw new Error(e)
    }
  }

  return { getGame }
}

module.exports = AlgoliaSearch()
