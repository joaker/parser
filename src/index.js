import read from './read'
import {delimiters, defaultDelimiter} from './constants';
import {composeTransforms} from './transform';

export const parse = (filename, {
  delimiter = defaultDelimiter,
}) => {
  const transform = composeTransforms(delimiter);
  const rows = [];
  const onRecord = row => rows.push(row);
  const reads = read(filename, onRecord, )
  return reads.then((lineCount) => rows);
};

export default parse;
