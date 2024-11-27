const fileSystem = require('fs');

const requestHandler = (req, res) => {

    const url = req.url;
    const requestMethod = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Hello</title></head>');
        // res.write('<body><h1>Hello ! Welcome to Node.js </h1><body>');
        res.write(
            '<form action = "/create-user" method = "POST"><input type = "username" name = "username"></input><button type = "submit"> Submit</button></form>'
        );
        res.write('</html>');
        return res.end();
    } else if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>Users list</title></head>');
        res.write('<body><ul><li>User 1</li><li>User 2</li></ul><body>');
        res.write('</html>');
        return res.end();
    } else if (url === '/create-user' && requestMethod === 'POST') {

        const body = [];

        req.on('data', (chunk) => {
            body.push(chunk);
        });
        

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log('The data is: ', parsedBody);
            res.setHeader('Location', '/users')
        });
    }

}

module.exports = {
    handler: requestHandler,
    text: 'Hello'
};