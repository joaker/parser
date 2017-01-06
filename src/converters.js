export const date = x => new Date(x);
export const noop = x => x;

export const converters = {
  dateofbirth: date,
  default: noop,
};

export const getConverter = name =>{
  const fn = converters[name];
  const fnOrDefault = fn || noop;
  return fnOrDefault;
};
export default getConverter;
