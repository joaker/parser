const port = 3210;

const app = require('./src/server/createServer')();
app.listen(port);
console.log(`listening on: ${port}`)
