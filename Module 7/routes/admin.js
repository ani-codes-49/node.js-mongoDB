const express = require('express');

const router = express.Router();

const prods = require('../controllers/products');

router.get('/add-product', prods.getAddProducts);

router.post('/add-product', prods.postAddProducts);


exports.router = router;