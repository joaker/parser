import {parse, detect} from '../src';
import expectedData from "./files/data.json";
import {expect} from 'chai';
import path from 'path';

describe('parse', function(){
  it('should parse a comma-delimited csv into an array', function() {
    const delimiter = ',';
    const fileToParse = path.join(__dirname, 'files/commas.csv')
    const parses = parse(fileToParse );
    return parses.then((result) => {
      expect(result).to.deep.equal(expectedData);
    });
  });
  it('should parse a pipe-delimited csv into an array', function() {
    const delimiter = '|';
    const fileToParse = path.join(__dirname, 'files/pipes.csv')
    const readPromise = parse(fileToParse );
    return readPromise.then((actualData) => {
      expect().to.deep.equal(expectedData);
    });
  });
  it('should parse a space-delimited csv into an array', function() {
    const delimiter = ' ';
    const fileToParse = path.join(__dirname, 'files/spaces.csv')
    const readPromise = parse(fileToParse );
    return readPromise.then((actualData) => {
      expect(expectedData).to.deep.equal(jsonData);
    });
  });
});
