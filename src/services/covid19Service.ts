import axios from 'axios';
import { BasicState, ExtendedState, IncomingState } from '../types';

const baseUrl = 'https://covidtracking.com/api/v1/states/';

const getStateStats = async (): Promise<BasicState[]> => {
  const { data } = await axios.get(`${baseUrl}current.json`);
  return data.map(
    ({ state, hospitalizedCurrently, fips, death, recovered }: BasicState) => ({
      state,
      hospitalizedCurrently,
      fips,
      death,
      recovered,
    })
  );
};

const get3DayTotal = async (stateName: string): Promise<number> => {
  const { data } = await axios.get(`${baseUrl}${stateName}/daily.json`);
  return data.slice(0, 3).reduce((total: number, place: IncomingState) => {
    return total + place.deathIncrease;
  }, 0);
};

const getAllData = async (): Promise<ExtendedState[]> => {
  const states = await getStateStats();
  const result = await Promise.all(
    states.map(
      async ({ state, hospitalizedCurrently, fips, death, recovered }) => {
        const total3Days = await get3DayTotal(state);
        return {
          state,
          hospitalizedCurrently,
          total3Days,
          fips,
          death,
          recovered,
        };
      }
    )
  );

  return result;
};

export default {
  getStateStats,
  getAllData,
  get3DayTotal,
};
