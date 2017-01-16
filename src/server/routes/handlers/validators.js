// koa-validation: https://github.com/srinivasiyer/koa-validation

const create = function * (next) {
  yield this.validateBody(
    {
      last: 'required', // 'required|minLength:4',
      first: 'required', // 'required|minLength:4',
      gender: 'in:male, female, unspecified',
      dateofbirth: 'dateFormat:MM/DD/YYYY',
      favoritecolor: 'required',
    }
  );
  yield next;
};

module.exports = {
  create,
};
