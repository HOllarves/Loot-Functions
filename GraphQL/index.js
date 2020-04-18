const { ApolloServer } = require('apollo-server-azure-functions')

const { ApolloGateway } = require('@apollo/gateway')

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'Steam', url: 'http://localhost:7071/steam' },
    { name: 'PSN', url: 'http://localhost:7071/psn' },
  ],
})

const server = new ApolloServer({ gateway, subscriptions: false, playground: true })

module.exports = server.createHandler()

// module.exports = main
