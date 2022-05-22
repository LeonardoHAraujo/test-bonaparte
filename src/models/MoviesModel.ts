import { ObjectId } from 'mongodb';

import BaseModel from './BaseModel';
import { IMovie } from '../interfaces/IMovie';


class MoviesModel extends BaseModel {

  async getPaginatedMovies(limit: number, skip: number) {
    try {
      const collectionMovies = await this.getCollection('movies');

      return await collectionMovies?.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skip)
        .toArray();

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return paginated data.');
    }
  }

  async findMovieById(id: string) {
    try {
      const collectionMovies = await this.getCollection('movies');

      const query = {_id: new ObjectId(id)};

      return await collectionMovies?.findOne(query);

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return movie by id.');
    }
  }

  async updateMovie(id: string, movie: IMovie) {
    try {
      const collectionUser = await this.getCollection('movies');

      const query = {_id: new ObjectId(id)};
      await collectionUser?.updateOne(query, {$set: movie});

      return true;

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not update movie.');
    }
  }
}

export default MoviesModel;
