import {defaultOrder} from './constants';

export const direct = (a,b) => a-b;
export const alpha = (a, b) => a.toLowerCase().localeCompare(b.toLowerCase());

const orderers = {
  date: direct,
  default: alpha,
}

const order = (uncasedLabel = defaultOrder) => {
  const label = uncasedLabel.toLowerCase();
  const orderer = orderers[label];
  return rows => rows.sort(orderer);
};
