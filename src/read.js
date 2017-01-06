const fs = require('fs');
const {defaultSkipCount} = "./constants";

export const read = (filename, onRecord = x => x, transformer = x => x, options={}) => {
  const {skipCount=defaultSkipCount} = options;
  let totalScannedCount = 0;
  let linesRead = 0;
  const metadata = {
    totalScanned: 0,
    linesRead: 0,
    skipCount,
  }
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

    const startIndex = skipCount;
    lineReader.on('line', line => {
      metadata.totalScanned++;
      const isReading = metadata.totalScanned >= startIndex;
      if(isReading){
        metadata.linesRead++;
        const record = transformer(line); // transform the record
        onRecord(record); // send the record back
      }else {
        // nothing to do here, we're skipping these
      }
    });
    const createResolver = res => metadata => () => {
      res(metadata.linesRead)
    };
    lineReader.on('close', createResolver(res)(metadata));
  });
};
