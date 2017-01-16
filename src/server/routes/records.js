const Router = require('koa-router');
// const koaBody = require('koa-body')();
const throwError = require('../util/error').throwError;
// const validate = require('koa-validation');

const validators = require('./handlers/validators');
const handlers = require('./handlers');

// parse the body, and validate it
const koaBody = require('koa-body')();
const koaValidation = require('koa-validation')();

// POST /records - Post a single data line in any of the 3 formats supported by your existing code
// GET /records/gender - returns records sorted by gender
// GET /records/birthdate - returns records sorted by birthdate
// GET /records/name - returns records sorted by name

const router = new Router();
const defaultParams = {order: 'name'};

router
  .get(
    'list', '/:order',
    handlers.get
  );

// no chosen column?  Set one and keep going
router.get('default', '/', function *() {

  const target = router.url('list', {order: 'name'});
  this.redirect(target);
  this.status = 301;
});

router
  .post(
    'create',
    '/',
    handlers.parseLine, // turn the line into json
    validators.create, // run the validator on the results
    handlers.create // turn the JSON into a record
  );

router
  .post(
    'create-json',
    '/json',
    validators.create,
    handlers.create
  );


router
  .del(
    'delete',
    '/:index',
    handlers.del
  );

module.exports = router;
