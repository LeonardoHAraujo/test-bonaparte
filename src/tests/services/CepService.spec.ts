import ViacepService from '../../services/CepService';


describe('Testing services of CepService class', () => {

  let cepService: ViacepService;

  beforeAll(() => cepService = new ViacepService());

  it('Testing if findAddresByCep positive result.', async () => {
    const dataAddress = await cepService.findAddresByCep('30642130');

    expect(dataAddress).toHaveProperty('uf');
  });

  it('Testing if findAddresByCep negative result.', () => {
    try {
      cepService.findAddresByCep('30642130');

    } catch (error) {
      expect(error)
        .rejects
        .toEqual(new Error('Could not return data address.'));
    }
  });
});
