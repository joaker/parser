export const delimiters = ['|', ',', ' '];
export const defaultDelimiter = ',';
export const defaultOrder = 'last';
export const defaultSkipCount = 1;

export const columnTypes = {
  "last": "string",
  "first": "string",
  "gender": "string",
  "favoritecolor": "string",
  "dateofbirth": "date",
  default: "string",
};
export const columnNames = ["Last","First","Gender","FavoriteColor","DateOfBirth"];
export const columnLabels = columnNames.map(n => n.toLowerCase());
