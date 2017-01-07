
require("babel-polyfill");
require('mocha-generators').install();
const _ = require('lodash');

const healthyMessage = require('../../src/server/util/healthy-message.js');
const expect = require('chai').expect;


const data = [
  {"last":"Cruz","first":"Heather","gender":"male","favoritecolor":"green","dateofbirth":"01/2017"},
  {"last":"Villarreal","first":"Blair","gender":"female","favoritecolor":"blue","dateofbirth":"24/2016"},
  {"last":"Carey","first":"Alma","gender":"male","favoritecolor":"green","dateofbirth":"08/25/2017"},
];
const aDatum = {"last":"Smith","first":"John","gender":"male","favoritecolor":"green","dateofbirth":"4/2/1942"};
const increasedData = data.slice().concat(aDatum);

const dataByDate = _.orderBy(data, ['dateofbirth'], ['asc', 'asc']);
const dataByGender = _.orderBy(data, ['gender'], ['asc', 'asc']);
const dataByName = _.orderBy(data, ['last', 'first'], ['asc', 'asc']);

const dataByDateDesc = _.orderBy(data, ['dateofbirth'], ['desc', 'desc']);
const dataByGenderDesc = _.orderBy(data, ['gender'], ['desc', 'desc']);
const dataByNameDesc = _.orderBy(data, ['last', 'first'], ['desc', 'desc']);


const records = [
  {"last":"Cruz","first":"Heather","gender":"male","favoritecolor":"green","dateofbirth":new Date("01/2017")},
  {"last":"Villarreal","first":"Blair","gender":"female","favoritecolor":"blue","dateofbirth":new Date("24/2016")},
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
    it('should get the initial records', function *(){
      console.log(`sending: ${JSON.stringify(aDatum)}`)
      const res = yield request
        .get(base)
        .expect(200)
        .end();

      const body = res.body;
      expect(res.body).to.deep.equal({success: true, data: data.slice()});
    });
  });

  describe(`${base} GET`, function() {
    describe('should get the initial records sorted by ascending', function() {
      it('date', function *(){
        const res = yield request.get(`${base}`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
      it('gender', function *(){
        const res = yield request.get(`${base}/gender`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
      it('name', function *(){
        const res = yield request.get(`${base}/name`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
    });
    describe('should get the initial records sorted by descending', function() {
      it('date', function *(){
        const res = yield request.get(`${base}/date?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
      it('gender', function *(){
        const res = yield request.get(`${base}/gender?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
      it('name', function *(){
        const res = yield request.get(`${base}/name?descending=descending`).expect(200).end();
        const body = res.body;
        expect(res.body).to.deep.equal({success: true, data: data.slice()});
      });
    });
  });

  describe(`${base} POST`, function() {
    it('should allow a record to be posted', function *(){
      console.log(`sending: ${JSON.stringify(aDatum)}`)
      const res = yield request
        .post(base)
        .send(aDatum)
        .expect(200)
        .end();

      const body = res.body;
      expect(res.body).to.deep.equal({success: true});
    });
  });



});
