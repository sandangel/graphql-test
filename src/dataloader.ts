import {User} from './types';
import DataLoader = require('dataloader');
import {Collection} from 'mongodb';

async function batchUsers(Users: Collection<User>, keys: any) {
  return await Users.find({_id: {$in: keys}}).toArray();
}

export default ({Users}: {Users: Collection<User>}) => ({
  userLoader: new DataLoader<any, User>(keys => batchUsers(Users, keys), {cacheKeyFn: key => key.toString()})
});
