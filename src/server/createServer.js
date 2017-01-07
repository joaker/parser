const koa = require('koa');

const createServer = (initialRecords = []) => {
  let records = initialRecords;
  const app = koa();

  const isDevelopment = process.env.NODE_ENV === 'development';
  const pretty = !!isDevelopment;

  app.use(require('./middleware/init')(initialRecords));

  // Make writing a json api just easier
  app.use(require('koa-json')({pretty,}));

  // x-response-time
  app.use(require('./middleware/x-response-time'));

  // logger
  app.use(require('./middleware/logger'));

  // router
  // logger
  const router = require('./middleware/router');
  const routes = router.routes();
  app
    .use(routes)
    .use(router.allowedMethods());

  app.on('error', function(err) {
    if (process.env.NODE_ENV != 'test') {
      console.log('sent error %s to the cloud', err.message);
      console.log(err);
    }
  });

  return app;
}

module.exports = createServer;
