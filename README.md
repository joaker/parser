
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
```

### CLI commands
```sh

$ node cli.js <options> <path to comma file> <path to pipe file> <path to space file>

$ node cli.js --order dateofbirth --descending ./samples/commas.csv ./samples/pipes.csv ./samples/spaces.csv
