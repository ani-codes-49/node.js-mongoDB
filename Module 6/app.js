// const http = require('http');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const adminData = require('./routes/admin');
const shop = require('./routes/shop');

const root_path = require('./utils/root_path');

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(root_path, 'public')));


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/admin', adminData.router);
app.use(shop);
// const server = http.createServer(app);
// server.listen(7000);

app.use((req, res, next) => {
    res.status(404).render('error', {pageTitle: 'Page not found'});
});

app.listen(7000);  