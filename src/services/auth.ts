import { JwtPayload } from 'jsonwebtoken';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { secret } from '../config.js';
import { HttpError } from '../types/http.error.js';
import { compare, hash } from 'bcrypt';

export type PayLoadToken = {
  id: string;
  userName: string;
} & JwtPayload;

export class AuthServices {
  static verifyJWT(token: string) {
    try {
      const result = verify(token, secret!);
      if (typeof result === 'string') {
        throw new HttpError(498, 'Invalid Token', result);
      }

      return result as PayLoadToken;
    } catch (error) {
      throw new HttpError(498, 'Invalid Token', (error as Error).message);
    }
  }

  private static salt = 10;

  static createJWT(payload: PayLoadToken) {
    const token = sign(payload, secret!);
    return token;
  }

  static verifyJWTGettingPayload(token: string) {
    try {
      const result = verify(token, secret!);
      if (typeof result === 'string')
        throw new HttpError(498, 'Invalid token', result);
      return result as PayLoadToken;
    } catch (error) {
      throw new HttpError(498, 'Invalid token', (error as Error).message);
    }
  }

  static hash(value: string) {
    return hash(value, AuthServices.salt);
  }

  static compare(value: string, hash: string) {
    return compare(value, hash);
  }
}
