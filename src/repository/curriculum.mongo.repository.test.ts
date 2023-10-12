import { Curriculum } from '../entities/curriculum.js';
import { CurriculumRepo } from './curriculum.mongo.repository.js';
import { CurriculumModel } from './curriculum.mongo.model.js';

describe('Given a CurriculumRepo class', () => {
  let repo: CurriculumRepo;
  beforeEach(() => {
    repo = new CurriculumRepo();
  });
  describe('When I instantiate it', () => {
    test('Then method create should be used', async () => {
      const mockCurriculum = {} as Curriculum;

      CurriculumModel.create = jest.fn().mockResolvedValue(mockCurriculum);

      const result = await repo.create(mockCurriculum);

      expect(CurriculumModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockCurriculum);
    });

    test('Then method search should be user', async () => {
      const mockCurriculum = { key: 'occupation', value: 'developer' };
      const mockResult = [{ occupation: 'developer' }];
      const exec = jest.fn().mockResolvedValue(mockResult);
      CurriculumModel.find = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec }),
      });

      const result = await repo.search(mockCurriculum);

      expect(CurriculumModel.find).toHaveBeenCalledWith({
        [mockCurriculum.key]: mockCurriculum.value,
      });
      expect(result).toEqual(mockResult);
    });

    test('Then method update should be used', async () => {
      const mockPartialCurriculum = {} as Partial<Curriculum>;
      const mockCurriculumUpdated = {} as Curriculum;

      const exec = jest.fn().mockResolvedValueOnce(mockCurriculumUpdated);
      CurriculumModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec }),
      });

      const result = await repo.update('1', mockPartialCurriculum);

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockCurriculumUpdated);
    });

    test('Then method query should be used', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      CurriculumModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({ exec }),
      });

      const result = await repo.query();

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('Then method queryById should be used', async () => {
      const mockCurriculumId = '1';
      const exec = jest.fn().mockResolvedValueOnce(mockCurriculumId);
      CurriculumModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec }),
      });

      const result = await repo.queryById('1');

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockCurriculumId);
    });

    test('Then method update should throw an error ...', async () => {
      const mockId = '283333';
      const mockCurriculum = {} as Curriculum;
      const exec = jest.fn().mockResolvedValueOnce(null);
      CurriculumModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec }),
      });
      await expect(repo.update(mockId, mockCurriculum)).rejects.toThrow();
    });

    test('Then method queryById should throw an error ...', async () => {
      const mockId = '283333';
      const exec = jest.fn().mockResolvedValueOnce(null);
      CurriculumModel.findById = jest.fn().mockReturnValueOnce({
        populate: jest.fn().mockReturnValue({ exec }),
      });
      await expect(repo.queryById(mockId)).rejects.toThrow();
    });

    test('Then method delete should be used and throw an error', async () => {
      const mockId = '2222';
      const exec = jest.fn().mockResolvedValueOnce(null);
      CurriculumModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrow();
    });
  });
});
