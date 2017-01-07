const port = 3210;

const app = require('./src/server');
app.listen(port);
console.log(`listening on: ${port}`)
