import {
  AUTH_PROVIDER_EMAIL,
  AuthProviderSignupData,
  CreateUserMutationArgs,
  CreateVoteMutationArgs,
  Link,
  User,
  Vote
} from './types';
import {Collection} from 'mongodb';
import {ObjectId} from 'bson';
import DataLoader = require('dataloader');

export interface ServerContext {
  mongo: {Links: Collection<Link[]>; Users: Collection<User[]>; Votes: Collection<Vote[]>};
  dataloaders: {userLoader: DataLoader<any, User>};
  user: User;
}

export default {
  Query: {
    allLinks: async (_: any, __: any, {mongo: {Links}}: ServerContext) => {
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    createLink: async (_: any, data: Link, {mongo: {Links}, user}: ServerContext) => {
      // console.log('createLink user: ', user);
      const newLink = Object.assign({postedById: user && (user as any)._id}, data);
      const response = await Links.insertOne(newLink);
      const id = response.insertedId;
      return Object.assign({id}, newLink);
    },
    createUser: async (
      _: any,
      {name, authProvider: {email}}: CreateUserMutationArgs,
      {mongo: {Users}}: ServerContext
    ) => {
      const newUser = email && {
        name,
        email: (email as AUTH_PROVIDER_EMAIL).email,
        password: (email as AUTH_PROVIDER_EMAIL).password
      };

      if (!newUser) return {};

      const response = await Users.insertOne(newUser);
      return Object.assign({id: response.insertedId}, newUser);
    },
    signinUser: async (_: any, {email}: AuthProviderSignupData, {mongo: {Users}}: ServerContext) => {
      const user = email && (await Users.findOne<User>({email}));
      if (!email || !user) return null;
      if (email.password === (user as any).password) return {token: `token-${email}`, user};
      return null;
    },
    createVote: async (_: any, data: any, {mongo: {Votes}, user}: ServerContext) => {
      const newVote = {
        userId: user && (user as any)._id,
        linkId: new ObjectId(data.linkId)
      };
      const response = await Votes.insertOne(newVote);
      return Object.assign({id: response.insertedId}, newVote);
    }
  },
  Link: {
    id: (root: Link) => {
      return (root as any)._id || root.id;
    },
    postedBy: async ({postedById = 0}: any, _: any, {dataloaders: {userLoader}}: ServerContext) => {
      // console.log('Link postedBy data: ', _);
      return await userLoader.load(postedById);
    },
    votes: async ({_id = 0}: any, _: any, {mongo: {Votes}}: ServerContext) => {
      return await Votes.find({linkId: _id}).toArray();
    }
  },
  User: {
    id: (root: User) => {
      return (root as any)._id || root.id;
    }
  },
  Vote: {
    id: (root: any) => root._id || root.id,
    user: async ({userId = 0}: any, _: any, {dataloaders: {userLoader}}: ServerContext) => {
      return await userLoader.load(userId);
    },
    link: async ({linkId = 0}: CreateVoteMutationArgs, _: any, {mongo: {Links}}: ServerContext) => {
      return await Links.findOne({_id: linkId});
    }
  }
} as any;
