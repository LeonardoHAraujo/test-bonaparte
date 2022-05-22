import { MongoClient, Collection } from 'mongodb';

import 'dotenv/config';


class BaseModel {

  async getCollection(collectionName: string) {
    try {
      const connUri = process.env.ENVIRONMENT == 'dev' ? process.env.MONGO_URL_DEV! : process.env.MONGO_URL_DOCKER!;
      const client = new MongoClient(connUri);

      await client.connect();

      return client.db(process.env.DB_NAME!).collection(collectionName);

    } catch(error) {
      // TODO: Implement better tratment for production.

      throw new Error('Could not return collection.');
    }
  }
}

export default BaseModel;
