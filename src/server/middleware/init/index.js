module.exports =  (records = []) => function *(next){
  // console.log(`initializing request with ${ records.length } records...`)
  this.records = records;
  yield next;
};
