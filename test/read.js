import {read} from '../src/read';
import {defaultSkipCount} from "../src/constants";
import dataWithHeader from "./files/short/data.json";
const expectedData = dataWithHeader.slice(defaultSkipCount);
const expectedLineCount = expectedData.length;

import {expect} from 'chai';
import path from 'path';

const fileDir = "files/short";

describe('read', function(){
  it('should throw when file does not exist', function() {
    const fileToRead = path.join(__dirname, 'fake/file');
    const readPromise = read(fileToRead);
    return readPromise.catch(err => {
      expect(err.code).to.equal('ENOENT');
    });
  });

  it(`should read ${expectedLineCount} lines`, function() {
    const fileToRead = path.join(__dirname, fileDir, 'pipes.csv')
    const readPromise = read(fileToRead,x=>x, x=>x,{skipCount: 2,});
    return readPromise.then((readCount) => {
      expect(readCount).to.equal(expectedLineCount);
    });
  });
  
  it(`should report read lines`, function() {

    const target = [];
    const onRead = line => target.push(line);
    const transformer = line => line;
    const fileToRead = path.join(__dirname, fileDir, 'pipes.csv');
    const readPromise = read(fileToRead, onRead, transformer, {skipCount: 0});
    return readPromise.then((readCount) => {
      const expectedFirstUnparsed = "Last|First|Gender|FavoriteColor|DateOfBirth";
      const expectedSecondUnparsed = "Cruz|Heather|male|green|01/01/2017";
      expect(target[0]).to.equal(expectedFirstUnparsed);
      expect(target[1]).to.equal(expectedSecondUnparsed);

    });
  });
});
