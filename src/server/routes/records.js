const Router = require('koa-router');
const koaBody = require('koa-body')();
const throwError = require('../util/error').throwError;
// POST /records - Post a single data line in any of the 3 formats supported by your existing code
// GET /records/gender - returns records sorted by gender
// GET /records/birthdate - returns records sorted by birthdate
// GET /records/name - returns records sorted by name
const router = new Router();
const defaults = {order: 'last', descending: false};
router
  .get(
    'list',
    '/:order/:descending',
    function *(next) {
      console.log('Hello, get');
      console.log('params: ', this.params);
      const defaultedParams = Object.assign({}, defaults, this.params);
      console.log('params (defaulted): ', defaultedParams);
      this.body = {
        method: 'get',
        url: this.url,
        params: defaultedParams,
      };
      yield next;
    });
router
  .post(
    'create',
    '/',
    koaBody,
    function *(next) {
      try {
        const body = this.request.body;
        this.status = 200;
        throw Error('Not Implemented');
        this.body = {success: true, };
      }catch(e){
        this.body = {success: false, };
      }
    });

router
  .del(
    'delete',
    '/:index',
    function *(next) {
      const index = this.params.index || -1;
      if(index>=0){
        throwError(this, 'not implemented');
        yield next;
      } else {
        throwError(this, 'record of index ('+index+') not found', 400);
      }
    });

module.exports = router;
