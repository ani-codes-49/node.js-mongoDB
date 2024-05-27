const http = require('http');
// console.log('sample');
const routes = require('./routes');
console.log('Hello');
const server = http.createServer(routes);

server.listen(8080);


