// koa-validation: https://github.com/srinivasiyer/koa-validation


const create = function * (next) {
  yield this.validateBody(
    {
      last: 'required', // 'required|minLength:4',
      first: 'required', // 'required|minLength:4',

      girlfiend: 'requiredIf:age,25',
      wife: 'requiredNotIf:age,22',
      gender: 'in:male, female, unspecified',
      dateofbirth: 'dateFormat:MM/DD/YYYY',
    }
  );
  yield next;
}

module.exports = {
  create,
};
