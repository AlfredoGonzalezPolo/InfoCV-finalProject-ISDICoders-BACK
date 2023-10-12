/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities/user.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import { AuthServices, PayLoadToken } from '../services/auth.js';
import { LoginResponse } from '../types/response.api.js';
import { HttpError } from '../types/http.error.js';

import createDebug from 'debug';

const debug = createDebug('INFOCV:UserController working');

export class UserController extends Controller<User> {
  constructor(protected repo: UserRepo) {
    super();
    debug('instantiated');
  }

  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const password = await AuthServices.hash(request.body.password);
      request.body.password = password;
      const newUser = await this.repo.create(request.body);

      response.status(201);
      response.send(newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const data = await this.validateLogin(request);
      const payload: PayLoadToken = {
        id: data[0].id,
        userName: data[0].userName,
      };

      const token = AuthServices.createJWT(payload);
      const responseLogin: LoginResponse = {
        token,
        user: data[0],
      };

      response.send(responseLogin);
    } catch (error) {
      next(error);
    }
  }

  private async validateLogin(request: Request) {
    if (!request.body.email || !request.body.password)
      throw new HttpError(400, 'Bad request', 'Invalid User/Password');

    const data = await this.repo.search({
      key: 'email',
      value: request.body.email,
    });

    if (!data.length)
      throw new HttpError(400, 'Bad request', 'Invalid User/Password');

    const isUserValid = await AuthServices.compare(
      request.body.password,
      data[0].password
    );

    if (!isUserValid)
      throw new HttpError(400, 'Bad request', 'Invalid User/Password');

    return data;
  }
}
