const express = require('express');
const adminData = require('./admin');
const router = express.Router();

router.get('/', (req, res, next) => {
    const products = adminData.body;
    console.log('inside shop: ', products);
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
});

module.exports = router;    