const { ApolloServer } = require('apollo-server-azure-functions')

const { ApolloGateway } = require('@apollo/gateway')

require('dotenv').config()

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'Steam', url: process.env.STEAM_SERVICE_URL },
    { name: 'PSN', url: process.env.PSN_SERVICE_URL },
    { name: 'Xbox', url: process.env.XBOX_SERVICE_URL },
    { name: 'RAWG', url: process.env.RAWG_SERVICE_URL },
    { name: 'Nintendo', url: process.env.NINTENDO_SERVICE_URL },
    { name: 'CJ', url: process.env.CJ_SERVICE_URL },
  ],
})

const server = new ApolloServer({ gateway, subscriptions: false, playground: true })

module.exports = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
})
