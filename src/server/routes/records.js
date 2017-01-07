const Router = require('koa-router');
const koaBody = require('koa-body')();
const throwError = require('../util/error').throwError;

const handlers = require('./handlers');

// POST /records - Post a single data line in any of the 3 formats supported by your existing code
// GET /records/gender - returns records sorted by gender
// GET /records/birthdate - returns records sorted by birthdate
// GET /records/name - returns records sorted by name

const router = new Router();
const defaultParams = {order: 'last'};
const descendingValues = [true, 'true', 'descending'];

router
  .get(
    'list', '/:order',
    handlers.get
  );

const getWithLast = router.url('list', { order: 'last' });

console.log('GET with LAST REGISTERED:', getWithLast );

// // no chosen column?  Set one and keep going

const fromHomeRedirect = `/records${getWithLast}`;
console.log('LAST ROUTE REGISTERED:', fromHomeRedirect);
router.redirect('/', fromHomeRedirect);
// router.get('/', function *() {
//
//   console.log('LAST ROUTE:', getRedirect);
//   console.log('handling record request...', params, query);
//
//   this.redirect(getRedirect);
//   this.status = 301;
// });

router
  .post(
    'create',
    '/',
    koaBody,
    handlers.create
  );

router
  .del(
    'delete',
    '/:index',
    handlers.del
  );

module.exports = router;
