import { Curriculum } from '../entities/curriculum.js';
import { HttpError } from '../types/http.error.js';
import { CurriculumModel } from './curriculum.mongo.model.js';
import { Repo } from './repo.js';

import createDebug from 'debug';
const debug = createDebug('INFOCV:CurriculumRepo');

export class CurriculumRepo implements Repo<Curriculum> {
  constructor() {
    debug('Curriculum Repo', CurriculumModel);
  }

  async query(): Promise<Curriculum[]> {
    const data = await CurriculumModel.find().populate('owner').exec();
    return data;
  }

  async queryById(id: string): Promise<Curriculum> {
    const data = await CurriculumModel.findById(id).populate('owner').exec();
    if (data === null)
      throw new HttpError(404, 'Not found', 'Bad id for the query');
    return data;
  }

  async create(data: Omit<Curriculum, 'id'>): Promise<Curriculum> {
    const newCurriculum: Curriculum = await CurriculumModel.create(data);
    return newCurriculum;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Curriculum[]> {
    const result = await CurriculumModel.find({ [key]: value })
      .populate('owner')
      .exec();
    return result;
  }

  async update(id: string, data: Partial<Curriculum>): Promise<Curriculum> {
    const newCurriculum = await CurriculumModel.findByIdAndUpdate(id, data, {
      new: true,
    })
      .populate('owner')
      .exec();

    if (newCurriculum === null)
      throw new HttpError(404, 'Not found', 'Bad id for the update');

    return newCurriculum;
  }

  async delete(id: string): Promise<void> {
    const result = await CurriculumModel.findByIdAndDelete(id).exec();

    if (result === null)
      throw new HttpError(404, 'Not found', 'Bad id for the delete');
  }
}
