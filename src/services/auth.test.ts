import { compare, hash } from 'bcrypt';
import { AuthServices, PayLoadToken } from './auth';
import jwt, { JwtPayload } from 'jsonwebtoken';

jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('Given AuthServices class', () => {
  describe('When I use', () => {
    test('Then sign method should been called', () => {
      const payload = {} as PayLoadToken;
      AuthServices.createJWT(payload);

      expect(jwt.sign).toHaveBeenCalled();
    });

    test('Then hash method should been called', async () => {
      (hash as jest.Mock).mockResolvedValueOnce('12345');

      const result = await AuthServices.hash(' ');
      const expected = '12345';

      expect(hash).toHaveBeenCalled();
      expect(result).toBe(expected);
    });

    test('Then compare method should been called', async () => {
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const result = await AuthServices.compare('54321', '54321');
      const expected = true;

      expect(compare).toHaveBeenCalled();
      expect(result).toBe(expected);
    });

    test('Then it should ....', async () => {
      const token = '55555';
      (jwt.verify as jest.Mock).mockReturnValueOnce(token);

      expect(() => AuthServices.verifyJWTGettingPayload(token)).toThrow();
    });

    test('Then it should ....', async () => {
      const mockPayload = {} as JwtPayload;
      (jwt.verify as jest.Mock).mockReturnValueOnce(mockPayload);
      const result = AuthServices.verifyJWTGettingPayload(' ');

      expect(result).toEqual(mockPayload);
    });
  });
});
