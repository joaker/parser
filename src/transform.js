import {
  defaultDelimiter,
  delimiters,
  columnTypes,
  columnLabels
} from './constants';
import {getConverter} from './converters';

export const separator = (delim = defaultDelimiter) => input => {
  if(!input) return [];
  const parts = input.split(delim);
  return parts;
};

export const convertType = (uncasedToType=columnTypes) => {
  const conversions = Object.keys(uncasedToType).reduce((partial, uncased) => {
    const label = uncased.toLowerCase();
    const converter = getConverter(label);
    partial[label] = converter;
    return partial;
  }, {});
  return values => Object.keys(values).reduce((partial, label) => {
    const converter = conversions[label];
    const converted = converter.fromString(values[label]);
    partial[label] = converted;
    return partial;
  }, {});
};

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
