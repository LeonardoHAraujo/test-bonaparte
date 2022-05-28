import { Request, Response } from 'express';

import MoviesModel from '../models/MoviesModel';
import { IPagination } from '../interfaces/IMovie';
import { IResponse } from '../interfaces/IResponse';


class MoviesController {

  async getMoviesPaginated(req: Request, res: Response) {
    const { page, limit } = req.query as IPagination;

    let rep: IResponse = {};

    // Validation.
    if (!page) {
      rep.status = 400;
      rep.message = 'Page param not found.';

      return res.status(rep.status).json(rep);

    } else if (!limit) {
      rep.status = 400;
      rep.message = 'Limit param not found.';

      return res.status(rep.status).json(rep);
    }

    const pageNumber: number = parseInt(page);
    const limitNumber: number = parseInt(limit);

    const skipIndex = (pageNumber - 1) * limitNumber;

    const moviesModel: MoviesModel = new MoviesModel();
    const movies = await moviesModel.getPaginatedMovies(limitNumber, skipIndex);

    rep.status = 200;
    rep.movies = movies;

    return res.status(rep.status).json(rep);
  }

  async getMovieById(req: Request, res: Response) {
    const { id } = req.params;

    let rep: IResponse = {};

    // Validation.
    if (!id) {
      rep.status = 400;
      rep.message = 'Id movie not found.';

      return res.status(rep.status).json(rep);
    }

    const moviesModel: MoviesModel = new MoviesModel();
    const movie = await moviesModel.findMovieById(id);

    if (!movie) {
      rep.status = 400;
      rep.message = 'Movie not found.';

      return res.status(rep.status).json(rep);
    }

    rep.status = 200;
    rep.movie = movie;

    return res.status(rep.status).json(rep);
  }

  async updateMovieById(req: Request, res: Response) {
    const { id } = req.params;

    let rep: IResponse = {};

    const due: string[] = [
      'tconst',
      'titleType',
      'primaryTitle',
      'originalTitle',
      'isAdult',
      'startYear',
      'endYear',
      'runtimeMinutes',
      'genres',
      'averageRating',
      'numVotes'
    ];

    // Validation.
    if (!id) {
      rep.status = 400;
      rep.message = 'Id movie not found.';

      return res.status(rep.status).json(rep);

    } else if (Object.keys(req.body).length === 0)  {
      rep.status = 400;
      rep.message = 'Empty body is invalid.';

      return res.status(rep.status).json(rep);
    }

    Object.keys(req.body).map(key => {
      const isValidField = due.filter(el => el == key)[0];

      if (!isValidField) {
        rep.status = 400;
        rep.message = `Field ${key} is invalid.`;

        return res.status(rep.status).json(rep);
      }
    });

    const moviesModel: MoviesModel = new MoviesModel();
    const movie = await moviesModel.updateMovie(id, req.body);

    if (!movie) {
      rep.status = 400;
      rep.message = 'Failed to update movie.';

      return res.status(rep.status).json(rep);
    }

    rep.status = 200;
    rep.message = 'Movie updated successfully.';

    return res.status(rep.status).json(rep);
  }
}

export default MoviesController;
