import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { IResponse } from '../interfaces/IResponse';


class FilterAuthenticated {

  auth(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization;

    let rep: IResponse = {};

    // Validations.
    if (!authToken) {
      rep.status = 401;
      rep.message = 'Unalthorized.';

      return res.status(rep.status).json(rep);

    }

    const [_, token] = authToken.split(' ');

    try {
      verify(token, process.env.SECRET_KEY!);

      return next();

    } catch(error) {
      rep.status = 401;
      rep.message = 'Invalid token.';

      return res.status(rep.status).json(rep);
    }
  }
}

export default FilterAuthenticated;
