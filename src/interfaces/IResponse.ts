import { IRefreshToken } from './IToken';
import { IMovie } from './IMovie';
import { WithId } from 'mongodb';

export interface IResponse {
  status?: number;
  message?: string;
  token?: string;
  refreshToken?: IRefreshToken;
  movie?: WithId<IMovie> | null;
  movies?: WithId<IMovie>[];
}
