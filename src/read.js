const fs = require('fs');


export const read = (filename, onRecord = x => x, transformer = x => x) => {

  return new Promise((res, rej) => {
    const fileNotFound = !fs.existsSync(filename);
    if(fileNotFound){
      const error = Error(`The file to read, <${filename}>, does not exist`);
      error.code = 'ENOENT';
      throw error;
    }
    const lineReader = require('readline').createInterface({
      input: fs.createReadStream(filename),
    });
    let count = 0;
    lineReader.on('line', line => {
      ++count;
      const record = transformer(line); // transform the record
      onRecord(record); // send the record back
    });
    lineReader.on('close', () => res(count))
  });
};
