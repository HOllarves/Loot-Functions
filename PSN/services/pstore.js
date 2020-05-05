const axios = require('axios')

const EUPSN = () => {
  const storeBaseUrl = 'https://store.playstation.com/es-es/product/'
  const getEUID = async (id) => {
    const response = await axios.default.get(`${storeBaseUrl}${id}`)
    const fetchedUrl = response.request.res.responseUrl
    const urlParts = fetchedUrl.split('/')
    return urlParts[urlParts.length - 1]
  }
  return { getEUID }
}

module.exports = EUPSN()
