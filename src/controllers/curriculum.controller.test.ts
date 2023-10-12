import { NextFunction, Request, Response } from 'express';
// Import { UserRepo } from '../repository/user.mongo.repository';
import { CurriculumRepo } from '../repository/curriculum.mongo.repository';
import { CurriculumController } from './curriculum.controller';
import { UserRepo } from '../repository/user.mongo.repository';
import { User } from '../entities/user';
import { Curriculum } from '../entities/curriculum';
// Import { AuthServices } from '../services/auth';
// import { HttpError } from '../types/http.error';

jest.mock('../services/auth');
describe('Given the UserController class', () => {
  const mockRepo = {
    queryById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  } as unknown as CurriculumRepo;

  const mockRepoUser = {
    queryById: jest.fn(),
    update: jest.fn(),
  } as unknown as UserRepo;
  const request = {
    query: {},
    body: {},
    params: {},
  } as unknown as Request;

  const response = {
    send: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;
  describe('When we instantiated it', () => {
    test('Then the method post should have been called', async () => {
      const controller = new CurriculumController(mockRepo, mockRepoUser);
      const mockUser = {
        id: '2',
        userName: 'a',
        email: 'a',
      } as unknown as User;

      const mockCurriculum = {
        id: '2',
        owner: 'a',
      } as unknown as Curriculum;

      mockRepo.create = jest.fn().mockResolvedValueOnce(mockCurriculum);
      mockRepoUser.queryById = jest.fn().mockResolvedValueOnce(mockUser);
      mockRepoUser.update = jest.fn().mockResolvedValueOnce(mockUser);

      request.body = { tokenPayload: { id: '2' }, owner: 'a' };

      await controller.post(request, response, next);

      expect(mockRepo.create).toHaveBeenCalledWith(request.body);
      expect(mockRepoUser.queryById).toHaveBeenCalledWith('2');
      expect(mockRepoUser.update).toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalled();
    });

    //     Test('Then method login should have been called', async () => {
    //       const controller = new UserController(mockRepo);
    //       request.body = { user: 'b', password: 'b' };
    //       (AuthServices.compare as jest.Mock).mockResolvedValueOnce(true);
    //       await controller.login(request, response, next);

    //       expect(response.send).toHaveBeenCalled();
    //     });
    //   });

    //   describe('When we have an error', () => {
    //     const error = new HttpError(400, 'Bad request', 'Invalid User/password');
    //     const mockRepo = {
    //       search: jest.fn().mockRejectedValue(error),
    //       create: jest.fn().mockRejectedValue(error),
    //       post: jest.fn().mockResolvedValue(error),
    //     } as unknown as UserRepo;

    //     const request = {
    //       body: { user: '', password: '' },
    //     } as unknown as Request;

    //     const response = {
    //       send: jest.fn(),
    //       status: jest.fn(),
    //     } as unknown as Response;
    //     const next = jest.fn() as NextFunction;
    //     const controller = new UserController(mockRepo);

    //     test('Then login should throw an error if ...', async () => {
    //       const error = new HttpError(400, 'Bad request', 'Invalid User/password');

    //       await controller.login(request, response, next);

    //       expect(next).not.toHaveBeenCalledWith(error);
    //     });

    //     test('Then login should throw an error if ...', async () => {
    //       request.body = { email: '12345', password: 'pepe' };
    //       (mockRepo.search as jest.Mock).mockResolvedValueOnce([]);
    //       await controller.login(request, response, next);

    //       expect(next).not.toHaveBeenCalledWith(error);
    //     });

    //     test('Then login should throw an error if ...', async () => {
    //       request.body = { email: '123455', password: 'p5epe' };
    //       (mockRepo.search as jest.Mock).mockResolvedValueOnce([
    //         { userName: '12345', password: 'pepe' },
    //       ]);
    //       (AuthServices.compare as jest.Mock).mockResolvedValueOnce(false);
    //       await controller.login(request, response, next);

    //       expect(next).not.toHaveBeenCalledWith(error);
    //     });

    //     test('Then login should throw an error if ...', async () => {
    //       const controller = new UserController(mockRepo);
    //       const error = new HttpError(400, 'Bad request', 'Invalid User/Password');
    //       request.body = { email: '12345', password: 'pepe' };
    //       (mockRepo.search as jest.Mock).mockResolvedValueOnce([
    //         { userName: '12345', password: 'pepe' },
    //       ]);
    //       (AuthServices.compare as jest.Mock).mockResolvedValueOnce(false);
    //       await controller.login(request, response, next);

    //       expect(next).toHaveBeenCalledWith(error);
    //     });
    //   });

    //   describe('When there is an instantiate of error', () => {
    //     const error = new Error('An error occurred');
    //     const mockRepo = {
    //       post: jest.fn().mockRejectedValue(error),
    //     } as unknown as UserRepo;
    //     const request = {
    //       body: { password: '54321' },
    //     } as unknown as Request;
    //     const response = {
    //       send: jest.fn(),
    //       status: jest.fn(),
    //     } as unknown as Response;

    //     const controller = new UserController(mockRepo);
    //     const next = jest.fn() as NextFunction;

    //     test('Then the register method should throw Error when ...', async () => {
    //       (AuthServices.hash as jest.Mock).mockRejectedValueOnce(error);
    //       await controller.register(request, response, next);
    //       expect(next).toHaveBeenCalledWith(error);
    //     });
  });
});
