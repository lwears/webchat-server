// import assert from 'assert';
import covid19Service from './covid19Service';

describe('Covid19 Service - getStateStats Function', () => {
  test('covid19Service.getStateStats() returns array of length 56', async (done) => {
    expect.assertions(2);
    const result = await covid19Service.getStateStats();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(56);
    done();
  });
  test('covid19Service.getStateStats() returns array containing state objects', async (done) => {
    expect.assertions(1);
    const result = await covid19Service.getStateStats();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ state: 'AK' }),
        expect.objectContaining({ state: 'AL' }),
        expect.objectContaining({ state: 'AR' }),
      ])
    );
    done();
  });
});

describe('Covid19 Service - get3DayTotal Function', () => {
  test('covid19Service.get3DayTotal() returns number', async (done) => {
    expect.assertions(2);
    const result = await covid19Service.get3DayTotal('AL');
    expect(Number.isInteger(result)).toBeTruthy();
    expect(result).not.toBe(0);
    done();
  });
});

describe('Covid19 Service - getAllData Function', () => {
  test('covid19Service.getAllData() returns array', async (done) => {
    expect.assertions(2);
    const result = await covid19Service.getAllData();
    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(56);
    done();
  });
  test('covid19Service.getAllData() returns array containing state objects', async (done) => {
    expect.assertions(1);
    const result = await covid19Service.getAllData();
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ state: 'AK' }),
        expect.objectContaining({ state: 'AL' }),
        expect.objectContaining({ state: 'AR' }),
      ])
    );
    done();
  });
  test('covid19Service.getAllData() returns array containing remapped state objects', async (done) => {
    expect.assertions(4);
    const result = await covid19Service.getAllData();
    expect(result[0]).toHaveProperty('state');
    expect(result[0]).toHaveProperty('hospitalizedCurrently');
    expect(result[0]).toHaveProperty('total3Days');
    expect(result[0]).toHaveProperty('fips');
    done();
  });
});
