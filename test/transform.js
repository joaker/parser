import {separator, convertType, labeler, composeTransforms, lineToPerson} from '../src/transform';
import {columnTypes, columnLabels} from '../src/constants';
import {expect} from 'chai';
import path from 'path';

const data = {
  pipe: {
    keys: "Last|First|Gender|FavoriteColor|DateOfBirth",
    firstLine: "Cruz|Heather|male|green|1/1/2017",
  },
  comma: {
    keys: "Last,First,Gender,FavoriteColor,DateOfBirth",
    firstLine: "Cruz,Heather,male,green,1/1/2017",
  },
  space: {
    keys: "Last First Gender FavoriteColor DateOfBirth",
    firstLine: "Cruz Heather male green 1/1/2017",
  },
};

const separated = {
  keys: ["Last","First","Gender","FavoriteColor","DateOfBirth"],
  firstLine: ["Cruz","Heather","male","green","1/1/2017"],
};

const labledValues = {
  "last": "Cruz",
  "first": "Heather",
  "gender": "male",
  "favoritecolor": "green",
  "dateofbirth": "1/1/2017",
};

const typedValues = {
  "last": "Cruz",
  "first": "Heather",
  "gender": "male",
  "favoritecolor": "green",
  "dateofbirth": new Date("1/1/2017"),
};

describe('separator', function(){
  describe('should transform',  function(){
    it('by creating a seperate transform function', function() {
      const transform = separator('|');
      expect(typeof transform).to.equal('function');
    });

    it('a pipe csv string to an array', function() {
      const transform = separator('|');
      const array = transform(data.pipe.firstLine);
      expect(array).to.deep.equal(separated.firstLine);
    });

    it('a space csv string to an array', function() {
      const transform = separator(' ');
      const array = transform(data.space.firstLine);
      expect(array).to.deep.equal(separated.firstLine);
    });

    it('a comma csv string to an array', function() {
      const transform = separator(',');
      const array = transform(data.comma.firstLine);
      expect(array).to.deep.equal(separated.firstLine);
    });

    it('a csv string to an array, using comma as the default separator', function(){
      const transform = separator();
      const array = transform(data.comma.firstLine);
      expect(array).to.deep.equal(separated.firstLine);
    });
  });
});

describe('labeler', function(){
  it('should return a function ', function() {
    const transform = labeler(columnLabels);
    expect(typeof transform).to.equal('function');
  });

  it('should label the columns', function() {
    const label = labeler(columnLabels);
    const labelResult = label(separated.keys);
    expect(labelResult).to.deep.equal(labledValues);
  });

});

describe('convertType', function(){
  it('should convert values according to their type', function (){
    const transform = convertType(columnTypes);
    const typedAndLabeled = transform(labledValues);
    expect(typedAndLabeled).to.deep.equal(typedValues);
  });
});

describe('composeTransforms', function(){
  it('should create a composite transform ', function() {
    const transform = composeTransforms(separator(), labeler(), convertType());
    const typedAndLabeled = transform(data.comma.firstLine);
    expect(typedAndLabeled).to.deep.equal(typedValues);
  });
});



describe('lineToPerson', function(){
  it('should transform a line into person data ', function() {
    const transform = composeTransforms(separator(), labeler(), convertType());
    const typedAndLabeled = transform(data.comma.firstLine);
    expect(typedAndLabeled).to.deep.equal(typedValues);
  });
});
