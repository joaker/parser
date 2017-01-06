import {parse, detect} from '../src';
import expectedData from "./files/short/data.json";
import {expect} from 'chai';
import path from 'path';

const fileDir = "files/short";

describe('parse', function(){
  it('should parse a comma-delimited csv into an array', function() {
    const delimiter = ',';
    const fileToParse = path.join(__dirname, fileDir, 'commas.csv')
    const parses = parse(fileToParse, {delimiter,} );
    return parses.then((result) => {
      expect(result).to.deep.equal(expectedData);
    });
  });
  it('should parse a pipe-delimited csv into an array', function() {
    const delimiter = '|';
    const fileToParse = path.join(__dirname, fileDir, 'pipes.csv')
    const readPromise = parse(fileToParse, {delimiter,} );
    return readPromise.then((result) => {
      expect(result).to.deep.equal(expectedData);
    });
  });
  it('should parse a space-delimited csv into an array', function() {
    const delimiter = ' ';
    const fileToParse = path.join(__dirname, fileDir, 'spaces.csv')
    const readPromise = parse(fileToParse, {delimiter,} );
    return readPromise.then((result) => {
      expect(result).to.deep.equal(expectedData);
    });
  });
});
