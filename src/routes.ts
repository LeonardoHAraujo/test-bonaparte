import { Router } from 'express';

import UserController from './controllers/UserController';
import MoviesController from './controllers/MoviesController';
import FilterAuthenticated from './middlewares/FilterAuthenticated'
import AuthorizerController from './controllers/AuthorizerController';

const routes = Router();

// Controllers.
const user: UserController = new UserController();
const movies: MoviesController = new MoviesController();
const auth: AuthorizerController = new AuthorizerController();

// Middleware.
const requiredAuth: FilterAuthenticated = new FilterAuthenticated();

// Public routes.
routes.post('/auth', auth.authenticate);
routes.post('/create-user', user.createUser);
routes.post('/refresh-token', auth.refreshTokenLogin);

// Protected routes.
routes.get('/filmes/:id', requiredAuth.auth, movies.getMovieById);
routes.get('/filmes', requiredAuth.auth, movies.getMoviesPaginated);
routes.put('/filmes/:id', requiredAuth.auth, movies.updateMovieById);


export default routes;
