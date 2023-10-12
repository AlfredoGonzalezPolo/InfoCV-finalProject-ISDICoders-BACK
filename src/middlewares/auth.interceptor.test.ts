import { NextFunction, Request, Response } from 'express';
import { PayLoadToken, AuthServices } from '../services/auth';
import { AuthInterceptor } from './auth.interceptor';
import { HttpError } from '../types/http.error';
import { CurriculumRepo } from '../repository/curriculum.mongo.repository';

jest.mock('../services/auth');

describe('Given an interceptor', () => {
  describe('When it is instantiated and logged method is called', () => {
    test('Then next should have been called', () => {
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as PayLoadToken;
      const request = { body: { tokenPayload: mockPayload } } as Request;
      const response = {} as Response;
      request.get = jest.fn().mockReturnValueOnce('Bearer valid token');
      const mockRepo: CurriculumRepo = {} as unknown as CurriculumRepo;

      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(request, response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('When it is instantiated and authorized method is called', () => {
    test('Then next should have been called', async () => {
      const next = jest.fn() as NextFunction;
      const mockPayload = { id: '6' } as PayLoadToken;
      const request = {
        body: { tokenPayload: mockPayload },
        params: { id: '6' },
      } as unknown as Request;
      const response = {} as Response;
      const mockRepo: CurriculumRepo = {
        queryById: jest.fn().mockResolvedValue({ owner: { id: '6' } }),
      } as unknown as CurriculumRepo;

      const interceptor = new AuthInterceptor(mockRepo);
      interceptor.authorized(request, response, next);

      await expect(mockRepo.queryById).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When logged method is called but there is no authHeader', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as PayLoadToken;
      const request = { body: { tokenPayload: mockPayload } } as Request;
      const response = {} as Response;
      request.get = jest.fn().mockReturnValueOnce(undefined);
      const mockRepo: CurriculumRepo = {} as unknown as CurriculumRepo;

      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(request, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When logged method is called but the authHeader does not start with Bearer', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        401,
        'Not Authorized',
        'Not Bearer in Authorization header'
      );
      const next = jest.fn() as NextFunction;
      const mockPayload = {} as PayLoadToken;
      const request = { body: { tokenPayload: mockPayload } } as Request;
      const response = {} as Response;
      request.get = jest.fn().mockReturnValueOnce('Not valid token');
      const mockRepo: CurriculumRepo = {} as unknown as CurriculumRepo;

      const interceptor = new AuthInterceptor(mockRepo);
      (AuthServices.verifyJWT as jest.Mock).mockResolvedValueOnce(mockPayload);
      interceptor.logged(request, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When authorized method is called but there is no tokenPayload in the request body', () => {
    test('Then it should throw an error', () => {
      const error = new HttpError(
        498,
        'Token not found',
        'Token not found in Authorized interceptor'
      );
      const next = jest.fn() as NextFunction;
      const request = {
        body: { tokenPayload: undefined },
        params: { id: '1' },
      } as unknown as Request;
      const response = {} as Response;
      const mockRepo: CurriculumRepo = {} as unknown as CurriculumRepo;

      const interceptor = new AuthInterceptor(mockRepo);
      interceptor.authorized(request, response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('When authorized method is called but the body id is different from the params id', () => {
    const mockCurriculumRepo = {
      queryById: jest.fn().mockResolvedValue({ owner: { id: '6' } }),
    } as unknown as CurriculumRepo;

    const response = {} as unknown as Response;
    const next = jest.fn() as NextFunction;
    const authInterceptor = new AuthInterceptor(mockCurriculumRepo);

    test('Then it should throw an error', async () => {
      const error = new HttpError(401, 'Not authorized', 'Not authorized');
      const mockUserID = { id: '413' };
      const mockCurriculumID = { id: '14', owner: { id: '24' } };
      const req = {
        body: { tokenPayload: mockUserID },
        params: mockCurriculumID,
      } as unknown as Request;

      authInterceptor.authorized(req, response, next);

      await expect(mockCurriculumRepo.queryById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
