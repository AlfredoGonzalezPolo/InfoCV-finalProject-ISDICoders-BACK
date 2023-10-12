/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { Curriculum } from '../entities/curriculum.js';
import { CurriculumRepo } from '../repository/curriculum.mongo.repository.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { Controller } from './controller.js';
import { PayLoadToken } from '../services/auth.js';

import createDebug from 'debug';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('INFOCV:CurriculumController working');

export class CurriculumController extends Controller<Curriculum> {
  constructor(public repo: CurriculumRepo, private userRepo: UserRepo) {
    super();
    debug('Instantiated');
  }

  async post(request: Request, response: Response, next: NextFunction) {
    try {
      const { id: userId } = request.body.tokenPayload as PayLoadToken;
      const user = await this.userRepo.queryById(userId);
      delete request.body.tokenPayload;
      request.body.owner = userId;
      const newCurriculum = await this.repo.create(request.body);
      // User.curriculum.push(newCurriculum);
      // console.log(user.curriculum);
      // if (user.curriculum.length >= 1) {
      //   throw new HttpError(404, 'Not allowed');
      // }

      this.userRepo.update(user.id, user);
      response.status(201);
      response.send(newCurriculum);
    } catch (error) {
      next(error);
    }
  }
}
