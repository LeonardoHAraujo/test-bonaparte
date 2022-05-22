import { compare } from 'bcryptjs';
import { Request, Response } from 'express';

import UserModel from '../models/UserModel';
import { IUser } from '../interfaces/IUser';
import { ITokenLogin } from '../interfaces/IToken';
import { IResponse } from '../interfaces/IResponse';
import TokenService from '../services/TokenService';
import RefreshTokenModel from '../models/RefreshTokenModel';


class AuthorizerController {

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body as IUser;

    let rep: IResponse = {};

    // Validations.
    if (!email) {
      rep.status = 400;
      rep.message = 'Email not found.';

      return res.status(rep.status).json(rep);

    } else if (!password) {
      rep.status = 400;
      rep.message = 'Password not found.';

      return res.status(rep.status).json(rep);
    }

    const userModel: UserModel = new UserModel();
    const userAlreadyExists = await userModel.findUserByEmail(email);

    if (!userAlreadyExists) {
      rep.status = 400;
      rep.message = 'User or password incorrect.';

      return res.status(rep.status).json(rep);
    }

    const passwordMatch = await compare(password, userAlreadyExists.password);

    if (!passwordMatch) {
      rep.status = 400;
      rep.message = 'User or password incorrect.';

      return res.status(rep.status).json(rep);
    }

    const tokenService: TokenService = new TokenService();
    const refreshTokenModel: RefreshTokenModel = new RefreshTokenModel();

    // Remove tokens of user in collection token.
    await refreshTokenModel.deleteTokensOfUsersById(userAlreadyExists._id.toString());

    // Generate a token and refresh token.
    const token = tokenService.generateToken(userAlreadyExists._id.toString());
    const { expiresIn, refreshTokenId } = await tokenService.generateRefreshToken(userAlreadyExists._id.toString());

    rep.status = 201;
    rep.token = token;
    rep.refreshToken = { expiresIn, refreshTokenId }

    return res.status(rep.status).json(rep);
  }

  async refreshTokenLogin(req: Request, res: Response) {
    const { refreshTokenId } = req.body as ITokenLogin;

    let rep: IResponse = {};

    // Validations.
    if (!refreshTokenId) {
      rep.status = 400;
      rep.message = 'Id refresh token not found.';

      return res.status(rep.status).json(rep);
    }

    const tokenService: TokenService = new TokenService();
    const refreshToken = await tokenService.generateTokenWithRefreshToken(refreshTokenId);

    if (!refreshToken) {
      rep.status = 400;
      rep.message = 'Refresh token not found.';

      return res.status(rep.status).json(rep);
    }

    rep.token = refreshToken?.token;

    if (refreshToken?.refreshTokenId) {
      rep.status = 201;
      rep.refreshToken = {
        refreshTokenId: refreshToken?.refreshTokenId,
        expiresIn: refreshToken?.expiresIn
      }
    }

    return res.status(rep.status || 200).json(rep);
  }
}

export default AuthorizerController;
