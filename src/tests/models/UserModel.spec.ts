import { IUser } from '../../interfaces/IUser';
import BaseModel from '../../models/BaseModel';
import UserModel from '../../models/UserModel';


describe('Testing services of BaseModel class', () => {

  let user: IUser;
  let baseModel: BaseModel;
  let userModel: UserModel;

  beforeAll(() => {
    baseModel = new BaseModel();
    userModel = new UserModel();

    user = {
      name: 'test',
      birthDate: '2-2-2',
      email: 'test@test.com',
      password: 'test',
      num: 1,
      cep: '123'
    };
  });

  it('Testing if findUserByEmail positive result.', async () => {
    const collectionUser = await baseModel.getCollection('users');
    const { insertedId } = await collectionUser.insertOne(user);

    const findToken = await userModel.findUserByEmail('test@test.com');

    expect(findToken).toHaveProperty('name');

    await collectionUser.deleteOne({_id: insertedId});
  });

  it('Testing if createUser positive result.', async () => {
    const collectionUser = await baseModel.getCollection('users');

    const createToken = await userModel.createUser(user);

    expect(createToken).toBe(true);

    await collectionUser.deleteMany({name: 'test'});
  });

  it('Testing if findUserByEmail negative result.', () => {
    try {
      userModel.findUserByEmail('test@test.com');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return user by email.'));
    }
  });

  it('Testing if createUser negative result.', () => {
    try {
      userModel.createUser(user);

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not create user.'));
    }
  });

  afterAll(async () => {
    const collectionUser = await baseModel.getCollection('users');

    await collectionUser?.deleteOne({email: 'test@test.com'});
  });
});