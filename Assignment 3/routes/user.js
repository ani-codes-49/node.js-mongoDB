const express = require('express');

const router = express.Router();

const path = require('path');

router.use(express.static(path.join(__dirname, '..', 'public')));

router.use('/users', (req, res, next) => {

    res.sendFile(path.join(__dirname, '..', 'views', 'page2.html'));

});

router.use('/', (req, res, next) => {

    res.sendFile(path.join(__dirname, '..', 'views', 'page1.html'));

});

module.exports = router;