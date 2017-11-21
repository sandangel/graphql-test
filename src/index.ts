import * as express from 'express';
import {graphiqlExpress, graphqlExpress} from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import {Request, Response} from 'express';

import schema from './schema';
import connectMongo from './mongo-connector';
import authenticate from './authentication';
import buildDataloaders from './dataloader';

const start = async () => {
  const mongo = await connectMongo();

  const app = express();

  const buildOptions = async (req?: Request, _?: Response) => {
    if (!req) return {schema, context: {mongo}};
    const user = await authenticate(req, mongo.Users);
    return {
      context: {mongo, user, dataloaders: buildDataloaders(mongo)},
      schema
    };
  };

  app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

  app.use(
    '/graphiql',
    graphiqlExpress({
      endpointURL: '/graphql',
      passHeader: `'Authorization': 'bearer token-sand@gmail.com'`
    })
  );

  app.listen(3000, () => {
    console.log('Hackernews GraphQL server running on port 3000');
  });
};

start();
