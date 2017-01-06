
const format = date => {
    return (date.getMonth() + 1) +
    "/" +  date.getDate() +
    "/" +  date.getFullYear();
};


export const date = {
  toString: x => x ? format(x) : "",
  fromString: x => new Date(x),
}
export const noop = {
  toString: x => x,
  fromString: x => x,
};

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
