import BaseModel from '../../models/BaseModel';


describe('Testing services of BaseModel class', () => {

  let baseModel: BaseModel;

  beforeAll(() => baseModel = new BaseModel());

  it('Testing if getCollection positive result.', async () => {
    const collection = baseModel.getCollection('TestGetCollection');

    expect(collection).not.toBeNull();
  });

  it('Testing if getCollection negative result.', async () => {
    try {
      baseModel.getCollection('TestGetCollection');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return collection.'));
    }
  });
});