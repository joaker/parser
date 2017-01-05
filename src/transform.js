import {
  defaultDelimiter,
  delimiters,
  columnTypes,
  columnLabels
} from './constants';

export const separator = (delim = defaultDelimiter) => input => {
  if(!input) return [];
  const parts = input.split(delim);
  return parts;
};
export const convertType = arg => input => {/* TODO implement */};

// zip two arrays into an object
export const labeler = (casedLabels = columnLabels) => {
  const labels = casedLabels.map(l => l.toLowerCase());
  return values => labels.reduce((mapping, label, index) => {
    const value = values[index];
    mapping[label] = value;
    return mapping;
  }, {});
}
export const composeTransforms = (...transforms) => input => {
  const result = transforms.reduce((state, change) => {
    return change(state);
  }, input);
  return result;
};

export const toPerson = (delim = defaultDelimiter) => composeTransforms(
  separator(delim),
  labeler(),
  composeTransforms()
);

export default toPerson;
