#!/usr/bin/node

const isDebugging = process.env.NOD_ENV === 'developement';

const modulePath = './dist/index.js';
var module = require(modulePath);
var format = require('json-format');
var parser = module.parser;
var constants = parser.constants;
var columnLabels = constants.columnLabels;
var delimiters = constants.delimiters;
var normalize = require('./src/utils').normalize;

var anyColumn = columnLabels.join('|');

var pap = require('posix-argv-parser');
var _ = require('lodash');
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

args.createOption(['-s', '--skip-count'], {
    // All options are optional

    // Implies hasValue: true, which allows parser to read -p2345 as -p=2345
    defaultValue: '1',
    description: 'lines to skip before reading. By default, one line is skipped for the header',
    validators: [v.integer('Custom message. ${1} must be a number.')],
    transform: function (value) { return parseInt(value, 10); }
});

args.createOption(['-o', '--order'], {
    defaultValue: 'last',
    description: `the column to order to output by. One of: (${anyColumn})`,
    validators: [createEnumerableValidator(columnLabels)],
});

args.createOption(['-d', '--descending'], {
    hasValue: false,
    description: 'switches the output\'s sort direction from the default ascending direction',
    transform: function (value) { return value === 'true' || value === 1; }
});

// Operands are statements without options.
// Example: the path in `mything --port=1234 path/to/stuff`
function registerInputFile(name){
  args.createOperand(`${name}File`, {
    // Used in error msgs
    signature: `${name}-delimited.csv`,
    description: `(required) a csv file separated by ${name}s`,
    // Both will use default error messages
    validators: [v.file(), v.required()]
  });
}

var inputs = ['comma', 'pipe', 'space'];
var delim;
for(var delim of inputs) {
  registerInputFile(delim);
}

// Register a help option.  The help option causes itself to be printed
args.createOption(['-h', '--help'], { description: 'Show this text' });

function getHelpMessages() {

  var optionMessages = args.options.map(function (opt) {
    var message = `  ${opt.signature}:\n\t${opt.description}`;
    return message;
  });

  const helpMessages = [
    helpIntro,
    '\n',
    'Options:',
  ].concat(optionMessages);

  return helpMessages;
}

function pushInto(recipient, provider){
  Array.prototype.push.apply(recipient, provider);
}

const helpIntro =
[
  'CLI Parser - github.com/joaker/parser\n ',
  'Usage:',
  '  npm run cli -- [options] <commaFile.csv> <pipeFile.csv> <spaceFile.csv>',
  'Example:',
  '  $ npm run cli -- --order dateofbirth --descending ./samples/commas.csv ./samples/pipes.csv ./samples/spaces.csv'
]
.join('\n');

args.parse(process.argv.slice(2), function (errors, options) {

    var allOptions = args.options;

    var exitMessages = [];
    var helpRequested = _.get(options, '--help.isSet');

    var showHelp = errors || helpRequested;

    if (errors) { pushInto(exitMessages, errors.map(e => `ERROR: ${e}\n`)); } // push the error messages into the exit messages
    if (showHelp) { pushInto(exitMessages, getHelpMessages()); } // If there is a help flag in the command, print each option

    // Print each exit message that exists, and exit if any were printed
    if(exitMessages.length) { return exitMessages.concat('\n\n').forEach(message => console.log(message)); }


    // Various useful ways to get the values from the options.
    const order = options['--order'].value;
    const descending = options['--descending'].isSet;

    const commaPath = options.commaFile;
    const pipePath = options.pipeFile;
    const spacePath = options.spaceFile;

    const skipCount = options['--skip-count'].value;

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
