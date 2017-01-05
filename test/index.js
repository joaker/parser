import * as parser from '../src';
import expectedData from "./files/data.json";
import expect from 'chai';

const dataFile = ''

describe('parser', function(){
  it('should parse a comma-delimited csv', function() {
    const delimiter = ',';
    const fileToParse = './files/commas';
    const readPromise = parser.parse(fileToParse, {delimiter, output: 'test-comma-csv.json'});
    return readPromise.then((actualData) => {
      expect(expectedData).to.deep.equal(jsonData);
    });
  });
  it('should parse a pipe-delimited csv', function() {
    const delimiter = '|';
    const fileToParse = './files/commas';
    const readPromise = parser.parse(fileToParse, {delimiter,});
    return readPromise.then((actualData) => {
      expect(expectedData).to.deep.equal(jsonData);
    });
  });
  it('should detect a space-delimited csv', function() {
    const delimiter = ' ';
    const fileToParse = './files/commas';
    const readPromise = parser.parse(fileToParse, {delimiter,});
    return readPromise.then((actualData) => {
      expect(expectedData).to.deep.equal(jsonData);
    });
  });
});
describe('delimiter detector', function(){
  it('detects pipe csv', function() {
    const fileToParse = './files/commas';
    const maxRowScan = 10;
    const candidates = [',', ' ', '|'];
    const readPromise = parser.detect(fileToParse, {
      maxRowScan,
      candidates,
    });
    return readPromise.then((actualData) => {
      expect(expectedData).to.deep.equal(jsonData);
    });
  });
});
