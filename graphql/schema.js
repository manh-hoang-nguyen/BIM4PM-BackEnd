const {
  buildSchema,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList
} = require('graphql');

const User = require('../models/User');
const RevitElement = require('../models/RevitElement');

const HistoryType = new GraphQLObjectType({
  name: 'History',
  fields: () => ({
    modifiedAt: { type: GraphQLString },
    user: { type: GraphQLString },
    isFirstCommit: { type: GraphQLBoolean },
    geometryChange: { type: GraphQLBoolean },
    parameterChange: { type: GraphQLBoolean },
    sharedParameterChange: { type: GraphQLBoolean }
  })
});

const RevitElementType = new GraphQLObjectType({
  name: 'RevitElement',
  fields: () => ({
    id: { type: GraphQLID },
    project: { type: GraphQLString },
    version: { type: GraphQLString },
    guid: { type: GraphQLString },
    topics: { type: new GraphQLList(GraphQLString) },
    history: { type: new GraphQLList(HistoryType) },
    name: { type: GraphQLString },
    elementId: { type: GraphQLString },
    category: { type: GraphQLString },
    level: { type: GraphQLString },
    parameters: { type: GraphQLString },
    geometryParameters: { type: GraphQLString },
    sharedParameters: { type: GraphQLString },
    worksetId: { type: GraphQLString },
    location: { type: GraphQLString },
    boundingBox: { type: GraphQLString },
    centroid: { type: GraphQLString },
    typeId: { type: GraphQLString },
    volume: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    revitElements: {
      type: new GraphQLList(RevitElementType),
      resolve(parent, args, req) {
        return RevitElement.find({});
      }
    },
    revitElement: {
      type: RevitElementType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args, req) {
        return RevitElement.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    hello: {
      type: GraphQLString,
      resolve(parent, args) {
        return 'Hello';
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
