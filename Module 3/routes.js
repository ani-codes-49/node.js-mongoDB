//creating another file for cleaning the code.

const fileSystem = require('fs');

const requestHandler = (req, res) => {

    const url = req.url;
    const method = req.method;

    if (url === '/') {
        
        res.write(
            '<html><head><title>Node.js page</title></head><body><form action = "/message" method = "POST"><input type = "text" name = "msg"></input><button type = "submit">Submit</button></form></body></html>'
        );
        res.end();
        return res;
    } else if (url === '/message' && method === 'POST') {
        // console.log('inside');
        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });

        //when data transmission is over
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = 'received text:' + parsedBody.split('=')[1];
            fileSystem.writeFile('newFile.txt', message, err => {
                // res.statusCode = 302;
                // res.setHeader('Location', '/');
                res.write(message);
                res.end();
                return res;
            });
        });

    } else {

        res.setHeader('Content-Type', 'text/html');
        res.write(
            '<html><head><title>Node.js page</title></head><body>Hello from the Node.js server !</body></html>'
        );

        res.end();
    }
}

module.exports = requestHandler;