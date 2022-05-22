import BaseModel from './BaseModel';
import { IUser } from '../interfaces/IUser';


class UserModel extends BaseModel {

  async findUserByEmail(email: string) {
    try {
      const collectionUser = await this.getCollection('users');

      const query = {email: email};

      return await collectionUser?.findOne(query);

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return user by email.');
    }
  }

  async createUser(user: IUser) {
    try {
      const collectionUser = await this.getCollection('users');

      await collectionUser?.insertOne(user);

      return true;

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not create user.');
    }
  }
}

export default UserModel;
