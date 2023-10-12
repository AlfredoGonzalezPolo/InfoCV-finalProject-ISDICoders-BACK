import { Router as createRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { User } from '../entities/user.js';
import { Repo } from '../repository/repo.js';
import { UserRepo } from '../repository/user.mongo.repository.js';

import createDebug from 'debug';
const debug = createDebug('INFOCV:UserRoutes');

debug('User router executed');

const repo: Repo<User> = new UserRepo() as Repo<User>;
const controller = new UserController(repo);
export const userRouter = createRouter();

userRouter.get('/', controller.getAll.bind(controller));
userRouter.get('/:id', controller.getById.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.patch('/login', controller.login.bind(controller));
