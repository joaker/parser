
# Parser

A CSV parser that will convert pipe, comma, or space separated files into objects.

Features:
- CLI provide
- REST api

## Installation - The usual suspects
```sh
git clone https://github.com/joaker/parser
cd parser
npm i
npm run build
```

## Script Commands - CLI

### Run CLI format
```sh
$ npm run cli -- <options> <path to comma file> <path to pipe file> <path to space file>
```

### Options


*CLI example command*
```sh
$ npm run cli -- --order dateofbirth --descending ./samples/commas.csv ./samples/pipes.csv ./samples/spaces.csv
```


### REST server

*Production*
```sh
$ npm run server # Start the server in production mode on http://localhost:3210
```

*Development*
```sh
$ npm run dev # Start the server in development mode (nicer formatting and whatnot)
```

## Rest API
