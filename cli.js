#!/usr/bin/node

const modulePath = './dist/index.js';
var module = require(modulePath);
var format = require('json-format');
var parser = module.parser;
var constants = parser.constants;
var columnLabels = constants.columnLabels;
var delimiters = constants.delimiters;

var pap = require("posix-argv-parser");
var args = pap.create();
var v = pap.validators;

function createEnumerableValidator(values) {
  if(!values || !values.join) {
    throw new Error(
      'provided values are not enumerable: ' + JSON.stringify(values)
    );
  }
  return function enumerable(opt) {
    var value = opt.value;
    if (!values.includes(value)) {
      var message = `The provided value (${value}) is not one of (${values.join('|')}).`;
      throw new Error(message);
    }
  }
}

args.createOption(["-s", "--skip-count"], {
    // All options are optional

    // Implies hasValue: true, which allows parser to read -p2345 as -p=2345
    defaultValue: '1',
    description: 'lines to skip before reading.\nBy default, one line is skipped for the header',
    validators: [v.integer("Custom message. ${1} must be a number.")],
    transform: function (value) { return parseInt(value, 10); }
});

args.createOption(["-o", "--order"], {
    // All options are optional

    // Implies hasValue: true, which allows parser to read -p2345 as -p=2345
    defaultValue: 'last',

    validators: [createEnumerableValidator(columnLabels)],

    // // Both built-in and custom validations supported,
    // // synchronous as well as asynchronous (promise based)
    // validators: [v.string("Custom message. ${1} must be a number.")],

    // // Transforms allow you to get more intelligent values
    // // than raw strings back
    // transform: function (value) { return parseInt(value, 10); }
});

args.createOption(["-d", "--descending"], {
    hasValue: false,
});

// Operands are statements without options.
// Example: the path in `mything --port=1234 path/to/stuff`
function registerInputFile(name){
  args.createOperand(`${name}File`, {
    // Used in error msgs
    signature: `${name}-delimited csv file`,
    // Both will use default error messages
    validators: [v.file(), v.required()]
  });
}

var inputs = ['comma', 'pipe', 'space'];
var delim;
for(var delim of inputs) {
  registerInputFile(delim);
}

args.parse(process.argv.slice(2), function (errors, options) {
    if (errors) { return console.log(errors[0]); }

    // Various useful ways to get the values from the options.
    const order = options["-o"].value;
    const descending = options["--descending"].isSet;

    const commaPath = options.commaFile;
    const pipePath = options.pipeFile;
    const spacePath = options.spaceFile;

    const skipCount = options["--skip-count"].value;

    const targets = [{
      delimiter: ',',
      path:options.commaFile.value,
    },{
      delimiter: '|',
      path:options.pipeFile.value,
    },{
      delimiter: ' ',
      path:options.spaceFile.value,
    }];

    const parsesAll = targets.map(target =>
        parser.parse(target.path, {
          delimiter: target.delimiter,
          skipCount: skipCount
        }).then(rows => {
          return {
            source: target.path,
            rows: rows,
          };
        })
      );

    const addProps = props => obj => Object.assign({}, props,obj);

    const sourceRows = result => {
      const {source, rows} = result;
      const addSource = addProps({source,});
      const sourcedRows =  rows.map(row => addSource(row));
      return sourcedRows;
    };

    const combines = Promise.all(parsesAll).then((parseResults=[]) => {
      const rows = parseResults.reduce((flat, result) => flat.concat(sourceRows(result)), []);
      rows['source']
      return rows;
    });

    return combines.then(rows => {
      console.log(format(rows));
      console.log('skip count!', skipCount)
    });
});
