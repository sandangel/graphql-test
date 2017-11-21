import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';

import * as schema from './schema.graphql';

export default makeExecutableSchema({typeDefs: schema as any, resolvers});
