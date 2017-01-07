const Router = require('koa-router');
const healthyMessage = require('../util/healthy-message');

// the records sub-router
const records = require('../routes/records');

const router = new Router();

router.get('health', '/health', function *(){ this.body = healthyMessage});
router.use('/records', records.routes(), records.allowedMethods());
module.exports = router;
