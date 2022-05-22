import { ObjectId } from 'mongodb';

import BaseModel from './BaseModel';
import { IToken } from '../interfaces/IToken';


class RefreshTokenModel extends BaseModel {

  async findTokenById(refreshTokenId: string) {
    try {
      const collectionToken = await this.getCollection('refresh_token');

      const query = {_id: new ObjectId(refreshTokenId)};

      return await collectionToken?.findOne(query);

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return data by id.');
    }
  }

  async createToken(token: IToken) {
    try {
      const collectionToken = await this.getCollection('refresh_token');

      return await collectionToken?.insertOne(token);

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not create token.');
    }
  }

  async deleteTokensOfUsersById(userId: string) {
    try {
      const collectionToken = await this.getCollection('refresh_token');

      const query = {userId: userId};

      return await collectionToken?.deleteMany(query);

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not delete token.');
    }
  }
}

export default RefreshTokenModel;
