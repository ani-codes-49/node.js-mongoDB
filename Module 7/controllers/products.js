const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {

    // console.log('inside admin get');
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });

};

exports.postAddProducts = (req, res, next) => {

    const product = new Product(req.body.title);
    product.add();
    res.redirect('/');

};

exports.getProducts = (req, res, next) => {
    // console.log('inside shop: ', products);
    Product.getAll(products => {
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
};