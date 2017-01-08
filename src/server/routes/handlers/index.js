const _ = require('lodash');
const utils = require('../../../utils');
const normalize = utils.normalize;

const defaultOrder = 'name';
const descendingValues = [true, 'true', 'descending'];

const orderingColumns = {
  name: ['last', 'first'],
  last: ['last'],
  last: ['first'],
  gender: ['gender'],
  date: ['dateofbirth'],
  dateofbirth: ['dateofbirth'],
};


function* get(next) {
  try {
    const order = this.params.order || defaultOrder;
    const descending = this.query.descending && descendingValues.some(v => v === this.query.descending);

    const ordering = orderingColumns[order];
    const direction = descending ? 'desc' : 'asc';
    const directions = ordering.map(o => direction);

    const orderedRecords = _.orderBy(this.records, ordering, directions);
    const displayRecords = orderedRecords.map(normalize);

    this.body = {
      success:true,
      data: displayRecords,
    };
  } catch (e) {
    this.status = 504;
    const message = 'ERROR: ' + e.message;
    this.body = {
      message,
      stack: e.stack,
      method: 'get',
      url: this.url,
      params: this.params,
      query: this.query,
    };
  }
  yield next;
}


function* create(next) {
  if (this.validationErrors) { // do we have validation errors?  Get out of town
    console.log('bad request - has validation errors:', this.validationErrors);
    this.status = 422;
    this.body = this.validationErrors;
    return;
  }

  try {
    const order = this.params.order;
    const descending = descendingValues.some(v => v === this.query.descending);

    const body = this.request.body;


    // TODO - bring the 'transform' utility into the mix.  But for expediency, the json is close

    const person = Object.assign({}, body, {dateofbirth: new Date(body.dateofbirth)});

//todo
    this.records.push(person);

    this.status = 200;
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
