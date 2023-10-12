import { User } from '../entities/user.js';
import { UserModel } from './user.mongo.model.js';
import { UserRepo } from './user.mongo.repository.js';

jest.mock('./user.mongo.model.js');

describe('Given a UserRepo class', () => {
  let repo: UserRepo;
  beforeEach(() => {
    repo = new UserRepo();
  });
  describe('When I instantiate it', () => {
    test('Then method create should be used', async () => {
      const mockUser = {} as User;

      UserModel.create = jest.fn().mockResolvedValue(mockUser);

      const result = await repo.create(mockUser);

      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    test('Then method search should be user', async () => {
      const mockUser = { key: 'userName', value: 'kala' };
      const mockResult = [{ userName: 'kala', password: '12345' }];
      const exec = jest.fn().mockResolvedValue(mockResult);
      UserModel.find = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await repo.search(mockUser);

      expect(UserModel.find).toHaveBeenCalledWith({
        [mockUser.key]: mockUser.value,
      });
      expect(result).toEqual(mockResult);
    });

    test('Then method update should be used', async () => {
      const mockPartialUser = {} as Partial<User>;
      const mockUserUpdated = {} as User;

      const exec = jest.fn().mockResolvedValueOnce(mockUserUpdated);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({ exec });

      const result = await repo.update('1', mockPartialUser);

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockUserUpdated);
    });

    test('Then method query should be used', async () => {
      const exec = jest.fn().mockResolvedValueOnce([]);
      UserModel.find = jest.fn().mockReturnValue({
        exec,
      });

      const result = await repo.query();

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('Then method queryById should be used', async () => {
      const mockUserId = '1';
      const exec = jest.fn().mockResolvedValueOnce(mockUserId);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });

      const result = await repo.queryById('1');

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(mockUserId);
    });

    test('Then method update should throw an error ...', async () => {
      const mockId = '283333';
      const mockUser = {} as User;
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndUpdate = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.update(mockId, mockUser)).rejects.toThrow();
    });

    test('Then method queryById should throw an error ...', async () => {
      const mockId = '283333';
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findById = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.queryById(mockId)).rejects.toThrow();
    });

    test('Then method delete should be used', async () => {
      const mockUser = {
        id: '1',
        userName: 'a',
        email: 'a',
        password: 'a',
      } as User;
      const exec = jest.fn().mockResolvedValueOnce(mockUser);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValue({
        exec,
      });

      const result = await repo.delete('1');

      expect(exec).toHaveBeenCalled();
      expect(result).toEqual(undefined);
    });

    test('Then method delete should be used and throw an error', async () => {
      const mockId = '2222';
      const exec = jest.fn().mockResolvedValueOnce(null);
      UserModel.findByIdAndDelete = jest.fn().mockReturnValueOnce({
        exec,
      });
      await expect(repo.delete(mockId)).rejects.toThrow();
    });
  });
});
