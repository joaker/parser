
## Parser

A CSV parser that will convert pipe, comma, or space separated files into objects.

Features:
- CLI provide
- REST api (TODO)

### Installation - The usual suspects
```sh
git clone https://github.com/joaker/parser
cd parser
npm i
npm run build
```

## REST server

**Coming soon...**
(technically you can start the REST server with `npm run server` or `npm run dev`, but it doesn't doo much yet.  There is a health check)

### CLI commands
```sh

$ node cli.js <options> <path to comma file> <path to pipe file> <path to space file>

$ node cli.js --order dateofbirth --descending ./samples/commas.csv ./samples/pipes.csv ./samples/spaces.csv
```

There is also an npm script, for convenience:
```sh
$ npm run cli -- --order dateofbirth --descending ./samples/commas.csv ./samples/pipes.csv ./samples/spaces.csv
```
