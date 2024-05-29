const express = require('express');
const adminData = require('./admin');
const router = express.Router();
const prods = require('../controllers/products');

router.get('/', prods.getProducts);

module.exports = router; 