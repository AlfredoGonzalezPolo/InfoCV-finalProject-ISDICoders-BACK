import { User } from '../entities/user.js';
import { HttpError } from '../types/http.error.js';
import { Repo } from './repo.js';
import { UserModel } from './user.mongo.model.js';

import createDebug from 'debug';
const debug = createDebug('INFOCV:UserRepo');

export class UserRepo implements Repo<User> {
  constructor() {
    debug('User Repo', UserModel);
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find().exec();
    return data;
  }

  async queryById(id: string): Promise<User> {
    const data = await UserModel.findById(id).exec();
    if (data === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');
    return data;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    const newUser: User = await UserModel.create(data);
    return newUser;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const result = await UserModel.find({ [key]: value }).exec();
    return result;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const newUser = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (newUser === null)
      throw new HttpError(404, 'Not found', 'Bad id for the update');

    return newUser;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();

    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the delete');
  }
}
