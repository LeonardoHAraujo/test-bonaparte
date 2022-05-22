import { ObjectId } from 'mongodb';
import BaseModel from '../../models/BaseModel';
import { IToken } from '../../interfaces/IToken';
import RefreshTokenModel from '../../models/RefreshTokenModel';


describe('Testing services of BaseModel class', () => {

  let token: IToken;
  let baseModel: BaseModel;
  let refreshTokenModel: RefreshTokenModel;

  beforeAll(() => {
    baseModel = new BaseModel();
    refreshTokenModel = new RefreshTokenModel();

    token = {
      expiresIn: 12345,
      userId: '12345'
    };
  });

  it('Testing if findTokenById positive result.', async () => {
    const collectionRefeshToken = await baseModel.getCollection('refresh_token');

    const { insertedId } = await collectionRefeshToken.insertOne(token);
    const findToken = await refreshTokenModel.findTokenById(insertedId.toString());

    expect(findToken).toHaveProperty('userId');

    await collectionRefeshToken.deleteOne({_id: insertedId});
  });

  it('Testing if createToken positive result.', async () => {
    const { insertedId } = await refreshTokenModel.createToken(token);

    expect(insertedId instanceof ObjectId).toBe(true);

    const collectionRefeshToken = await baseModel.getCollection('refresh_token');
    await collectionRefeshToken.deleteOne({_id: insertedId});
  });

  it('Testing if deleteTokensOfUsersById positive result.', async () => {
    const collectionRefeshToken = await baseModel.getCollection('refresh_token');

    await collectionRefeshToken.insertOne(token);
    const { deletedCount } = await refreshTokenModel.deleteTokensOfUsersById('12345');

    expect(deletedCount).toBe(1);
  });

  it('Testing if createToken negative result.', () => {
    try {
      refreshTokenModel.createToken(token);

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not create token.'));
    }
  });

  it('Testing if findTokenById negative result.', async () => {
    try {
      await refreshTokenModel.findTokenById('tokenId');

    } catch (error: any) {
      expect(error.message)
        .toBe('Could not return data by id.');
    }
  });

  it('Testing if findTokenById negative result.', async () => {
    try {
      await refreshTokenModel.deleteTokensOfUsersById('userIdTest');

    } catch (error: any) {
      expect(error.message)
        .toBe('Could not delete token.');
    }
  });

  afterAll(async () => {
    const collectionRefeshToken = await baseModel.getCollection('refresh_token');

    await collectionRefeshToken?.deleteOne({userId: '12345'});
  });
});