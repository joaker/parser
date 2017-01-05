import {read} from './read'
import {delimiters, defaultDelimiter} from './constants';
import {toPerson} from './transform';

export const parse = (filename, options = {}) => {
  const {
    delimiter = defaultDelimiter,
  } = options;
  const transform = toPerson(delimiter);
  const rows = [];
  const onRecord = row => rows.push(row);
  const reads = read(filename, onRecord, transform);
  return reads.then((lineCount) => rows);
};

export default parse;
