import BaseModel from '../../models/BaseModel';
import { IMovie } from '../../interfaces/IMovie';
import MoviesModel from '../../models/MoviesModel';


describe('Testing services of BaseModel class', () => {

  let movie: IMovie;
  let movieForUpdate: IMovie;
  let baseModel: BaseModel;
  let moviesModel: MoviesModel;

  beforeAll(() => {
    baseModel = new BaseModel();
    moviesModel = new MoviesModel();

    movie = {
      tconst: 'tconst',
      titleType: 'titleType',
      primaryTitle: 'primaryTitle',
      originalTitle: 'originalTitle',
      isAdult: 'isAdult',
      startYear: 'startYear',
      endYear: 'endYear',
      runtimeMinutes: 'runtimeMinutes',
      genre: 'genre',
      averageRating: 'averageRating',
      numVotes: 'numVotes'
    };

    movieForUpdate = {
      titleType: 'Updated'
    };
  });

  it('Testing if getPaginatedMovies positive result.', async () => {
    const movies = [];
    const collectionMovies = await baseModel.getCollection('movies');

    for (let i=0; i < 5; i++) {
      const objMovie: IMovie = {
        tconst: 'tconst',
        numVotes: i.toString()
      }

      movies.push(objMovie);
    }

    await collectionMovies.insertMany(movies);

    const dataPaginated = await moviesModel.getPaginatedMovies(5, 0);

    expect(dataPaginated.length).toBe(5);

    await collectionMovies.deleteMany({tconst: 'tconst'});
  });

  it('Testing if findMovieById positive result.', async () => {
    const collectionMovies = await baseModel.getCollection('movies');

    const { insertedId } = await collectionMovies.insertOne(movie);
    const findMovie = await moviesModel.findMovieById(insertedId.toString());

    expect(findMovie).toHaveProperty('tconst');

    await collectionMovies.deleteOne({_id: insertedId});
  });

  it('Testing if updateMovie positive result.', async () => {
    const collectionMovies = await baseModel.getCollection('movies');

    const { insertedId } = await collectionMovies.insertOne(movie);
    const isUpdatedMovie = await moviesModel.updateMovie(insertedId.toString(), movieForUpdate);

    expect(isUpdatedMovie).toBe(true);

    await collectionMovies.deleteOne({_id: insertedId});
  });

  it('Testing if getPaginatedMovies negative result.', async () => {
    try {
      moviesModel.getPaginatedMovies(5, 0);

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return paginated data.'));
    }
  });

  it('Testing if findMovieById negative result.', async () => {
    try {
      moviesModel.findMovieById('movieId');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return movie by id.'));
    }
  });

  it('Testing if updateMovie negative result.', async () => {
    try {
      moviesModel.updateMovie('movieId', movieForUpdate);

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not update movie.'));
    }
  });
});