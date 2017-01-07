
const version = require('../../../package.json').version;
const OK = 'OK';
const healthyMessage = { OK, version, };

module.exports = healthyMessage;
