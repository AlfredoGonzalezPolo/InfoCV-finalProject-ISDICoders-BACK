import { Router as createRouter } from 'express';
import { CurriculumController } from '../controllers/curriculum.controller.js';
import { Curriculum } from '../entities/curriculum.js';
import { CurriculumRepo } from '../repository/curriculum.mongo.repository.js';
import { Repo } from '../repository/repo.js';
import { UserRepo } from '../repository/user.mongo.repository.js';
import { AuthInterceptor } from '../middlewares/auth.interceptor.js';
import { User } from '../entities/user.js';
import { FileMiddleware } from '../middlewares/files.js';

const repo: Repo<Curriculum> = new CurriculumRepo();
const userRepo: Repo<User> = new UserRepo();
const auth = new AuthInterceptor(repo);
const fileStore = new FileMiddleware();

const controller = new CurriculumController(repo, userRepo);
export const curriculumRouter = createRouter();

curriculumRouter.get('/', controller.getAll.bind(controller));
curriculumRouter.get('/:id', controller.getById.bind(controller));
curriculumRouter.post(
  '/',
  fileStore.singleFileStore('photo').bind(fileStore),
  auth.logged.bind(auth),
  fileStore.optimization.bind(fileStore),
  fileStore.saveImage.bind(fileStore),
  controller.post.bind(controller)
);
curriculumRouter.delete(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.delete.bind(controller)
);
curriculumRouter.patch(
  '/:id',
  auth.logged.bind(auth),
  auth.authorized.bind(auth),
  controller.patch.bind(controller)
);
