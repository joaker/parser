
require("babel-polyfill");
require('mocha-generators').install();
const _ = require('lodash');

const healthyMessage = require('../../src/server/util/healthy-message.js');
const expect = require('chai').expect;


const data = [
  {"last":"Cruz","first":"Heather","gender":"male","favoritecolor":"green","dateofbirth":"01/01/2017"},
  {"last":"Villarreal","first":"Blair","gender":"female","favoritecolor":"blue","dateofbirth":"08/24/2016"},
  {"last":"Carey","first":"Alma","gender":"male","favoritecolor":"green","dateofbirth":"08/25/2017"},
];

const lines = {
  comma: "Smith,John,male,green,04/02/1942",
  pipe: "Smith|John|male|green|04/02/1942",
  space: "Smith John male green 04/02/1942",
};
const aDatum = {"last":"Smith","first":"John","gender":"male","favoritecolor":"green","dateofbirth":"04/02/1942"};
const increasedData = data.slice().concat(aDatum);
const iDataByName = _.orderBy(increasedData, ['last', 'first'], ['asc', 'asc']);

// const dataByDate = _.orderBy(data, ['dateofbirth'], ['asc']);
const dataByDate = [
  {"last":"Villarreal","first":"Blair","gender":"female","favoritecolor":"blue","dateofbirth":"08/24/2016"},
  {"last":"Cruz","first":"Heather","gender":"male","favoritecolor":"green","dateofbirth":"01/01/2017"},
  {"last":"Carey","first":"Alma","gender":"male","favoritecolor":"green","dateofbirth":"08/25/2017"},
];


const dataByGender = _.orderBy(data, ['gender'], ['asc']);
const dataByName = _.orderBy(data, ['last', 'first'], ['asc', 'asc']);

const dataByNameDesc = _.orderBy(data, ['last', 'first'], ['desc', 'desc']);
const dataByDateDesc = dataByDate.slice().reverse();
// const dataByDateDesc = _.orderBy(data, ['dateofbirth'], ['desc']);
const dataByGenderDesc = _.orderBy(data, ['gender'], ['desc']);


const records = [
  {"last":"Cruz","first":"Heather","gender":"male","favoritecolor":"green","dateofbirth":new Date("01/01/2017")},
  {"last":"Villarreal","first":"Blair","gender":"female","favoritecolor":"blue","dateofbirth":new Date("08/24/2016")},
  {"last":"Carey","first":"Alma","gender":"male","favoritecolor":"green","dateofbirth":new Date("08/25/2017")},
];
const aRecord = {"last":"Smith","first":"John","gender":"male","favoritecolor":"green","dateofbirth":"4/2/1942"};
const increasedRecords = records.slice().concat(aRecord);


const health = 'health';
const base = '/records';


let app;
let request;
describe('API - ', function() {
  beforeEach(function() {
    app = require('../../src/server/createServer')(records.slice());
    request = require('co-supertest').agent(app.listen());
  });

  describe(`${health} GET`, function() {
    it('should return object with a message of success', function *(){
      const res = yield request.get('/health').expect(200).end();
      expect(res.body).to.deep.equal(healthyMessage);
    });
  });



  describe(`${base} GET`, function() {
    it('should redirect', function *(){
      const res = yield request
        .get(base)
        .expect(301)
        .expect('Location', '/records/name')
        .end();
    });
  });

  describe(`${base} GET`, function() {
    describe('should get the initial records sorted by ascending', function() {
      it('name', function *(){
        const res = yield request.get(`${base}/name`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByName.slice()});
      });
      it('date', function *(){
        const res = yield request.get(`${base}/date`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByDate.slice()});
      });
      it('gender', function *(){
        const res = yield request.get(`${base}/gender`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByGender.slice()});
      });
    });
    describe('should get the initial records sorted by descending', function() {
      it('name', function *(){
        const res = yield request.get(`${base}/name?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByNameDesc.slice()});
      });
      it('date', function *(){
        const res = yield request.get(`${base}/date?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByDateDesc.slice()});
      });
      it('gender', function *(){
        const res = yield request.get(`${base}/gender?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: dataByGenderDesc.slice()});
      });
    });
  });


  const toQueryString = (options={}) => {
    const parts = Object.keys(options).map(o => {
      const queryParam = `${o}=${options[o]}`;
      return queryParam;
    }).filter(x => x);
    const parameters = parts.join('&');
    if(!parameters.length){
      return "";
    }
    const queryString = `?${parameters}`;
    return queryString;
  };

  const postRecord = (data, params) => (desiredResponse = 200) => {
    const queryString = toQueryString(params);
    const encodedQuery = encodeURIComponent(queryString);
    return request
      .post(`${base}${queryString}`)
      .send(data)
      .expect(desiredResponse)
      .end();
  };

  describe(`${base} POST`, function() {
    it('should create from a comma-delimited line', function*() {
      const params = {delimiter: 'comma'};
      let res = yield postRecord(lines.comma, params)();

      expect(res.body).to.deep.equal({success: true});
      res = yield request.get(`${base}/name`).expect(200).end();
      expect(res.body).to.deep.equal({success: true, data: iDataByName});
    });

    it('should create from a pipe-delimited line', function*() {
      const params = {delimiter: 'pipe'};
      let res = yield postRecord(lines.pipe, params)();

      expect(res.body).to.deep.equal({success: true});
      res = yield request.get(`${base}/name`).expect(200).end();
      expect(res.body).to.deep.equal({success: true, data: iDataByName});
    });

    it('should create from a space-delimited line', function*() {
      const params = {delimiter: 'space'};
      let res = yield postRecord(lines.space, params)();

      expect(res.body).to.deep.equal({success: true});
      res = yield request.get(`${base}/name`).expect(200).end();
      expect(res.body).to.deep.equal({success: true, data: iDataByName});
    });

    it('should create from a comma-delimited line by default', function*() {
      const params = {};
      let res = yield postRecord(lines.comma, params)();

      expect(res.body).to.deep.equal({success: true});
      res = yield request.get(`${base}/name`).expect(200).end();
      expect(res.body).to.deep.equal({success: true, data: iDataByName});
    });
  });




  describe(`${base}/json POST`, function() {
    it('should allow a record to be posted with JSON', function *(){
      const res = yield request
        .post(`${base}/json`)
        .send(aDatum)
        .expect(200)
        .end();

      const body = res.body;
      expect(res.body).to.deep.equal({success: true});
    });

    it('can get the posted JSON record afterwards', function *(){
      let res = yield request
        .post(`${base}/json`)
        .send(aDatum)
        .expect(200)
        .end();

      let body = res.body;
      expect(res.body).to.deep.equal({success: true});

      res = yield request.get(`${base}/name`).expect(200).end();
      body = res.body;
      expect(res.body).to.deep.equal({success: true, data: iDataByName});


    });

  });

});
