import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
    type Link {
        id: ID!
        url: String!
        description: String!
        postedBy: User
    }
    
    type Query {
        allLinks: [Link!]!
    }

    type Mutation {
        createLink(url: String!, description: String!): Link
        createUser(name: String!, authProvider: AuthProviderSignupData!): User
        signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    }

    type User {
        id: ID!
        name: String!
        email: String
    }

    type SigninPayload {
        token: String
        user: User
    }

    input AuthProviderSignupData {
        email: AUTH_PROVIDER_EMAIL
    }
    
    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }
`;

export default makeExecutableSchema({typeDefs, resolvers});