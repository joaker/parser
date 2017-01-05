import {defaultDelimiter, delimiters, columnTypes, columnLabels} = './constants';

export const separator = (delim = defaultDelimiter) => input => {
  if(!input) return [];
  const parts = input.split(delim);
  return parts;
};
export const convertType = arg => input => {/* TODO implement */};
export const labeler = arg => input => {/* TODO implement */};
export const composeTransforms = arg => input => {/* TODO implement */};
export const lineToPerson = arg => input => {/* TODO implement */};
