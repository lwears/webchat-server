export interface BasicState {
  state: string;
  hospitalizedCurrently: number;
  fips: string;
  death: number;
  recovered: number;
}

export interface ExtendedState extends BasicState {
  total3Days: number;
}

export interface StateProperties {
  name: string;
  state: string;
  hospitalizedCurrently: number;
  fips: string;
  total3Days: number;
}

export interface StateGeometries {
  type: 'Topology';
  arcs: number[][][];
  id: string;
  properties: StateProperties;
}

export interface IncomingState {
  date: number;
  state: string;
  positive: number;
  negative: number;
  hospitalizedCurrently: number;
  inIcuCurrently: number;
  dataQualityGrade: string;
  lastUpdateEt: string;
  hash: string;
  dateChecked: '2020-05-09T20:00:00Z';
  death: number;
  total: number;
  totalTestResults: number;
  posNeg: number;
  fips: string;
  deathIncrease: number;
  hospitalizedIncrease: number;
  negativeIncrease: number;
  positiveIncrease: number;
  totalTestResultsIncrease: number;
}
