import { ObjectId } from 'mongodb';

export interface IUser {
  name: string;
  birthDate: string;
  email: string;
  password: string;
  num: number;
  cep: string;
  complement?: string;
}
