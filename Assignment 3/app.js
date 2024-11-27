const express = require('express');

const router = require('./routes/user');

const app = express();

app.use(router);

app.listen(4000);