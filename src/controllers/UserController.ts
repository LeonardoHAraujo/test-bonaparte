import { hash } from 'bcryptjs';
import { Request, Response } from 'express';

import UserModel from '../models/UserModel';
import { IUser } from '../interfaces/IUser';
import { IResponse } from '../interfaces/IResponse';
import ViacepService from '../services/CepService';


class UserController {

  async createUser(req: Request, res: Response) {
    const {
      name,
      birthDate,
      email,
      password,
      num,
      cep
    } = req.body as IUser;

    let rep: IResponse = {};

    // Validations.
    if (!name) {
      rep.status = 400;
      rep.message = 'Name not found.';

      return res.status(rep.status).json(rep);

    } else if (!birthDate) {
      rep.status = 400;
      rep.message = 'Birth Date not found.';

      return res.status(rep.status).json(rep);

    } else if (!email) {
      rep.status = 400;
      rep.message = 'Email not found.';

      return res.status(rep.status).json(rep);

    } else if (!password) {
      rep.status = 400;
      rep.message = 'Password not found.';

      return res.status(rep.status).json(rep);

    } else if (!num) {
      rep.status = 400;
      rep.message = 'Number not found.';

      return res.status(rep.status).json(rep);

    } else if (!cep) {
      rep.status = 400;
      rep.message = 'CEP not found.';

      return res.status(rep.status).json(rep);
    }

    const user: UserModel = new UserModel();
    const viacep: ViacepService = new ViacepService();

    // Validation if user alread exists.
    const isUserAlreadyExists = await user.findUserByEmail(email);

    if (isUserAlreadyExists) {
      rep.status = 400;
      rep.message = 'User already exists.';

      return res.status(rep.status).json(rep);
    }

    // Create passwd user and load data address of user.
    const [ passwd, data ] = await Promise.all([
      hash(req.body.password, 8),
      viacep.findAddresByCep('31573405')
    ]);

    // Molding data request for store in db.
    req.body.streetName = data?.logradouro;
    req.body.district = data?.bairro;
    req.body.city = data?.localidade;
    req.body.state = data?.uf;
    req.body.password = passwd;

    delete req.body.cep;

    if (!user.createUser(req.body)) {
      rep.status = 400;
      rep.message = 'Failed to create a user.';

      return res.status(rep.status).json(rep);
    }

    rep.status = 201;
    rep.message = `User created successfuly.`;

    return res.status(rep.status).json(rep);
  }
}

export default UserController;
