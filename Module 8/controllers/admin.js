const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {

    // console.log('inside admin get');
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });

};

exports.postAddProducts = (req, res, next) => {

    var request = req.body;
    //console.log(request);
    const product = new Product(
        null,
        request.title,
        request.imageUrl,
        request.price,
        request.description,
    );
    product.add();
    res.redirect('/');

};

exports.getAdminEditProducts = (req, res, next) => {

    const prodID = req.params.productID;
    const isEditing = req.query.edit;

    if (!isEditing) {
        return res.redirect('/');
      }

    Product.get(prodID, product => {
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: product,
            editing: isEditing,
        });
    });

};

exports.postAdminEditProducts = (req, res, next) => {

    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.add();
    res.redirect('/admin/products');

};

exports.postAdminDeleteProducts = (req, res, next) => {

    const prodID = req.query.id;

    Product.delete(prodID, () => {
        res.redirect('/');
    });

};

exports.getAdminProducts = (req, res, next) => {

    // console.log('inside admin get');
    Product.getAll(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Add Product',
            path: '/admin/products',
            formsCSS: true,
            productCSS: true,
            activeAddProduct: true
        });
    });
}
