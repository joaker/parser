


function* get(next) {
  const params = this.params;
  const query = this.query;
  console.log('handling record request...', params, query);
  const url = this.url;
  this.body = {
    method: 'get',
    url,
    params,
    query,
  };
  yield next;
}


function* create(next) {
  try {
    const order = this.params.order;
    const descending = descendingValues.some(v => v === this.query.descending);

    console.log(`record request for<order, descending>: <${order},${descending}>`)

    const body = this.request.body;
    this.status = 200;
    throw Error('Not Implemented');
    this.body = {success: true, };
  }catch(e){
    this.body = {success: false, };
  }
}

function* del (next) {
  const index = this.params.index || -1;
  if(index>=0){
    throwError(this, 'not implemented');
    yield next;
  } else {
    throwError(this, 'record of index ('+index+') not found', 400);
  }
}

module.exports = {
  get,
  create,
  del,
};
