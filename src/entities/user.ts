import { Curriculum } from './curriculum.js';

export type User = {
  id: string;
  userName: string;
  email: string;
  password: string;
  curriculum: Curriculum[];
};
