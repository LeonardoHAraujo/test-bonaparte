import dayjs from 'dayjs';
import { sign } from 'jsonwebtoken';

import 'dotenv/config';
import { IToken } from '../interfaces/IToken';
import RefreshTokenModel from '../models/RefreshTokenModel';


class TokenService {

  generateToken(userId: string) {
    try {
      return sign({}, process.env.SECRET_KEY!, {subject: userId, expiresIn: '180s'});

    } catch(error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return new token.');
    }
  }

  async generateTokenWithRefreshToken(refreshTokenId: string) {
    try {
      const refreshTokenModel: RefreshTokenModel = new RefreshTokenModel();

      const refreshToken = await refreshTokenModel.findTokenById(refreshTokenId);

      if (!refreshToken) return null;

      const token = this.generateToken(refreshToken?.userId);
      const refreshTokenExpired = dayjs().isAfter(dayjs.unix(refreshToken?.expiresIn));

      if (refreshTokenExpired) {
        await refreshTokenModel.deleteTokensOfUsersById(refreshToken?.userId);

        const { refreshTokenId, expiresIn } = await this.generateRefreshToken(refreshToken.userId);

        return { token, refreshTokenId, expiresIn }
      }

      return { token }

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not generate a token.');
    }
  }

  async generateRefreshToken(userId: string) {
    try {
      const expiresIn = dayjs().add(2, 'day').unix();
      const refreshTokenModel: RefreshTokenModel = new RefreshTokenModel();

      const data: IToken = {
        expiresIn,
        userId
      }

      const newRefreshToken = await refreshTokenModel.createToken(data);
      const refreshTokenId = newRefreshToken?.insertedId;

      return { refreshTokenId, expiresIn }

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not generate a refesh token.');
    }
  }
}

export default TokenService;
