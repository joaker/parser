
require("babel-polyfill");
require('mocha-generators').install();

const app = require('../../src/server');
const healthyMessage = require('../../src/server/util/healthy-message.js');
const request = require('co-supertest').agent(app.listen());
const expect = require('chai').expect;

const data = [
{"last":"Last","first":"First","gender":"Gender","favorite_color":"FavoriteColor","date_of_birth":"DateOfBirth"},
{"last":"Cruz","first":"Heather","gender":"male","favorite_color":"green","date_of_birth":"01/2017"},
{"last":"Villarreal","first":"Blair","gender":"female","favorite_color":"blue","date_of_birth":"24/2016"}
];

const records = [
{"last":"Last","first":"First","gender":"Gender","favorite_color":"FavoriteColor","date_of_birth":new Date("DateOfBirth")},
{"last":"Cruz","first":"Heather","gender":"male","favorite_color":"green","date_of_birth":new Date("01/2017")},
{"last":"Villarreal","first":"Blair","gender":"female","favorite_color":"blue","date_of_birth":new Date("24/2016")}
];

describe('API - ', function() {
  const health = 'health';
  describe(`${health} GET`, function() {
    it('should return object with a message of success', function *(){
      const res = yield request.get('/health').expect(200).end();
      expect(res.body).to.deep.equal(healthyMessage);
    });
  });
  const base = '/records';
  describe(`${base} GET`, function() {
    it('should allow a record to be posted', function *(){
      const datum = data[0];
      console.log(`sending: ${JSON.stringify(datum)}`)
      const res = yield request
        .post(base)
        .send(datum)
        .expect(200)
        .end();

      const body = res.body;
      expect(res.body).to.deep.equal({success: true});
    });
  });
});
