// import {
//   GraphQLObjectType,
//   GraphQLNonNull,
//   GraphQLSchema,
//   GraphQLFloat,
//   GraphQLString,
//   GraphQLList,
// } from 'graphql/type';

const type = require('graphql/type/');
const GraphQLObjectType = type.GraphQLObjectType;
const GraphQLNonNull = type.GraphQLNonNull;
const GraphQLSchema = type.GraphQLSchema;
const GraphQLFloat = type.GraphQLFloat;
const GraphQLString = type.GraphQLString;
const GraphQLList = type.GraphQLList;

const LocationMongo = require('../../mongoose/location');

// /**
//  * generate projection object for mongoose
//  * @param  {Object} fieldASTs
//  * @return {Project}
//  */
// export function getProjection(fieldASTs) {
//   return fieldASTs.fieldNodes[0].selectionSet.selections.reduce((projections, selection) => {
//     projections[selection.name.value] = true;
//     return projections;
//   }, {});
// }

const locationType = new GraphQLObjectType({
  name: 'location',
  description: 'location data',
  fields: () => ({
    latitude: {
      type: GraphQLString,
      description: 'The latitude of the location',
    },
    longitude: {
      type: GraphQLString,
      description: 'The longitude of the location',
    },
    accuracy_radius: {
      type: GraphQLFloat,
      description: 'The precision of the location',
    },
  }),
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      location: {
        type: new GraphQLList(locationType),
        args: {
          ip: {
            name: 'ip',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (root, { ip }, source, fieldASTs) => {
          const projections = getProjection(fieldASTs);
          const foundLocations = new Promise((resolve, reject) => {
            LocationMongo.find(
              { network_start_integer: { $lte: ip }, network_last_integer: { $gte: ip } },
              projections,
              (err, locations) => {
                err ? reject(err) : resolve(locations);
              }
            );
          });

          return foundLocations;
        },
      },
    },
  }),
});

module.exports = schema;
