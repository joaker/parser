const moment = require('moment');

const formatDate = date => {
  const m = moment(date);
  // return (date.getMonth() + 1) +
  // "/" +  date.getDate() +
  // "/" +  date.getFullYear();
  return m.format('MM/DD/YYYY');
};

const normalize = record => {
  const dob = record.dateofbirth;
  const dateofbirth = formatDate(dob);
  return Object.assign({}, record, {dateofbirth,})
}

module.exports = {
  normalize,
  formatDate,
};
