const gql = require('graphql-tag')

const ApolloClient = require('apollo-client').ApolloClient

const fetch = require('node-fetch')

const createHttpLink = require('apollo-link-http').createHttpLink

const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache

const httpLink = createHttpLink({
  uri: 'https://ads.api.cj.com/query',
  headers: { Authorization: `Bearer ${process.env.CJ_TOKEN}` },
  fetch,
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

try {
  const { data, error } = await client.query({
    query: gql`
       query {
        products(companyId: '4gywdr9acx3bwespqcgz5sn4mv') {
          totalCount
        }
       } 
      `,
    variables: {
      companyId: process.env.CJ_WEBSITE_ID,
    },
  })

  console.log({ data, error })
} catch (e) {
  console.log(e)
}