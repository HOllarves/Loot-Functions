const { ApolloServer } = require('apollo-server-azure-functions')
const requireGraphSchema = require('require-graphql-file')

// Starting Apollo Server
const server = new ApolloServer({
  typeDefs: requireGraphSchema('./ps4'),
  resolvers: require('./resolver'),
  playground: true,
})

module.exports = server.createHandler()
