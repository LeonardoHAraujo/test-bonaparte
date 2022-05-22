import axios from 'axios';

import 'dotenv/config';
import { IViacep } from '../interfaces/IViacep';

class ViacepService {

  async findAddresByCep(cep: string) {
    try {
      const uri = process.env.VIACEP_BASE_URI!;

      const { data } = await axios.get<IViacep>(`${uri}/${cep}/json`);

      return data;

    } catch(error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return data address.');
    }
  }
}

export default ViacepService;
