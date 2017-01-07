

const isTest = process.env.NODE_ENV === "test";
const log = !isTest;

module.exports = function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;

  if (log) {
    console.log('X-Response-Time', ms + 'ms');
  }
  // this.set('X-Response-Time', ms + 'ms');
};
