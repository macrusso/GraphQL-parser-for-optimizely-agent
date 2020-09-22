const { ApolloServer, gql } = require('apollo-server');
const AgentAPI = require('./rest')

const typeDefs = gql`
  type Query {
    activate(userId: String!, experimentKey: String!): String
    getVariation(userId: String!, experimentKey: String!): String
    getForcedVariation(userId: String!, experimentKey: String!): String
    getEnabledFeatures(userId: String!): [String]
    isFeatureEnabled(userId: String!, featureKey: String!): Boolean
    getConfig: String
  }

  type Mutation {
    setForcedVariation(userId: String!, experimentKey: String!, variationKey:String): Boolean
  }
`;

const resolvers = {
  Query: {
    getConfig: (_, __, { dataSources }) =>
      dataSources.agentAPI.getConfig(),
    activate: (_, args, { dataSources }) =>
      dataSources.agentAPI.activate({ ...args }),
    getVariation: (_, args, { dataSources }) =>
      dataSources.agentAPI.activate({ ...args }),
    getEnabledFeatures: (_, args, { dataSources }) =>
      dataSources.agentAPI.getEnabledFeatures({ ...args }),
    isFeatureEnabled: (_, args, { dataSources }) =>
      dataSources.agentAPI.isFeatureEnabled({ ...args }),
  },
  Mutation: {
    setForcedVariation: (_, args, { dataSources }) =>
      dataSources.agentAPI.setForcedVariation({ ...args }),
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    agentAPI: new AgentAPI(),
  }),
});


server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
