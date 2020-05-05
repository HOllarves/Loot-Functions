const { ApolloServer, gql } = require('apollo-server-azure-functions')
const requireGraphSchema = require('require-graphql-file')
const { buildFederatedSchema } = require('@apollo/federation')

// Starting Apollo Server
const typeDefs = requireGraphSchema('./psn')
const resolvers = require('./resolver')

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: gql(typeDefs), resolvers }]),
  playground: false,
})

module.exports = server.createHandler()
