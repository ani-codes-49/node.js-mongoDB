// const http = require('http');

const express = require('express');
const path = require('path');
const rootDir = require('./utils/root_path');

const app = express();

const admin = require('./routes/admin');
const shop = require('./routes/shop');
const root_path = require('./utils/root_path');

app.use(express.static(path.join(root_path, 'public')));
app.use(shop);
app.use('/admin', admin);

app.use('/', (req, res, next) => {
    res.status(404).sendFile(path.join(root_path, 'views', 'error.html'));
});

// const server = http.createServer(app);
// server.listen(7000);

app.listen(7000);  