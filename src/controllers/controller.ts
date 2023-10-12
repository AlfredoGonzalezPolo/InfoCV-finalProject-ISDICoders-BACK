import { NextFunction, Request, Response } from 'express';
import { Repo } from '../repository/repo.js';
import { ApiResponse } from '../types/response.api.js';

export abstract class Controller<T extends { id: string }> {
  protected repo!: Repo<T>;

  async getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const items = await this.repo.query();
      const responseApi: ApiResponse = {
        items,
        page: 1,
        count: items.length,
      };
      response.send(responseApi);
    } catch (error) {
      next(error);
    }
  }

  async getById(request: Request, response: Response, next: NextFunction) {
    try {
      response.send(await this.repo.queryById(request.params.id));
    } catch (error) {
      next(error);
    }
  }

  async post(request: Request, response: Response, next: NextFunction) {
    try {
      response.status(201);
      response.send(await this.repo.create(request.body));
    } catch (error) {
      next(error);
    }
  }

  async patch(request: Request, response: Response, next: NextFunction) {
    try {
      response.status(202);
      response.send(await this.repo.update(request.params.id, request.body));
    } catch (error) {
      next(error);
    }
  }

  async delete(request: Request, response: Response, next: NextFunction) {
    try {
      response.status(204);
      response.send(await this.repo.delete(request.params.id));
    } catch (error) {
      next(error);
    }
  }
}
