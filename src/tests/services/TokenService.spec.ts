import { IToken } from '../../interfaces/IToken';
import TokenService from '../../services/TokenService';
import RefreshTokenModel from '../../models/RefreshTokenModel';


describe('Testing services of TokenService class', () => {

  let tokenService: TokenService;
  let refreshTokenModel: RefreshTokenModel;

  beforeAll(() => {
    tokenService = new TokenService();
    refreshTokenModel = new RefreshTokenModel();
  });

  it('Testing if generateToken positive result.', () => {
    const token = tokenService.generateToken('userId');

    expect(typeof token).toBe('string');
  });

  it('Testing if generateRefreshToken positive result.', async () => {
    const obj = await tokenService.generateRefreshToken('refreshTokenId');

    expect(typeof obj).toBe('object');

    await refreshTokenModel.deleteTokensOfUsersById('refreshTokenId');
  });

  it('Testing if generateTokenWithRefreshToken positive result.', async () => {
    const tokenFake: IToken = {
      expiresIn: 12345,
      userId: '12345'
    }

    const { insertedId } = await refreshTokenModel.createToken(tokenFake);
    const token = await tokenService.generateTokenWithRefreshToken(insertedId.toString());

    expect(token).toHaveProperty('token');

    await refreshTokenModel.deleteTokensOfUsersById('12345');
  });

  it('Testing if generateTokenWithRefreshToken negative result.', () => {
    try {
      tokenService.generateTokenWithRefreshToken('refreshToken');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not generate a token.'));
    }
  });

  it('Testing if generateToken negative result.', () => {
    try {
      tokenService.generateToken('userId');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return new token.'));
    }
  });

  it('Testing if generateRefreshToken negative result.', () => {
    try {
      tokenService.generateRefreshToken('refreshTokenId');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not generate a refesh token.'));
    }
  });

  afterAll(async () => {
    await refreshTokenModel.deleteTokensOfUsersById('refreshToken');
    await refreshTokenModel.deleteTokensOfUsersById('refreshTokenId');
  });
});
