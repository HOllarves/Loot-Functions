const { ApolloServer } = require('apollo-server-azure-functions')
const requireGraphSchema = require('require-graphql-file')

// Starting Apollo Server
const server = new ApolloServer({
  typeDefs: requireGraphSchema('./schemas/steam'),
  resolvers: require('./resolvers/index'),
  playground: true,
})

module.exports = server.createHandler()
