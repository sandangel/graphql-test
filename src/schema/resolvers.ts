import {Collection} from 'mongodb';

export interface Link {
  id: string;
  url: string;
  description: string;
  postedBy: User;
  [index: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  [index: string]: any;
}

export interface CreateUserInput {
  name: string;
  authProvider: AuthProviderSignupData;
}

export interface AuthProviderSignupData {
  email: AuthProviderEmail;
}

export interface AuthProviderEmail {
  email: string;
  password: string;
}

export interface MongoContext {
  mongo: {Links: Collection<Link[]>; Users: Collection<User[]>};
  user: User;
}

export default {
  Query: {
    allLinks: async (_: any, __: any, {mongo: {Links}}: MongoContext) => {
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    createLink: async (_: any, data: Link, {mongo: {Links}, user}: MongoContext) => {
      // console.log('createLink user: ', user);
      const newLink = Object.assign({postedById: user && user._id}, data);
      const response = await Links.insertOne(newLink);
      const id = response.insertedId;
      return Object.assign({id}, newLink);
    },
    createUser: async (
      _: any,
      {name, authProvider: {email: {email, password}}}: CreateUserInput,
      {mongo: {Users}}: MongoContext
    ) => {
      const newUser = {
        name,
        email,
        password
      };

      const response = await Users.insertOne(newUser);
      return Object.assign({id: response.insertedId}, newUser);
    },
    signinUser: async (_: any, {email: {email, password}}: AuthProviderSignupData, {mongo: {Users}}: MongoContext) => {
      const user = await Users.findOne<User>({email});
      if (user) if (password === user.password) return {token: `token-${email}`, user};
      return null;
    }
  },
  Link: {
    id: (root: Link) => {
      return root['_id'] || root.id;
    },
    postedBy: async ({postedById}: Link, _: any, {mongo: {Users}}: MongoContext) => {
      // console.log('Link postedBy data: ', _);
      return await Users.findOne({_id: postedById});
    }
  },
  User: {
    id: (root: User) => {
      return root['_id'] || root.id;
    }
  }
};
