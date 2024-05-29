const express = require('express');
const bodyParer = require('body-parser');
const path = require('path');
const root_dir = require('./util/root_path');
const error = require('./controllers/errors');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const admin = require('./routes/admin');
const user = require('./routes/shop');

app.use(bodyParer.urlencoded({ extended: false }));
app.use(express.static(path.join(root_dir.rootPath, 'public')));

app.use('/admin', admin.router);
app.use(user);

app.use(error.noPageFound);

app.listen(5000);