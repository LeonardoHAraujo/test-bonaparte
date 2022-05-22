import fs from 'fs';
import path from 'path';

import 'dotenv/config';
import BaseModel from './models/BaseModel';


interface IDataCollection {
  tconst?: string;
  titleType?: string;
  primaryTitle?: string;
  originalTitle?: string;
  isAdult?: string;
  startYear?: string;
  endYear?: string;
  runtimeMinutes?: string;
  genres?: string;
  averageRating?: string;
  numVotes?: string;
}

class Migration extends BaseModel {

  parseData() {
    const fileMovies = fs.readFileSync(path.join(__dirname, `../${process.env.FILE_MOVIES_DATA!}`), { encoding: 'utf-8' });
    const fileMoviesRatings = fs.readFileSync(path.join(__dirname, `../${process.env.FILE_MOVIES_RATINGS_DATA!}`), { encoding: 'utf-8' });

    const jsonMovies = fileMovies.split('\n')
        .map(profile => {
          const [
            tconst,
            titleType,
            primaryTitle,
            originalTitle,
            isAdult,
            startYear,
            endYear,
            runtimeMinutes,
            genres
          ] = profile.split('\t');

          return {
            tconst,
            titleType,
            primaryTitle,
            originalTitle,
            isAdult,
            startYear,
            endYear,
            runtimeMinutes,
            genres
          }
        });

    const jsonMoviesRatings = fileMoviesRatings.split('\n')
        .map(profile => {
          const [
            tconst,
            averageRating,
            numVotes
          ] = profile.split('\t');

          return {
            tconst,
            averageRating,
            numVotes
          }
        });

    // Remove data head.
    jsonMovies.shift();
    jsonMoviesRatings.shift();

    const collectionMovie: IDataCollection[] = [];

    jsonMovies.map(movie => {
      const rating = jsonMoviesRatings.filter(movieRating => movie.tconst == movieRating.tconst);

      if (rating[0] && movie.tconst) {
        collectionMovie.push({
          ...movie,
          averageRating: rating[0].averageRating,
          numVotes: rating[0].numVotes
        });
      }
    });

    this.insertData(collectionMovie);
  }

  async insertData(data: IDataCollection[]) {
    try {
      const collectionMovies = await this.getCollection('movies');

      const res = await collectionMovies?.find({'tconst':{$exists:true}}).count();

      if (res) {
        console.log('Already exists data in movies');

        return null;
      }

      const inserted = await collectionMovies?.insertMany(data, {ordered: true});

      console.log(inserted?.insertedCount, 'documents inserted');

    } catch (error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not inserted data.');
    }
  }
}

new Migration().parseData();

