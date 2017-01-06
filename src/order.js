import {defaultOrder} from './constants';

export const direct = (a,b) => {
  const diff = a-b;
  return diff;
};
export const alpha = (a, b) => {
  const diff = a.toLowerCase().localeCompare(b.toLowerCase());
  return diff;
};

const orderers = {
  dateofbirth: direct,
  default: alpha,
};

const unpack = prop => inner => {
  return function sorter(a, b) {
    const result = inner(a[prop], b[prop]);
    return result;
  };
};
export const order = (uncasedLabel = defaultOrder, {descending = false}) => {
  const label = uncasedLabel.toLowerCase();
  const baseOrderer = orderers[label] || orderers.default;
  const orderer = unpack(label)(baseOrderer);

  return rows => {
    try{
      rows.sort(orderer);
      if(descending) {
        rows.reverse();
      }
      return rows;
    }catch(e) {
      console.log('error:', e.message, e, e.stack);
      console.log('ordering function:', orderer);
      throw e;
    }
  };
};
