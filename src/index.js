import {read} from './read'
import * as constants from './constants';
const {delimiters, defaultDelimiter, columnTypes, defaultSkipCount} = constants;
import {toPerson} from './transform';

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

export const print = (rows, {
  delim = defaultDelimiter,
  labels = columnLabels
}) => {

}

export const parser = {
  parse,
  print,
  constants,
};

export default parser;
