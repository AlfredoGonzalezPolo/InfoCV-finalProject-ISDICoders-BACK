import { Photo } from '../types/helpers.js';
import { User } from './user.js';

export type Curriculum = {
  id: string;
  owner: User;
  photo: Photo;
  name: string;
  surname: string;
  age: number;
  studies: string;
  experience: string;
  skills: string;
  languages: string;
  occupation: 'developer' | 'electrician' | 'teacher';
};
