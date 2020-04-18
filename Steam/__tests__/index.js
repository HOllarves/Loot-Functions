const rp = require('request-promise')

const uri = 'http://localhost:7071/steam'

jest.setTimeout(10000)

describe('Steam GraphQL endpoints', () => {

  it('Retrieves a steam user info', async () => {
    const query = `
    {
      SteamUser(username:"HOllarves") {
        avatar {
          small
          medium
        }
        steamID
        nickname
        realName
        url
        steamID
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
    expect(response.data.SteamUser).toBeDefined()
  })

  it('Retrieves Steam featured categories', async () => {
    const query = `
    {
      SteamFeaturedCategories {
          id
          name,
          items {
            name
            body
            header_image
          }
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
    expect(response.data.SteamFeaturedCategories).toBeDefined()
  })

  it('Retrieves Steam featured games', async () => {
    const query = `
    {
      SteamFeaturedGames {
        featured_win{
          name
          id
          final_price
        }
        featured_mac {
          name
          id
          final_price
        }
        featured_linux {
          name
          id
          final_price
        }
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
    expect(response.data.SteamFeaturedGames).toBeDefined()
  })

  it('Retrieves Steam featured games', async () => {
    const query = `
    {
      SteamGameDetail(id: "10") {
        type
        name
        steam_appid
        required_age
        platforms {
          windows
          mac
        }
        price_overview {
          currency
          final
        }
        pc_requirements {
          minimum
          recommended
        }
        mac_requirements {
          minimum
          recommended
        }
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
    expect(response.data.SteamGameDetail).toBeDefined()
    expect(response.data.SteamGameDetail.name).toBe('Counter-Strike')
  })

  it('Retrieves Steam game news', async () => {
    const query = `
    {
      SteamGameNews(id: "952060") {
        gid
        author
        contents
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
    expect(response.data.SteamGameNews).toBeDefined()
  })

  it('Retrieves Steam User\'s games', async () => {
    const query = `
    {
      SteamUserGames(username:"HOllarves") {
        appID
        name
        playTime
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
    expect(response.data.SteamUserGames).toBeDefined()
  })

  it('Retrieves Steam User\'s recent games', async () => {
    const query = `
    {
      SteamUserRecentGames(username:"HOllarves") {
        appID
        name
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
    expect(response.data.SteamUserRecentGames).toBeDefined()
  })

  it('Retrieves Steam User\'s level', async () => {
    const query = `
    {
      SteamUserLevel(username:"Bukakeriko")
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
    expect(response.data.SteamUserLevel).toBeDefined()
  })

  it('Retrieves Steam User\'s friends', async () => {
    const query = `
    {
      SteamUserFriends(username:"76561198814420196") {
        steamID
        username
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
    expect(response.data.SteamUserFriends).toBeDefined()
  })



})
