const { ApolloServer, gql } = require('apollo-server-azure-functions')
const requireGraphSchema = require('require-graphql-file')
const { buildFederatedSchema } = require('@apollo/federation')

// Starting Apollo Server
const typeDefs = requireGraphSchema('./gog')
const resolvers = require('./resolver')

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs: gql(typeDefs), resolvers }]),
  playground: true,
})

module.exports = server.createHandler()
