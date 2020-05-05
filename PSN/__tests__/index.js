const rp = require('request-promise')

const uri = 'http://localhost:7071/psn'

jest.setTimeout(10000)

describe('PS4 GraphQL endpoints', () => {

  it('Retrieves PS4 game info', async () => {

    const query = `
    {
     PSNGame(id:"UP9000-NPUA80677_00-SOTC000000000001" region:"US") {
       default_sku {
         name
         price
         type
       }
       name
       playable_platform
     }
    }
    `
    const request = {
      method: 'POST',
      uri,
      body: {
        query,
      },
      json: true,
    }

    const response = await rp(request)
    expect(response.data).toBeDefined()
    expect(response.data.PSNGame).toBeDefined()
  })

})
