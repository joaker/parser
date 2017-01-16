const _ = require('lodash');
const utils = require('../../../utils');
const normalize = utils.normalize;
const toObject = require('../../../../dist').toObject;

// // parse the body, and validate it
// const koaBody = require('koa-body')();
// const koaValidation = require('koa-validation')();


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

const delimiters = {
  comma: ',',
  commas: ',',
  ',': ',',

  pipe: '|',
  pipes: '|',
  '|': '|',

  space: ' ',
  spaces: ' ',
  ' ': ' ',
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

function* create (next) {
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


const defaultDelimiter = ',';
const getLine = body => {
  const line = Object.keys(body)[0];
  return line;
}

function* parseLine(next) {

  const delimiterName = (this.query || {}).delimiter;
  const delimiter = delimiters[delimiterName] || defaultDelimiter;
  const body = getLine(this.request.body);
  let jsonBody;

  try{
    const transform = toObject(delimiter);
    const nextBody = transform(body);
    this.request.body = nextBody;//JSON.stringify(nextBody); // replace the actual request with the JSON-format request
  }catch(e){
    console.log('An ERROR occurred: ', e.message, e)
    this.status = 422;
    this.body = 'input is malformed';
    return;
  }

  yield next;
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
  parseLine,
  del,
};
