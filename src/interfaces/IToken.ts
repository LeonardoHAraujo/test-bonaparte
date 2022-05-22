import { ObjectId } from 'mongodb';


export interface IToken {
  expiresIn: number;
  userId: string;
}

export interface ITokenLogin {
  refreshTokenId: string;
}

export interface IRefreshToken {
  refreshTokenId: ObjectId | undefined;
  expiresIn: number | undefined;
}
