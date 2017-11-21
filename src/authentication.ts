import {User} from './types';
import {Request} from 'express';
import {Collection} from 'mongodb';

const HEADER_REGEX = /bearer token-(.*)$/;

export default async ({headers: {authorization}}: Request, Users: Collection<User[]>) => {
  const reg = HEADER_REGEX.exec(authorization as string);
  if (reg) {
    const email = authorization && reg[1];
    const user = await Users.findOne({email});
    console.log('User: ', email && user);
    return email && user;
  }
  return false;
};
