import {read} from './read'
import * as constants from './constants';
const {delimiters, defaultDelimiter, columnTypes, defaultSkipCount} = constants;
import {toPerson} from './transform';
import {order} from './order';

export const parse = (filename, options = {}) => {
  const {
    delimiter = defaultDelimiter,
    skipCount = defaultSkipCount,
  } = options;

  const transform = toPerson(delimiter);
  const rows = [];
  const onRecord = row => rows.push(row);
  const reads = read(filename, onRecord, transform, {skipCount,});
  return reads.then((lineCount) => rows.slice(skipCount));
};

export const parser = {
  parse,
  constants,
  order,
};

export default parser;
