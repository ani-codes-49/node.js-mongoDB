const http = require('http');
const fileSystem = require('fs');

var code;

const server = http.createServer(
    (req, res) => {
        // console.log('url: ', req.url, '\n', 'method: ', req.method, '\n', 'headers: ', req.headers);
        // code = process.exit();
        // console.log('response: ', res);
        const url = req.url;
        const method = req.method;

        // console.log(url);
        if (url === '/') {
            res.write(
                '<html><head><title>Node.js page</title></head><body><form action = "/message" method = "POST"><input type = "text" name = "msg"></input><button type = "submit">Submit</button></form></body></html>'
            );
            res.end();
            return res;
        }

        if (url === '/message' && method === 'POST') {
            // //writing new file into the system
            // fileSystem.writeFileSync('newFile.txt', 'DUMMY');

            //response is sent in streams (chunks) in node.js

            //response to be stored in a array like structure
            //with the help of chunks (with Buffer)
            const body = [];

            //this is event listener for incoming data as stream (chunks) 
            req.on('data', (chunk) => {
                console.log('inside data');
                console.log('chunk: ', chunk);
                //simply appending the data into the body array
                body.push(chunk);
            });

            //this is event listener when the incoming data ends
            req.on('end', () => {
                console.log('inside end');
                const parsedBody = Buffer.concat(body).toString();
                // console.log(parsedBody);
                const message = 'received text: ' + parsedBody.split('=')[1];
                fileSystem.writeFileSync('workedSuccessfully.txt', message);
            });

            res.statusCode = 302;
            //this method is used for redirecting the user to the new page
            res.setHeader('Location', '/');
            return res.end();

        }

        res.setHeader('Content-Type', 'text/html');
        res.write(
            '<html><head><title>Node.js page</title></head><body>Hello from the Node.js server !</body></html>'
        );

        res.end(); // this method tells the sever that response has been finalized and will not be changed
    });

server.listen(8080);
// console.log('code: ', code);

