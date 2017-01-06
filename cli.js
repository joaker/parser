#!/usr/bin/node

const isDebugging = process.env.NOD_ENV === "developement";

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
    defaultValue: 'last',
    validators: [createEnumerableValidator(columnLabels)],
});

args.createOption(["-d", "--descending"], {
    hasValue: false,
    transform: function (value) { return value === "true" || value === 1; }
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
    const order = options["--order"].value;
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
    const formatDate = date => {
        return (date.getMonth() + 1) +
        "/" +  date.getDate() +
        "/" +  date.getFullYear();
    };

    const normalize = record => {
      const dob = record.dateofbirth;
      const dateofbirth = formatDate(dob);
      return Object.assign({}, record, {dateofbirth,})
    }

    const sourceRows = result => {
      const {source, rows} = result;
      const propsToAdd = isDebugging ? {source,} : {};
      const addSource = addProps();
      const sourcedRows =  rows.map(row => addSource(row));
      return sourcedRows;
    };

    const orderer = parser.order(order, {descending});
    const combines = Promise.all(parsesAll).then((parseResults=[]) => {
      const rows = parseResults.reduce((flat, result) => flat.concat(sourceRows(result)), []);
      return rows;
    });

    const orders = combines.then(orderer);
    return orders.then(rows => {
      console.log(format(rows.map(normalize)));
      // console.log('skip count!', skipCount);
      // console.log('order?', order);
      // console.log('descending?', descending);
    });
});
