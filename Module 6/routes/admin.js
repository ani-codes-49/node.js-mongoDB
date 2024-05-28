const express = require('express');

const path = require('path');

const rootPath = require('../utils/root_path');

const router = express.Router();

const body = [];

router.get('/add-product', (req, res, next) => {

    console.log('inside admin get');
    res.render('add-product', {
        pageTitle: 'Add Product', 
        path: '/admin/add-product', 
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });

});


router.post('/add-product', (req, res, next) => {

    body.push({ title: req.body.title });
    res.redirect('/');

});


exports.router = router;
exports.body = body;