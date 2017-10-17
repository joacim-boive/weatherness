import express from 'express';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';

import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import schema from '../../graphql/Schema/Schema';

const URL = 'http://localhost';
const PORT = 3001;
const MONGO_URL = 'mongodb://localhost/GeoLiteCity';

export const start = async () => {
  try {
    const db = await MongoClient.connect(MONGO_URL);

    db.on('error', console.error.bind(console, 'connection error:'));

    const Blocks = db.collection('blocks');

    const typeDefs = [
      `
      type Query {
        ipBlocks: [IpBlock]
        ipBlock(ip: String!): IpBlock
      }

      type IpBlock {
        _id: String
        network_start_integer: Int
        network_last_integer: Int,
        geoname_id: Int,
        registered_country_geoname_id: String,
        is_anonymous_proxy: Int,
        is_satellite_provider: Int,
        latitude: String,
        longitude: String,
        accuracy_radius: Float
      }

      schema {
        query: Query
      }
    `,
    ];

    const resolvers = {
      Query: {
        ipBlock: (root, { ip }) => {
          const dot2num = dot => {
            const d = dot.split('.');
            return ((+d[0] * 256 + +d[1]) * 256 + +d[2]) * 256 + +d[3];
          };

          const decimalIp = dot2num(ip);

          return Blocks.findOne({
            network_start_integer: {
              $lte: decimalIp,
            },
            network_last_integer: {
              $gte: decimalIp,
            },
          });
        },
        ipBlocks: () => {
          return Blocks.find({})
            .limit(100)
            .toArray();
        },
      },
    };

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
    });

    const app = express();

    app.use(cors());

    app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

    app.use(
      '/graphiql',
      graphiqlExpress({
        endpointURL: '/graphql',
      })
    );

    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};
