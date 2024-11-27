const express = require('express');
const rootDir = require('../utils/root_path');
const path = require('path');

const router = express.Router();

// this is get request which will only listen to the get requests
router.get('/', (req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;