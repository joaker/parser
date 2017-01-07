module.exports =  (records = []) => function *(next){
  this.records = records;
  yield next;
};
