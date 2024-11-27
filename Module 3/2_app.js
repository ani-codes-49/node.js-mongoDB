const http = require('http');
// console.log('sample');
const routes = require('./routes');

const server = http.createServer(routes);

server.listen(8080);


