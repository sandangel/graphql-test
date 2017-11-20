import {MongoClient} from 'mongodb';
import {Link} from './schema/resolvers';

const MONGO_URL = 'mongodb://localhost:27017/hackernews';

export default async () => {
  const db = await MongoClient.connect(MONGO_URL);
  return {Links: db.collection<Link[]>('links'), Users: db.collection('users')};
};
