import {read} from '../src/read';
import expectedData from "./files/short/data.json";
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

  it('should read 20 lines', function() {
    const expectedReadCount = 20;
    const fileToRead = path.join(__dirname, fileDir, 'pipes.csv')
    const readPromise = read(fileToRead);
    return readPromise.then((readCount) => {
      expect(readCount).to.deep.equal(expectedReadCount);
    });
  });
  it('should transform into an array of length 20', function() {

    const target = [];
    const transformer = line => target.push(line);
    const fileToRead = path.join(__dirname, fileDir, 'pipes.csv');
    const readPromise = read(fileToRead, transformer);
    return readPromise.then((readCount) => {
      const expectedFirstUnparsed = "Last|First|Gender|FavoriteColor|DateOfBirth";
      const expectedSecondUnparsed = "Cruz|Heather|male|green|01/01/2017";
      const expectedLineCount = 20;
      expect(target.length).to.equal(expectedLineCount);
      expect(target[0]).to.equal(expectedFirstUnparsed);
      expect(target[1]).to.equal(expectedSecondUnparsed);

    });
  });
});
