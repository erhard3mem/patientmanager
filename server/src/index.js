const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const Patient = require('./resolvers/Patient')
const Record = require('./resolvers/Record')
const Prescription = require('./resolvers/Prescription')

const resolvers = {
  Query,
  Mutation,
  Patient,
  Record,
  Prescription
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => ({
    ...request,
    prisma,
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
