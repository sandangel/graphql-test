import {Link} from './types';
import {MongoClient} from 'mongodb';
const {Logger} = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017/hackernews';

export default async () => {
  const db = await MongoClient.connect(MONGO_URL);
  let logCount = 0;
  Logger.setCurrentLogger((msg: any, _: any) => {
    console.log(`MONGO DB REQUEST ${++logCount}: ${msg}`);
  });
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);
  return {Links: db.collection<Link[]>('links'), Users: db.collection('users'), Votes: db.collection('votes')};
};
