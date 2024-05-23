const http = require('http');

var code;

const server = http.createServer(
    (req, res) => {
        console.log(req);
        code = process.exit();
    });

server.listen(8080);
console.log('code: ', code);

